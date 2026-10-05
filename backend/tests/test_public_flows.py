"""Public API regression tests for payments, offers, content, and safety checks."""

import os

import pytest
import requests


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")


@pytest.fixture(scope="session")
def base_url():
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL is not set")
    return BASE_URL.rstrip("/")


@pytest.fixture(scope="session")
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


# payments module
def test_health_ok(api_client, base_url):
    response = api_client.get(f"{base_url}/api/health", timeout=20)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "honeypot-studio"


# payments module
def test_packages_exact_prices_aud(api_client, base_url):
    response = api_client.get(f"{base_url}/api/payments/packages", timeout=20)
    assert response.status_code == 200
    data = response.json()
    packages = {item["lookup_key"]: item for item in data["packages"]}

    assert packages["website_landing_aud"]["price"] == 548.0
    assert packages["website_tradie_aud"]["price"] == 1048.0
    assert packages["website_custom_aud"]["price"] == 2548.0


# payments module
def test_checkout_rejects_unknown_package(api_client, base_url):
    payload = {
        "lookup_key": "unknown_package",
        "origin_url": "https://website-craft-labs.preview.emergentagent.com",
    }
    response = api_client.post(f"{base_url}/api/payments/checkout", json=payload, timeout=30)
    assert response.status_code == 422
    data = response.json()
    assert "Unknown website package" in data["detail"]


# payments module
def test_checkout_rejects_invalid_origin(api_client, base_url):
    payload = {
        "lookup_key": "website_landing_aud",
        "origin_url": "https://evil.example.com",
    }
    response = api_client.post(f"{base_url}/api/payments/checkout", json=payload, timeout=30)
    assert response.status_code == 400
    data = response.json()
    assert "Invalid checkout origin" in data["detail"]


# payments module
def test_forged_webhook_signature_rejected(api_client, base_url):
    response = api_client.post(
        f"{base_url}/api/stripe/webhook",
        data="{}",
        headers={"stripe-signature": "t=123,v1=forged", "Content-Type": "application/json"},
        timeout=20,
    )
    assert response.status_code == 400
    data = response.json()
    assert "Invalid webhook signature" in data["detail"]


# learn/content module
def test_learn_hub_has_five_required_articles(api_client, base_url):
    response = api_client.get(f"{base_url}/api/learn", timeout=20)
    assert response.status_code == 200
    data = response.json()
    slugs = {post["slug"] for post in data["posts"]}
    required = {
        "seo-geo-aeo",
        "vercel-cloudflare",
        "resend-email",
        "forms-and-owasp",
        "analytics-consent",
    }
    assert required.issubset(slugs)


# offers module
def test_unsubscribe_missing_token_is_safe(api_client, base_url):
    response = api_client.post(f"{base_url}/api/offers/unsubscribe/x", timeout=20)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


# offers module
def test_unsubscribe_random_token_is_non_enumerating(api_client, base_url):
    response = api_client.post(
        f"{base_url}/api/offers/unsubscribe/abcdefghijklmnopqrstuvwxyz123456",
        timeout=20,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


# contact module
def test_contact_honeypot_drops_safely(api_client, base_url):
    payload = {
        "name": "Test User",
        "email": "qa+honeypot@example.com",
        "service": "landing-page",
        "message": "This is a safe honeypot regression message for QA run.",
        "company": "bot-filled-field",
    }
    response = api_client.post(f"{base_url}/api/contact", json=payload, timeout=20)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


# contact module (single careful live submit)
def test_contact_submit_best_effort(api_client, base_url):
    payload = {
        "name": "QA Contact",
        "email": "qa.honeypot.studio+one@gmail.com",
        "service": "not-sure",
        "message": "Testing contact submit flow after payment/onboarding integration updates.",
        "company": "",
    }
    response = api_client.post(f"{base_url}/api/contact", json=payload, timeout=30)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert isinstance(data.get("id"), str)
    assert "email_sent" in data
