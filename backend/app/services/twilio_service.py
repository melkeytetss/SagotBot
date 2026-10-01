"""Twilio Voice TwiML generator and SMS dispatch service."""

import logging
from typing import Optional
from twilio.twiml.voice_response import VoiceResponse, Gather
from twilio.rest import Client
from twilio.request_validator import RequestValidator
from app.config.settings import settings

logger = logging.getLogger(__name__)


class TwilioService:
    """Manages TwiML generation, signature verification, and SMS alerts."""

    def __init__(self):
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.from_phone = settings.TWILIO_PHONE_NUMBER
        self._client: Optional[Client] = None
        self._validator: Optional[RequestValidator] = None

    @property
    def client(self) -> Optional[Client]:
        """Lazy load Twilio REST client."""
        if not self._client and self.account_sid and self.auth_token and not self.account_sid.startswith("AC_dummy"):
            try:
                self._client = Client(self.account_sid, self.auth_token)
            except Exception as e:
                logger.warning(f"Could not initialize Twilio client: {e}")
        return self._client

    @property
    def validator(self) -> Optional[RequestValidator]:
        """Lazy load Twilio request validator."""
        if not self._validator and self.auth_token:
            self._validator = RequestValidator(self.auth_token)
        return self._validator

    def validate_request(self, url: str, params: dict, signature: str) -> bool:
        """Validate that incoming webhook was dispatched directly by Twilio."""
        if not settings.TWILIO_VALIDATE_SIGNATURE:
            return True
        if not self.validator or not signature:
            return False
        return self.validator.validate(url, params, signature)

    def build_welcome_twiml(self, greeting_text: Optional[str] = None) -> str:
        """Build initial TwiML greeting and gather caller speech."""
        if not greeting_text:
            greeting_text = (
                f"Magandang araw po! Salamat sa pagtawag sa {settings.BUSINESS_NAME}. "
                "Paano po kami makakatulong sa inyo ngayon?"
            )

        response = VoiceResponse()
        gather = Gather(
            input="speech",
            action="/voice/respond",
            method="POST",
            speech_timeout=settings.SPEECH_TIMEOUT,
            language=settings.DEFAULT_LANGUAGE,
            hints="appointment, cleaning, pa-schedule, pasta, bunot, magkano, oras, open po ba, bukas",
        )
        gather.say(
            greeting_text,
            voice=settings.DEFAULT_VOICE,
            language=settings.DEFAULT_LANGUAGE,
        )
        response.append(gather)

        # Fallback if caller stays silent
        response.say(
            "Hindi po namin kayo narinig. Maaari po kayong magsalita pagkatapos ng tono.",
            voice=settings.DEFAULT_VOICE,
            language=settings.DEFAULT_LANGUAGE,
        )
        response.redirect("/voice/incoming", method="POST")

        return str(response)

    def build_response_twiml(
        self,
        reply_text: str,
        intent: str = "general",
        should_end: bool = False,
        transfer_number: Optional[str] = None,
    ) -> str:
        """Generate response TwiML according to intent."""
        response = VoiceResponse()

        # 1. Transfer intent
        if intent == "transfer" and (transfer_number or settings.OWNER_PHONE_NUMBER):
            target = transfer_number or settings.OWNER_PHONE_NUMBER
            response.say(
                reply_text or "I-transfer ko po kayo sa aming staff. Sandali lamang po.",
                voice=settings.DEFAULT_VOICE,
                language=settings.DEFAULT_LANGUAGE,
            )
            response.dial(target)
            return str(response)

        # 2. End Call intent
        if should_end or intent == "end_call":
            response.say(
                reply_text or "Maraming salamat po sa pagtawag. Magandang araw po!",
                voice=settings.DEFAULT_VOICE,
                language=settings.DEFAULT_LANGUAGE,
            )
            response.hangup()
            return str(response)

        # 3. Continuous conversational turn (gather next utterance)
        gather = Gather(
            input="speech",
            action="/voice/respond",
            method="POST",
            speech_timeout=settings.SPEECH_TIMEOUT,
            language=settings.DEFAULT_LANGUAGE,
        )
        gather.say(
            reply_text,
            voice=settings.DEFAULT_VOICE,
            language=settings.DEFAULT_LANGUAGE,
        )
        response.append(gather)

        # Fallback silence prompt
        response.say(
            "Nandito pa po ako. May maitutulong pa po ba ako?",
            voice=settings.DEFAULT_VOICE,
            language=settings.DEFAULT_LANGUAGE,
        )
        response.append(
            Gather(
                input="speech",
                action="/voice/respond",
                method="POST",
                speech_timeout="4",
                language=settings.DEFAULT_LANGUAGE,
            )
        )
        response.say("Salamat po sa pagtawag. Paalam po!", voice=settings.DEFAULT_VOICE, language=settings.DEFAULT_LANGUAGE)
        response.hangup()

        return str(response)

    async def send_sms_alert(self, to_phone: str, message_body: str) -> bool:
        """Send post-call SMS notification to business owner."""
        if not to_phone or not self.client or not self.from_phone:
            logger.info(f"[MOCK SMS] To: {to_phone} | Content: {message_body}")
            return True

        try:
            self.client.messages.create(
                to=to_phone,
                from_=self.from_phone,
                body=message_body,
            )
            logger.info(f"SMS successfully sent to {to_phone}")
            return True
        except Exception as e:
            logger.error(f"Failed to send SMS to {to_phone}: {e}")
            return False


twilio_service = TwilioService()
