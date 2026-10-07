"""Regression tests for requiring settled Stripe payments before fulfilment."""

import importlib
import os
import sys
from unittest.mock import patch

import pytest


with patch.dict(os.environ, {
    "STRIPE_SECRET_KEY": "test",
    "STRIPE_WEBHOOK_SECRET": "test",
    "ONBOARDING_TOKEN_SECRET": "test",
}):
    sys.modules.pop("payments", None)
    _is_payment_paid = importlib.import_module("payments")._is_payment_paid


def test_paid_payment_is_eligible_for_fulfilment():
    assert _is_payment_paid({"payment_status": "paid"})


@pytest.mark.parametrize("payment_status", ["unpaid", "no_payment_required", None, ""])
def test_unpaid_or_unknown_payment_is_not_eligible_for_fulfilment(payment_status):
    assert not _is_payment_paid({"payment_status": payment_status})


def test_missing_payment_status_is_not_eligible_for_fulfilment():
    assert not _is_payment_paid({})
