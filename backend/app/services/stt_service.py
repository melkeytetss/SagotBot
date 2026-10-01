"""Speech-to-Text service utilizing OpenAI Whisper for accurate multilingual audio transcription."""

import io
import logging
from typing import Optional
import httpx
from openai import AsyncOpenAI
from app.config.settings import settings

logger = logging.getLogger(__name__)


class STTService:
    """Whisper API transcription wrapper for complex audio recordings."""

    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self._client: Optional[AsyncOpenAI] = None

    @property
    def client(self) -> Optional[AsyncOpenAI]:
        """Lazy load OpenAI client."""
        if not self._client and self.api_key and not self.api_key.startswith("sk-dummy"):
            try:
                self._client = AsyncOpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI client: {e}")
        return self._client

    async def transcribe_url(self, audio_url: str) -> Optional[str]:
        """Download remote audio recording (e.g. from Twilio) and transcribe with Whisper."""
        if not self.client:
            logger.info("OpenAI Whisper client not configured, skipping audio URL transcription.")
            return None

        try:
            # Twilio audio recordings usually require basic auth or public access
            auth = (settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN) if settings.TWILIO_ACCOUNT_SID else None
            async with httpx.AsyncClient(timeout=10.0) as http_client:
                resp = await http_client.get(audio_url, auth=auth)
                resp.raise_for_status()
                audio_bytes = resp.content

            audio_file = io.BytesIO(audio_bytes)
            audio_file.name = "recording.wav"

            # Auto-detect language (supports Tagalog, Bisaya, English, Taglish)
            transcript_obj = await self.client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                prompt="Customer speaking in Tagalog, Bisaya, English, or Taglish with polite markers po and opo.",
            )
            return transcript_obj.text.strip()

        except Exception as e:
            logger.error(f"Whisper transcription failed for {audio_url}: {e}")
            return None


stt_service = STTService()
