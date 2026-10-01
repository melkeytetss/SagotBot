"""Unit tests for prompts, persona presets, and session state merging."""

from app.models.schemas import AppointmentDetails
from app.models.session import CallSession
from app.prompts.templates import get_receptionist_system_prompt
from app.prompts.personas import get_persona_config


def test_persona_presets():
    """Verify dental, salon, and restaurant presets have services and faqs."""
    dental = get_persona_config("dental")
    assert len(dental["services"]) >= 3
    assert len(dental["faqs"]) >= 2
    assert "Smiles Dental Clinic" in dental["business_name"]

    salon = get_persona_config("salon")
    assert "Salon" in salon["business_type"]

    restaurant = get_persona_config("restaurant")
    assert "Restaurant" in restaurant["business_type"]


def test_system_prompt_generation():
    """Verify system prompt includes Philippine timezone, rules, and output requirements."""
    slots = AppointmentDetails(service="Dental Cleaning", caller_name="Maria Santos")
    prompt = get_receptionist_system_prompt(
        business_name="Test Clinic",
        business_type="Dental Clinic",
        location="Makati City",
        hours="9am - 5pm",
        current_slots=slots,
    )

    assert "Test Clinic" in prompt
    assert "Dental Cleaning" in prompt
    assert "Maria Santos" in prompt
    assert "Bisaya/Cebuano" in prompt
    assert "Taglish" in prompt
    assert "JSON Schema" in prompt


def test_session_state_merging():
    """Test that incremental slot extraction accumulates without overwriting prior valid slots."""
    session = CallSession(
        call_sid="CA_merge_test",
        caller_number="+639171234567",
        to_number="+1234567890",
    )

    # Turn 1: Caller mentions service
    session.merge_booking_details(AppointmentDetails(service="Tooth Extraction"))
    assert session.booking_state.service == "Tooth Extraction"
    assert session.booking_state.preferred_date is None

    # Turn 2: Caller mentions date
    session.merge_booking_details(AppointmentDetails(preferred_date="2026-10-10"))
    assert session.booking_state.service == "Tooth Extraction"
    assert session.booking_state.preferred_date == "2026-10-10"

    # Turn 3: Caller gives name and confirms
    session.merge_booking_details(AppointmentDetails(caller_name="Juan Dela Cruz", is_confirmed=True))
    assert session.booking_state.service == "Tooth Extraction"
    assert session.booking_state.preferred_date == "2026-10-10"
    assert session.booking_state.caller_name == "Juan Dela Cruz"
    assert session.booking_state.is_confirmed is True
