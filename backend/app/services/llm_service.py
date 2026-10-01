"""Groq LLM Service for fast multilingual Filipino conversational response generation."""

import json
import logging
import re
from typing import Any, Dict, List, Optional
from groq import AsyncGroq
from app.config.settings import settings
from app.models.schemas import AppointmentDetails, CallIntent, LLMVoiceResponse
from app.prompts.templates import get_receptionist_system_prompt

logger = logging.getLogger(__name__)


class LLMService:
    """Orchestrates Groq LLM API requests and JSON structured parsing."""

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self._client: Optional[AsyncGroq] = None

    @property
    def client(self) -> Optional[AsyncGroq]:
        """Lazy initialization of AsyncGroq client."""
        key = settings.GROQ_API_KEY
        if not key or key.startswith("gsk_dummy"):
            return None
        if not self._client or getattr(self, "_active_key", None) != key:
            try:
                self._client = AsyncGroq(api_key=key)
                self._active_key = key
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")
        return self._client

    def _clean_json_output(self, raw_text: str) -> str:
        """Strip markdown fences or trailing thoughts from LLM JSON output."""
        cleaned = raw_text.strip()
        # Remove ```json ... ``` codeblocks if present
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
        if match:
            cleaned = match.group(1).strip()
        return cleaned

    def _fallback_response(self, user_text: str) -> LLMVoiceResponse:
        """Rule-based fallback response if Groq is unreachable or key is not configured."""
        lower = user_text.lower()
        if any(w in lower for w in ["bye", "salamat", "thank you", "wala na", "tapos na"]):
            return LLMVoiceResponse(
                reply="Walang anuman po! Salamat sa pagtawag sa Smiles Dental Clinic. Magandang araw po!",
                intent=CallIntent.END_CALL,
                language="taglish",
            )
        elif any(w in lower for w in ["book", "appointment", "schedule", "pa-reserve", "cleaning", "bunot"]):
            return LLMVoiceResponse(
                reply="Sige po, tutulungan ko po kayo magpa-schedule. Anong service po ang kailangan ninyo at anong date at oras po ang plano niyo?",
                intent=CallIntent.BOOK_APPOINTMENT,
                language="taglish",
                appointment=AppointmentDetails(service="Consultation"),
            )
        elif any(w in lower for w in ["tao", "staff", "doktor", "operator", "kausap"]):
            return LLMVoiceResponse(
                reply="Sige po, i-transfer ko po kayo sa aming clinic staff. Sandali lamang po.",
                intent=CallIntent.TRANSFER,
                language="taglish",
            )
        else:
            return LLMVoiceResponse(
                reply=f"Opo, bukas po ang aming clinic {settings.BUSINESS_HOURS}. May iba pa po ba kayong katanungan?",
                intent=CallIntent.FAQ,
                language="taglish",
            )

    async def generate_response(
        self,
        caller_text: str,
        history: List[Dict[str, str]],
        current_slots: Optional[AppointmentDetails] = None,
        business_name: Optional[str] = None,
        business_type: Optional[str] = None,
    ) -> LLMVoiceResponse:
        """Generate multilingual voice response and structured intent using Groq."""
        if not self.client:
            logger.info("Using mock/rule-based fallback response (Groq API key not set).")
            return self._fallback_response(caller_text)

        b_name = business_name or settings.BUSINESS_NAME
        b_type = business_type or settings.BUSINESS_TYPE

        system_prompt = get_receptionist_system_prompt(
            business_name=b_name,
            business_type=b_type,
            location=settings.BUSINESS_LOCATION,
            hours=settings.BUSINESS_HOURS,
            current_slots=current_slots,
        )

        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(history)
        messages.append({"role": "user", "content": caller_text})

        try:
            response = await self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=1000,
            )

            raw_content = response.choices[0].message.content or "{}"
            cleaned_content = self._clean_json_output(raw_content)
            parsed_data = json.loads(cleaned_content)

            # Validate against Pydantic schema
            return LLMVoiceResponse.model_validate(parsed_data)

        except Exception as e:
            logger.error(f"Error invoking Groq API: {e}", exc_info=True)
            return self._fallback_response(caller_text)


llm_service = LLMService()
