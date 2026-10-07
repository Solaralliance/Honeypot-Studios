"""Stripe Checkout and paid-customer onboarding routes."""
import asyncio
import hashlib
import hmac
import os
import secrets
import uuid
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from typing import Callable, Optional

import stripe
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).parent / ".env")
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
WEBHOOK_SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]
ONBOARDING_TOKEN_SECRET = os.environ["ONBOARDING_TOKEN_SECRET"]

PACKAGES = {
    "website_landing_aud": {
        "name": "Landing Page Build",
        "price": 548.0,
        "summary": "One focused page built to turn traffic into enquiries.",
    },
    "website_tradie_aud": {
        "name": "Tradie Website Build",
        "price": 1048.0,
        "summary": "A complete service website built to make the phone ring.",
    },
    "website_custom_aud": {
        "name": "Custom Website Build",
        "price": 2548.0,
        "summary": "A bespoke build planned around your business and workflows.",
    },
}


class CheckoutIn(BaseModel):
    lookup_key: str = Field(max_length=60)
    origin_url: str = Field(max_length=240)


class OnboardingIn(BaseModel):
    contact_name: str = Field(min_length=2, max_length=80)
    business_name: str = Field(min_length=2, max_length=120)
    industry: str = Field(min_length=2, max_length=100)
    current_website: str = Field(default="", max_length=240)
    services: str = Field(min_length=10, max_length=2000)
    ideal_customer: str = Field(min_length=5, max_length=1000)
    service_areas: str = Field(min_length=2, max_length=500)
    brand_voice: str = Field(max_length=40)
    brand_notes: str = Field(default="", max_length=1000)
    competitor_sites: str = Field(default="", max_length=1000)
    primary_goal: str = Field(min_length=5, max_length=1000)
    must_haves: str = Field(default="", max_length=1500)
    online_presence: str = Field(default="", max_length=1500)
    anything_else: str = Field(default="", max_length=1500)


def _token_for(session_id: str) -> str:
    signature = hmac.new(
        ONBOARDING_TOKEN_SECRET.encode(), session_id.encode(), hashlib.sha256
    ).hexdigest()
    return f"{session_id}.{signature}"


def _session_from_token(token: str) -> Optional[str]:
    try:
        session_id, supplied = token.rsplit(".", 1)
    except ValueError:
        return None
    expected = _token_for(session_id).rsplit(".", 1)[1]
    return session_id if hmac.compare_digest(supplied, expected) else None


async def _stripe(call: Callable, *args, **kwargs):
    return await asyncio.to_thread(call, *args, **kwargs)


def _customer_details(session) -> tuple[str, str]:
    details = session.get("customer_details") or {}
    return details.get("email") or "", details.get("name") or ""


def _is_payment_paid(session) -> bool:
    return session.get("payment_status") == "paid"


def create_payments_router(db, send_email: Callable) -> APIRouter:
    router = APIRouter(prefix="/api")

    async def fulfil(session) -> None:
        if not _is_payment_paid(session):
            return
        session_id = session["id"]
        email, name = _customer_details(session)
        await db.payment_transactions.update_one(
            {"session_id": session_id, "payment_status": {"$ne": "paid"}},
            {"$set": {
                "status": "completed",
                "payment_status": "paid",
                "customer_email": email,
                "customer_name": name,
                "stripe_payment_intent_id": session.get("payment_intent"),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
        if not email:
            return
        claimed = await db.payment_transactions.find_one_and_update(
            {
                "session_id": session_id,
                "onboarding_email_status": {"$in": ["pending", "failed"]},
            },
            {"$set": {"onboarding_email_status": "sending"}},
            projection={"_id": 0, "origin_url": 1, "package_name": 1},
        )
        if not claimed:
            return
        onboarding_url = f"{claimed['origin_url']}/onboarding?token={_token_for(session_id)}"
        first_name = escape((name or "there").split()[0])
        package_name = escape(claimed["package_name"])
        html = (
            '<table role="presentation" width="100%"><tr><td style="padding:24px;'
            'font-family:Arial,sans-serif;color:#111">'
            f"<p>Hi {first_name},</p>"
            f"<p>Your payment for <strong>{package_name}</strong> is confirmed.</p>"
            "<p>You know your business. We will not tell you how to run it. This short "
            "questionnaire gives us what we need to handle your online presence while you "
            "focus on the business itself.</p>"
            f'<p><a href="{escape(onboarding_url)}">Start your onboarding questionnaire</a></p>'
            "<p style='font-size:12px;color:#888'>Sent by HoneyPot Studio. We never ask for "
            "passwords or card details by email.</p></td></tr></table>"
        )
        try:
            message_id = await send_email(
                to=email,
                subject="Your HoneyPot Studio onboarding questionnaire",
                html=html,
            )
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "onboarding_email_status": "sent",
                    "onboarding_email_id": message_id,
                }},
            )
        except HTTPException:
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"onboarding_email_status": "failed"}},
            )

    @router.get("/payments/packages")
    async def packages():
        return {
            "packages": [
                {"lookup_key": key, **value} for key, value in PACKAGES.items()
            ]
        }

    @router.post("/payments/checkout")
    async def checkout(payload: CheckoutIn, request: Request):
        package = PACKAGES.get(payload.lookup_key)
        if not package:
            raise HTTPException(status_code=422, detail="Unknown website package")
        origin_url = payload.origin_url.rstrip("/")
        allowed_origins = {
            origin.strip().rstrip("/")
            for origin in os.environ["PAYMENT_ALLOWED_ORIGINS"].split(",")
            if origin.strip()
        }
        if (
            origin_url not in allowed_origins
            or not origin_url.startswith("https://")
        ):
            raise HTTPException(status_code=400, detail="Invalid checkout origin")
        prices = await _stripe(
            stripe.Price.list, lookup_keys=[payload.lookup_key], active=True, limit=1
        )
        if not prices.data:
            raise HTTPException(status_code=503, detail="Package checkout is unavailable")
        access_nonce = secrets.token_urlsafe(32)
        kwargs = {
            "line_items": [{"price": prices.data[0].id, "quantity": 1}],
            "mode": "payment",
            "success_url": (
                f"{origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
                f"&access={access_nonce}"
            ),
            "cancel_url": f"{origin_url}/payment/cancel",
            "billing_address_collection": "required",
            "customer_creation": "always",
            "metadata": {"lookup_key": payload.lookup_key, "origin_url": origin_url},
        }
        tax_mode = "managed"
        try:
            session = await _stripe(
                stripe.checkout.Session.create,
                **kwargs,
                managed_payments={"enabled": True},
            )
        except stripe.InvalidRequestError as error:
            message = (getattr(error, "user_message", "") or str(error)).lower()
            if "managed payments" not in message and "ineligible" not in message:
                raise
            tax_mode = "calculated"
            session = await _stripe(
                stripe.checkout.Session.create,
                **kwargs,
                automatic_tax={"enabled": True},
            )
        await db.payment_transactions.insert_one({
            "id": str(uuid.uuid4()),
            "session_id": session.id,
            "lookup_key": payload.lookup_key,
            "package_name": package["name"],
            "amount": package["price"],
            "currency": "aud",
            "origin_url": origin_url,
            "status": "initiated",
            "payment_status": "pending",
            "tax_mode": tax_mode,
            "onboarding_email_status": "pending",
            "onboarding_access_hash": hashlib.sha256(access_nonce.encode()).hexdigest(),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })
        return {"checkout_url": session.url, "session_id": session.id}

    @router.get("/payments/status/{session_id}")
    async def payment_status(session_id: str):
        record = await db.payment_transactions.find_one(
            {"session_id": session_id},
            {"_id": 0, "session_id": 1, "status": 1, "payment_status": 1},
        )
        if not record:
            raise HTTPException(status_code=404, detail="Transaction not found")
        if record["payment_status"] != "paid":
            try:
                session = await _stripe(stripe.checkout.Session.retrieve, session_id)
                if _is_payment_paid(session):
                    await fulfil(session)
                    record = await db.payment_transactions.find_one(
                        {"session_id": session_id},
                        {"_id": 0, "session_id": 1, "status": 1, "payment_status": 1},
                    )
            except stripe.StripeError:
                pass
        return record

    @router.get("/payments/onboarding-access/{session_id}")
    async def onboarding_access(session_id: str, access: str):
        record = await db.payment_transactions.find_one(
            {"session_id": session_id, "payment_status": "paid"},
            {"_id": 0, "session_id": 1, "onboarding_access_hash": 1},
        )
        supplied_hash = hashlib.sha256(access.encode()).hexdigest()
        if not record or not hmac.compare_digest(
            supplied_hash, record.get("onboarding_access_hash", "")
        ):
            raise HTTPException(status_code=404, detail="Paid transaction not found")
        return {"path": f"/onboarding?token={_token_for(session_id)}"}

    @router.get("/onboarding/{token}")
    async def onboarding_context(token: str):
        session_id = _session_from_token(token)
        if not session_id:
            raise HTTPException(status_code=404, detail="Onboarding link is invalid")
        record = await db.payment_transactions.find_one(
            {"session_id": session_id, "payment_status": "paid"},
            {"_id": 0, "package_name": 1, "onboarding_status": 1},
        )
        if not record:
            raise HTTPException(status_code=404, detail="Onboarding link is invalid")
        return {
            "package_name": record["package_name"],
            "completed": record.get("onboarding_status") == "completed",
        }

    @router.post("/onboarding/{token}")
    async def submit_onboarding(token: str, payload: OnboardingIn):
        session_id = _session_from_token(token)
        if not session_id:
            raise HTTPException(status_code=404, detail="Onboarding link is invalid")
        record = await db.payment_transactions.find_one(
            {"session_id": session_id, "payment_status": "paid"}, {"_id": 0}
        )
        if not record:
            raise HTTPException(status_code=404, detail="Onboarding link is invalid")
        now = datetime.now(timezone.utc).isoformat()
        answers = payload.model_dump()
        await db.onboarding_questionnaires.update_one(
            {"session_id": session_id},
            {"$set": {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "package_name": record["package_name"],
                "answers": answers,
                "submitted_at": now,
            }},
            upsert=True,
        )
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"onboarding_status": "completed", "updated_at": now}},
        )
        return {"status": "ok"}

    @router.post("/stripe/webhook")
    async def stripe_webhook(request: Request):
        body = await request.body()
        signature = request.headers.get("stripe-signature", "")
        try:
            event = stripe.Webhook.construct_event(body, signature, WEBHOOK_SECRET)
        except (ValueError, stripe.SignatureVerificationError):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")
        event_type = event["type"]
        obj = event["data"]["object"]
        if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
            await fulfil(obj)
        elif event_type == "checkout.session.async_payment_failed":
            await db.payment_transactions.update_one(
                {"session_id": obj["id"]},
                {"$set": {"status": "failed", "payment_status": "failed"}},
            )
        elif event_type == "checkout.session.expired":
            await db.payment_transactions.update_one(
                {"session_id": obj["id"]},
                {"$set": {"status": "expired", "payment_status": "expired"}},
            )
        elif event_type == "charge.refunded":
            await db.payment_transactions.update_one(
                {"stripe_payment_intent_id": obj.get("payment_intent")},
                {"$set": {"status": "refunded", "payment_status": "refunded"}},
            )
        return {"status": "ok"}

    return router