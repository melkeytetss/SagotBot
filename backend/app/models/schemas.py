"""Pydantic schemas for voice requests, LLM responses, and appointment booking."""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class CallIntent(str, Enum):
    """Classified intent of the caller's turn."""
    FAQ = "faq"
    BOOK_APPOINTMENT = "book_appointment"
    TRANSFER = "transfer"
    END_CALL = "end_call"
    GENERAL = "general"


class AppointmentDetails(BaseModel):
    """Structured slots collected for appointment booking."""
    service: Optional[str] = Field(default=None, description="Requested service (e.g., Dental Cleaning, Haircut)")
    preferred_date: Optional[str] = Field(default=None, description="Target date in YYYY-MM-DD format or relative phrase")
    preferred_time: Optional[str] = Field(default=None, description="Target time in HH:MM format (e.g., 14:00)")
    caller_name: Optional[str] = Field(default=None, description="Full name of the client/patient")
    is_confirmed: bool = Field(default=False, description="True only if caller verbally confirmed slot details")
    calendar_event_id: Optional[str] = Field(default=None, description="ID of created Google Calendar event")


class LLMVoiceResponse(BaseModel):
    """Structured response expected from the Groq LLM receptionist."""
    reply: str = Field(description="The spoken text to be vocalized back to the caller")
    intent: CallIntent = Field(default=CallIntent.FAQ, description="Detected customer intent")
    language: str = Field(default="taglish", description="Language detected: taglish, bisaya, english, or tagalog")
    appointment: Optional[AppointmentDetails] = Field(default=None, description="Appointment slots if booking")


class TwilioVoiceWebhook(BaseModel):
    """Twilio incoming webhook payload parameters."""
    CallSid: str
    From: str
    To: str
    SpeechResult: Optional[str] = None
    Confidence: Optional[float] = None
    RecordingUrl: Optional[str] = None
    RecordingDuration: Optional[str] = None
    CallStatus: Optional[str] = None
    CallDuration: Optional[int] = None


class CallSummaryNotification(BaseModel):
    """Payload for post-call SMS and Google Sheets summary."""
    call_sid: str
    caller_phone: str
    business_name: str
    intent: str
    appointment_booked: bool
    summary: str
    duration_seconds: int = 0
