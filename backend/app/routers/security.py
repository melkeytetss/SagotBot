"""Security and bot protection endpoints."""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from app.services.recaptcha_service import verify_recaptcha_token

router = APIRouter(prefix="/api/security", tags=["Security"])


class RecaptchaVerifyRequest(BaseModel):
    token: str


@router.post("/verify-recaptcha")
async def verify_recaptcha(payload: RecaptchaVerifyRequest, request: Request):
    """
    Automated reCAPTCHA v3 verification endpoint.
    Returns success status and risk score without interactive puzzles or photo picking.
    """
    client_ip = request.client.host if request.client else None
    result = await verify_recaptcha_token(payload.token, remote_ip=client_ip)

    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=f"Security verification failed: {result.get('reason', 'Low score')}"
        )

    return result
