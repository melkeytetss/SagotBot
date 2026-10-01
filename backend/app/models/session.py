"""Conversational session state tracking for active phone calls."""

from datetime import datetime, timezone
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.models.schemas import AppointmentDetails


class MessageTurn(BaseModel):
    """A single turn in the voice conversation."""
    speaker: str = Field(description="'caller' or 'bot'")
    content: str = Field(description="Spoken transcript text")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CallSession(BaseModel):
    """Stateful context for a live phone call session."""
    call_sid: str
    caller_number: str
    to_number: str
    history: List[MessageTurn] = Field(default_factory=list)
    booking_state: AppointmentDetails = Field(default_factory=AppointmentDetails)
    detected_language: str = "taglish"
    turn_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_active: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def add_message(self, speaker: str, content: str) -> None:
        """Append a dialogue turn to session history."""
        self.history.append(MessageTurn(speaker=speaker, content=content))
        self.turn_count += 1
        self.last_active = datetime.now(timezone.utc)

    def merge_booking_details(self, incoming: Optional[AppointmentDetails]) -> None:
        """Merge newly extracted slots into persistent booking state without overwriting valid data."""
        if not incoming:
            return

        if incoming.service:
            self.booking_state.service = incoming.service
        if incoming.preferred_date:
            self.booking_state.preferred_date = incoming.preferred_date
        if incoming.preferred_time:
            self.booking_state.preferred_time = incoming.preferred_time
        if incoming.caller_name:
            self.booking_state.caller_name = incoming.caller_name
        if incoming.is_confirmed:
            self.booking_state.is_confirmed = True
        if incoming.calendar_event_id:
            self.booking_state.calendar_event_id = incoming.calendar_event_id

    def get_chat_history_for_llm(self) -> List[Dict[str, str]]:
        """Format history for LLM message payload."""
        formatted = []
        for turn in self.history:
            role = "user" if turn.speaker == "caller" else "assistant"
            formatted.append({"role": role, "content": turn.content})
        return formatted


class SessionManager:
    """Thread-safe in-memory session registry for active calls."""

    def __init__(self):
        self._sessions: Dict[str, CallSession] = {}

    def get_or_create(self, call_sid: str, caller_number: str, to_number: str) -> CallSession:
        """Retrieve active call session or initialize a new one."""
        if call_sid not in self._sessions:
            self._sessions[call_sid] = CallSession(
                call_sid=call_sid,
                caller_number=caller_number,
                to_number=to_number,
            )
        return self._sessions[call_sid]

    def get(self, call_sid: str) -> Optional[CallSession]:
        """Fetch session by CallSid."""
        return self._sessions.get(call_sid)

    def remove(self, call_sid: str) -> Optional[CallSession]:
        """End and remove call session."""
        return self._sessions.pop(call_sid, None)


# Global singleton instance
session_manager = SessionManager()
