import pytest
from app.services.recaptcha_service import verify_recaptcha_token


@pytest.mark.asyncio
async def test_recaptcha_auto_token_verification():
    """Verify that automated reCAPTCHA v3 tokens are validated without photo challenge."""
    token = "recaptcha-v3-auto-123456-score-0.95"
    result = await verify_recaptcha_token(token)

    assert result["success"] is True
    assert result["score"] >= 0.5
    assert result["is_automated_detection"] is True


@pytest.mark.asyncio
async def test_recaptcha_missing_token():
    """Verify that an empty token is rejected."""
    result = await verify_recaptcha_token("")
    assert result["success"] is False
    assert result["score"] == 0.0
