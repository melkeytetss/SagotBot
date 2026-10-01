"""Application Configuration via Pydantic Settings."""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """SagotBot global settings loaded from environment variables."""

    # Environment
    ENVIRONMENT: str = Field(default="development", description="Current runtime environment")
    HOST: str = Field(default="0.0.0.0", description="API host")
    PORT: int = Field(default=8000, description="API port")
    DEBUG: bool = Field(default=False, description="Debug mode")

    # Twilio Voice & SMS
    TWILIO_ACCOUNT_SID: str = Field(default="", description="Twilio Account SID")
    TWILIO_AUTH_TOKEN: str = Field(default="", description="Twilio Auth Token")
    TWILIO_PHONE_NUMBER: str = Field(default="", description="Primary Twilio inbound/outbound phone number")
    TWILIO_VALIDATE_SIGNATURE: bool = Field(default=False, description="Validate X-Twilio-Signature header")

    # AI Model Providers
    GROQ_API_KEY: str = Field(default="", description="Groq Cloud API Key")
    GROQ_MODEL: str = Field(default="openai/gpt-oss-120b", description="Groq LLM model name")
    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API Key for Whisper fallback")

    # Business Defaults (Philippine SME Persona)
    BUSINESS_NAME: str = Field(default="Smiles Dental Clinic", description="Name of the business")
    BUSINESS_TYPE: str = Field(default="dental", description="Type: dental, salon, restaurant, or general")
    BUSINESS_LOCATION: str = Field(default="BGC, Taguig City, Philippines", description="Physical location")
    BUSINESS_HOURS: str = Field(default="Mon-Sat: 9:00 AM - 6:00 PM, Sun: Closed", description="Operating hours")
    BUSINESS_PHONE: str = Field(default="+639171234567", description="Business mobile / landline")
    OWNER_PHONE_NUMBER: str = Field(default="", description="Owner mobile number for post-call SMS notifications")

    # Google Cloud Integrations
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = Field(default=None, description="Path to Google Service Account JSON")
    GOOGLE_CALENDAR_ID: str = Field(default="primary", description="Google Calendar ID for appointment booking")
    GOOGLE_SHEET_ID: Optional[str] = Field(default=None, description="Google Sheet ID for call log persistence")

    # Supabase (Optional multi-tenant cloud DB)
    SUPABASE_URL: Optional[str] = Field(default=None, description="Supabase project URL")
    SUPABASE_KEY: Optional[str] = Field(default=None, description="Supabase public anon key")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = Field(default=None, description="Supabase service role secret key")

    # Telephony Voice Settings
    DEFAULT_VOICE: str = Field(default="Google.fil-PH-Wavenet-A", description="Twilio TTS voice model")
    DEFAULT_LANGUAGE: str = Field(default="fil-PH", description="Twilio TTS language code")
    SPEECH_TIMEOUT: str = Field(default="auto", description="Silence timeout for caller speech gathering")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
