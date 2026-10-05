"""Opt-in returning-enquirer offer delivery and unsubscribe routes."""
import os
import secrets
from datetime import datetime, timedelta, timezone
from html import escape
from pathlib import Path
from typing import Callable

from fastapi import APIRouter, HTTPException, Request
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr, Field

load_dotenv(Path(__file__).parent / ".env")
OFFER_TOKEN_SECRET = os.environ["OFFER_TOKEN_SECRET"]
CANONICAL_URL = "https://myscapez.com"
PUBLIC_EMAIL = "honeypotweb@proton.me"
PUBLIC_PHONE = "0480 733 936"


class OfferClaimIn(BaseModel):
    email: EmailStr
    company: str = Field(default="", max_length=200)


def create_offer_router(db, send_email: Callable, rate_limited: Callable, client_ip: Callable) -> APIRouter:
    router = APIRouter(prefix="/api/offers")

    @router.post("/claim")
    async def claim_offer(payload: OfferClaimIn, request: Request):
        if payload.company:
            return {"status": "accepted"}
        if (
            await rate_limited(
                f"offer:{client_ip(request)}", limit=4, window_seconds=3600
            )
            or await rate_limited("offer:global", limit=30, window_seconds=3600)
        ):
            raise HTTPException(status_code=429, detail="Please wait before requesting another offer email.")
        enquiry = await db.enquiries.find_one(
            {"email": str(payload.email)},
            {
                "_id": 0,
                "email": 1,
                "name": 1,
                "marketing_opt_out": 1,
                "offer_unsubscribe_token": 1,
                "offer_last_sent_at": 1,
            },
        )
        if not enquiry or enquiry.get("marketing_opt_out"):
            return {"status": "accepted"}
        last_sent = enquiry.get("offer_last_sent_at")
        if last_sent:
            sent_at = datetime.fromisoformat(last_sent)
            if datetime.now(timezone.utc) - sent_at < timedelta(days=30):
                return {"status": "accepted"}
        token = enquiry.get("offer_unsubscribe_token") or secrets.token_urlsafe(32)
        await db.enquiries.update_one(
            {"email": enquiry["email"]},
            {"$set": {"offer_unsubscribe_token": token}},
        )
        offer_url = f"{CANONICAL_URL}/?offer=20#buy-website"
        unsubscribe_url = f"{CANONICAL_URL}/unsubscribe?token={token}"
        first_name = escape((enquiry.get("name") or "there").split()[0])
        html = (
            '<table role="presentation" width="100%" style="background:#050505"><tr><td align="center" style="padding:36px 16px">'
            '<table role="presentation" width="100%" style="max-width:620px;background:#0a0a0a;border:1px solid #24343a">'
            '<tr><td style="padding:34px;font-family:Arial,sans-serif;color:#f4f4f5">'
            '<svg width="54" height="48" viewBox="0 0 54 48" role="img" aria-label="HoneyPot Studio mark">'
            '<path d="M14 2h26l13 22-13 22H14L1 24z" fill="none" stroke="#00ffff" stroke-width="2"/>'
            '<path d="M21 13h12l6 11-6 11H21l-6-11z" fill="none" stroke="#ff00ff" stroke-width="2"/>'
            '</svg>'
            '<p style="margin:26px 0 8px;color:#67e8f9;font-size:12px;font-weight:bold;letter-spacing:1.5px">A PRIVATE WEBSITE OFFER</p>'
            '<h1 style="margin:0;font-size:32px;line-height:1.15">20% off your HoneyPot Studio website build</h1>'
            f'<p style="margin:20px 0 0;color:#d4d4d8;line-height:1.65">Hi {first_name}, we would love to help move your website forward. '
            'You handle the business. We handle the online presence—without telling you how to run your company.</p>'
            '<p style="margin:16px 0;color:#d4d4d8;line-height:1.65">Your 20% offer is subject to a quick scope confirmation and cannot be combined with another promotion.</p>'
            f'<p style="margin:28px 0"><a href="{offer_url}" style="display:inline-block;background:#67e8f9;color:#050505;padding:14px 22px;text-decoration:none;font-weight:bold">Return to your website options</a></p>'
            f'<p style="margin:0;color:#a1a1aa;font-size:14px">Prefer a conversation first? '
            f'<a href="tel:+61480733936" style="color:#f0abfc">Call {PUBLIC_PHONE}</a>, '
            f'<a href="{CANONICAL_URL}/#contact" style="color:#f0abfc">use the contact form</a>, '
            f'or reply to <a href="mailto:{PUBLIC_EMAIL}" style="color:#f0abfc">{PUBLIC_EMAIL}</a>.</p>'
            '<p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #27272a;color:#71717a;font-size:12px;line-height:1.6">'
            'You received this one-time offer because this address previously submitted an enquiry and requested the returning-customer offer. No tracking pixels are included in this email.</p>'
            f'<p style="margin:12px 0 0"><a href="{unsubscribe_url}" style="color:#a1a1aa;font-size:12px">Unsubscribe from future offers</a> · '
            f'<a href="{CANONICAL_URL}/privacy-security" style="color:#a1a1aa;font-size:12px">Privacy</a></p>'
            '</td></tr></table></td></tr></table>'
        )
        try:
            message_id = await send_email(
                to=enquiry["email"],
                subject="HoneyPot Studio is offering you 20% off",
                html=html,
                reply_to=PUBLIC_EMAIL,
            )
            await db.enquiries.update_one(
                {"email": enquiry["email"]},
                {"$set": {
                    "offer_last_sent_at": datetime.now(timezone.utc).isoformat(),
                    "offer_email_id": message_id,
                }},
            )
        except HTTPException:
            await db.enquiries.update_one(
                {"email": enquiry["email"]},
                {"$set": {"offer_email_status": "failed"}},
            )
        return {"status": "accepted"}

    @router.post("/unsubscribe/{token}")
    async def unsubscribe(token: str):
        if len(token) < 32 or len(token) > 100:
            return {"status": "ok"}
        await db.enquiries.update_one(
            {"offer_unsubscribe_token": token},
            {"$set": {
                "marketing_opt_out": True,
                "marketing_opt_out_at": datetime.now(timezone.utc).isoformat(),
            }},
        )
        return {"status": "ok"}

    return router