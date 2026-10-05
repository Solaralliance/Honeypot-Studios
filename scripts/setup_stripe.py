#!/usr/bin/env python3
"""Idempotently create HoneyPot Studio's Stripe website package catalogue."""
import os
from pathlib import Path

import stripe
from dotenv import load_dotenv

load_dotenv(Path("/app/backend/.env"))
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

CATALOG = [
    {
        "emergent_product_id": "honeypot_landing_page",
        "name": "Landing Page Build",
        "description": "Conversion-focused custom landing page build by HoneyPot Studio.",
        "lookup_key": "website_landing_aud",
        "amount": 54800,
    },
    {
        "emergent_product_id": "honeypot_tradie_website",
        "name": "Tradie Website Build",
        "description": "Multi-page website build for an Australian trade business.",
        "lookup_key": "website_tradie_aud",
        "amount": 104800,
    },
    {
        "emergent_product_id": "honeypot_custom_website",
        "name": "Custom Website Build",
        "description": "Bespoke website build planned around the customer's business goals.",
        "lookup_key": "website_custom_aud",
        "amount": 254800,
    },
]


def get_or_create_product(entry):
    for product in stripe.Product.list(active=True).auto_paging_iter():
        metadata = product.metadata or {}
        if metadata.get("emergent_product_id") == entry["emergent_product_id"]:
            return product
    return stripe.Product.create(
        name=entry["name"],
        description=entry["description"],
        tax_code="txcd_10701200",
        metadata={
            "managed_by": "emergent",
            "emergent_product_id": entry["emergent_product_id"],
        },
    )


def ensure_price(product, entry):
    existing = stripe.Price.list(
        lookup_keys=[entry["lookup_key"]], active=True, limit=1
    ).data
    if existing and (
        existing[0].unit_amount != entry["amount"]
        or existing[0].currency != "aud"
    ):
        stripe.Price.modify(existing[0].id, active=False)
        existing = []
    if existing:
        return existing[0]
    return stripe.Price.create(
        product=product.id,
        unit_amount=entry["amount"],
        currency="aud",
        lookup_key=entry["lookup_key"],
        transfer_lookup_key=True,
    )


def main():
    for entry in CATALOG:
        product = get_or_create_product(entry)
        price = ensure_price(product, entry)
        print(f"{entry['lookup_key']}: {price.id}")


if __name__ == "__main__":
    main()