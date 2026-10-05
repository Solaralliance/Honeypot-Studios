"""HoneyPot Studio — FastAPI backend.

Endpoints:
  POST /api/contact           Contact form (rate-limited, honeypot, emails owner via Resend proxy)
  GET  /api/posts             Blog post summaries
  GET  /api/posts/{slug}      Full blog post
  POST /api/analytics/event   First-party interaction analytics (no PII)
  GET  /api/health            Health check

Security: OWASP-aligned headers, input validation, per-IP rate limiting,
server-side email templates with HTML escaping (no caller-controlled
recipients/subjects/bodies), secrets only from environment.
"""
import ipaddress
import logging
import os
import re
import uuid
from datetime import datetime, timedelta, timezone
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

from blog_data import BLOG_POSTS
from learn_data import LEARN_POSTS
from payments import create_payments_router
from offers import create_offer_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---------------------------------------------------------------------------
# Email (Emergent managed Resend proxy)
# ---------------------------------------------------------------------------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"  # constant, not env
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as http:
            resp = await http.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except Exception as e:  # noqa: BLE001 - log and surface as 502
        logger.error("Email send error: %s", str(e))
        raise HTTPException(status_code=502, detail="Failed to send email")


# ---------------------------------------------------------------------------
# App + middleware
# ---------------------------------------------------------------------------
app = FastAPI(title="HoneyPot Studio API", docs_url=None, redoc_url=None, openapi_url=None)
api_router = APIRouter(prefix="/api")


@app.middleware("http")
async def security_headers(request: Request, call_next):
    resp = await call_next(request)
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    resp.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    resp.headers["Cache-Control"] = "no-store" if request.url.path.startswith("/api") else "public"
    return resp


# ---------------------------------------------------------------------------
# Rate limiting (in-memory sliding window, per IP)
# ---------------------------------------------------------------------------
async def rate_limited(key: str, limit: int, window_seconds: int) -> bool:
    now = datetime.now(timezone.utc)
    bucket = int(now.timestamp() // window_seconds)
    bucket_key = f"{key}:{bucket}"
    await db.rate_limits.update_one(
        {"key": bucket_key},
        {
            "$inc": {"count": 1},
            "$setOnInsert": {
                "expires_at": datetime.fromtimestamp(
                    (bucket + 2) * window_seconds, timezone.utc
                )
            },
        },
        upsert=True,
    )
    record = await db.rate_limits.find_one(
        {"key": bucket_key}, {"_id": 0, "count": 1}
    )
    return bool(record and record["count"] > limit)


def client_ip(request: Request) -> str:
    """Use the proxy-observed client hop, never the caller-controlled first hop."""
    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        try:
            return str(ipaddress.ip_address(real_ip.strip()))
        except ValueError:
            pass
    return request.client.host if request.client else "unknown"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
ALLOWED_SERVICES = {
    "landing-page", "tradie-website", "custom-website", "crm-web-app",
    "website-revamp", "digital-marketing", "social-media", "website-hosting",
    "not-sure",
}


class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    service: str = Field(default="not-sure", max_length=40)
    message: str = Field(min_length=10, max_length=2000)
    company: str = Field(default="", max_length=200)  # honeypot — must stay empty


ALLOWED_EVENTS = {
    "page_view", "learn_page_view", "cta_click", "carousel_view", "blog_open",
    "enquiry_form_start", "enquiry_form_submit", "form_submit", "form_error",
    "enquiry_email_delivered", "enquiry_email_bounced",
    "checkout_start", "checkout_paid", "onboarding_submit",
}


class AnalyticsIn(BaseModel):
    event: str = Field(max_length=40)
    path: str = Field(default="/", max_length=200)
    meta: dict = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api_router.get("/health")
async def health():
    return {"status": "ok", "service": "honeypot-studio"}


@api_router.post("/contact")
async def contact(payload: ContactIn, request: Request):
    ip = client_ip(request)
    if payload.company:  # honeypot tripped — pretend success, drop silently
        return {"status": "ok"}
    if (
        await rate_limited(f"contact:{ip}", limit=5, window_seconds=600)
        or await rate_limited("contact:global", limit=100, window_seconds=600)
    ):
        raise HTTPException(status_code=429, detail="Too many enquiries. Please try again shortly.")
    if payload.service not in ALLOWED_SERVICES:
        raise HTTPException(status_code=422, detail="Unknown service selected.")

    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "service": payload.service,
        "message": payload.message,
        "created_at": now,
        "email_delivery": {
            "owner_notification": {"status": "pending", "message_id": None},
            "customer_confirmation": {"status": "pending", "message_id": None},
        },
    }
    await db.enquiries.insert_one(doc)

    service_label = payload.service.replace("-", " ").title()
    owner_html = (
        '<table role="presentation" width="100%"><tr><td style="padding:24px;'
        'font-family:Arial,sans-serif;color:#111">'
        f"<h2 style='margin:0 0 12px'>New enquiry — {escape(service_label)}</h2>"
        f"<p><strong>Name:</strong> {escape(payload.name)}<br>"
        f"<strong>Email:</strong> {escape(payload.email)}<br>"
        f"<strong>Service:</strong> {escape(service_label)}</p>"
        f"<p style='white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:8px'>"
        f"{escape(payload.message)}</p>"
        f"<p style='font-size:12px;color:#888'>Sent by {escape(EMAIL_FROM_NAME)} website contact form. "
        "We never ask for passwords or card details by email.</p>"
        "</td></tr></table>"
    )
    email_sent = True
    try:
        owner_message_id = await send_email(
            to=OWNER_EMAIL,
            subject=f"New website enquiry — {service_label}",
            html=owner_html,
            reply_to=payload.email,
        )
        await db.enquiries.update_one(
            {"id": doc["id"]},
            {"$set": {
                "email_delivery.owner_notification.status": "accepted",
                "email_delivery.owner_notification.message_id": owner_message_id,
            }},
        )
    except HTTPException:
        # Enquiry is safely stored in Mongo — email is best-effort so an
        # upstream rate limit never loses a lead or errors the visitor.
        email_sent = False
        await db.enquiries.update_one(
            {"id": doc["id"]},
            {"$set": {"email_delivery.owner_notification.status": "failed"}},
        )
        logger.error("Owner notification email failed for enquiry %s", doc["id"])

    confirm_html = (
        '<table role="presentation" width="100%"><tr><td style="padding:24px;'
        'font-family:Arial,sans-serif;color:#111">'
        f"<p>Hi {escape(payload.name.split()[0])},</p>"
        "<p>Thanks for reaching out to HoneyPot Studio — your enquiry has landed "
        "in our inbox and we will get back to you within one business day.</p>"
        f"<p style='font-size:12px;color:#888'>Sent by {escape(EMAIL_FROM_NAME)}. "
        "We never ask for passwords or card details by email.</p>"
        "</td></tr></table>"
    )
    try:
        customer_message_id = await send_email(
            to=payload.email,
            subject="We got your enquiry — HoneyPot Studio",
            html=confirm_html,
        )
        await db.enquiries.update_one(
            {"id": doc["id"]},
            {"$set": {
                "email_delivery.customer_confirmation.status": "accepted",
                "email_delivery.customer_confirmation.message_id": customer_message_id,
            }},
        )
    except HTTPException:
        await db.enquiries.update_one(
            {"id": doc["id"]},
            {"$set": {"email_delivery.customer_confirmation.status": "failed"}},
        )
        logger.warning("Confirmation email failed for enquiry %s", doc["id"])

    return {"status": "ok", "id": doc["id"], "email_sent": email_sent}


@api_router.get("/posts")
async def list_posts():
    posts = await db.blog_posts.find(
        {}, {"_id": 0, "slug": 1, "title": 1, "category": 1, "excerpt": 1,
             "read_time": 1, "date": 1, "image": 1}
    ).sort("date", -1).to_list(50)
    return {"posts": posts}


@api_router.get("/posts/{slug}")
async def get_post(slug: str):
    if not re.fullmatch(r"[a-z0-9-]{1,80}", slug):
        raise HTTPException(status_code=404, detail="Post not found")
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@api_router.get("/learn")
async def list_learn_posts():
    posts = await db.learn_posts.find(
        {}, {"_id": 0, "slug": 1, "title": 1, "heading": 1, "category": 1,
             "excerpt": 1, "read_time": 1, "date": 1, "image": 1}
    ).sort("date", -1).to_list(50)
    return {"posts": posts}


@api_router.get("/learn/{slug}")
async def get_learn_post(slug: str):
    if not re.fullmatch(r"[a-z0-9-]{1,80}", slug):
        raise HTTPException(status_code=404, detail="Learn article not found")
    post = await db.learn_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Learn article not found")
    return post


@api_router.post("/analytics/event")
async def analytics_event(payload: AnalyticsIn, request: Request):
    if payload.event not in ALLOWED_EVENTS:
        raise HTTPException(status_code=422, detail="Unknown event")
    ip = client_ip(request)
    if (
        await rate_limited(f"analytics:{ip}", limit=120, window_seconds=60)
        or await rate_limited("analytics:global", limit=2000, window_seconds=60)
    ):
        return {"status": "dropped"}
    await db.analytics.insert_one({
        "event": payload.event,
        "path": payload.path[:200],
        "meta": {str(k)[:40]: str(v)[:120] for k, v in list(payload.meta.items())[:8]},
        "ts": datetime.now(timezone.utc).isoformat(),
        "expires_at": datetime.now(timezone.utc) + timedelta(days=90),
    })
    return {"status": "ok"}


app.include_router(api_router)
app.include_router(create_payments_router(db, send_email))
app.include_router(create_offer_router(db, send_email, rate_limited, client_ip))

cors_origins = [
    origin.strip()
    for origin in os.environ["PAYMENT_ALLOWED_ORIGINS"].split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.on_event("startup")
async def seed_content():
    for post in BLOG_POSTS:
        await db.blog_posts.update_one({"slug": post["slug"]}, {"$set": post}, upsert=True)
    for post in LEARN_POSTS:
        await db.learn_posts.update_one({"slug": post["slug"]}, {"$set": post}, upsert=True)
    await db.analytics.create_index("ts")
    await db.enquiries.create_index("created_at")
    await db.payment_transactions.create_index("session_id", unique=True)
    await db.onboarding_questionnaires.create_index("session_id", unique=True)
    await db.enquiries.create_index("offer_unsubscribe_token", sparse=True)
    await db.rate_limits.create_index("key", unique=True)
    await db.rate_limits.create_index("expires_at", expireAfterSeconds=0)
    await db.analytics.create_index("expires_at", expireAfterSeconds=0)
    logger.info("Seeded %d blog posts and %d learn posts", len(BLOG_POSTS), len(LEARN_POSTS))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
