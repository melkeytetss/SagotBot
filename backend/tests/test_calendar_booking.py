"""Tests for Google Calendar slot parsing and appointment booking integration."""

from datetime import datetime
from starlette.testclient import TestClient
from app.main import app
from app.models.schemas import AppointmentDetails
from app.models.session import session_manager
from app.services.calendar_service import parse_appointment_datetime


def test_parse_appointment_datetime():
    """Verify natural date & time parsing for Filipino terms."""
    # Test bukas (tomorrow) at 2pm
    dt1 = parse_appointment_datetime("bukas", "2:00 PM")
    assert dt1.hour == 14
    assert dt1.minute == 0

    # Test weekday and morning time
    dt2 = parse_appointment_datetime("Biyernes", "10:30 AM")
    assert dt2.hour == 10
    assert dt2.minute == 30

    # Test ISO date
    dt3 = parse_appointment_datetime("2026-10-15", "4pm")
    assert dt3.year == 2026
    assert dt3.month == 10
    assert dt3.day == 15
    assert dt3.hour == 16


def test_live_confirmation_triggers_booking():
    """Verify that confirming an appointment triggers calendar booking."""
    client = TestClient(app)
    call_sid = "CA_test_calendar_live"
    client.post("/voice/incoming", data={"CallSid": call_sid, "From": "+639171234567", "To": "+1234567890"})

    session = session_manager.get(call_sid)
    session.booking_state = AppointmentDetails(
        service="Dental Cleaning",
        preferred_date="bukas",
        preferred_time="2:00 PM",
        caller_name="Maria Santos",
        is_confirmed=True,
    )

    # Trigger respond with confirmation
    payload = {
        "CallSid": call_sid,
        "From": "+639171234567",
        "To": "+1234567890",
        "SpeechResult": "Opo, tama po lahat ng details.",
    }
    resp = client.post("/voice/respond", data=payload)
    assert resp.status_code == 200
    assert session.booking_state.calendar_event_id is not None
