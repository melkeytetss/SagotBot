"""Unit and integration tests for SagotBot voice endpoints and conversational loop."""

import pytest
from starlette.testclient import TestClient
from app.main import app
from app.models.session import session_manager


@pytest.fixture(autouse=True)
def clean_session_manager():
    """Ensure clean session state for each test."""
    session_manager._sessions.clear()
    yield
    session_manager._sessions.clear()


@pytest.fixture
def client():
    """Test client fixture."""
    return TestClient(app)


def test_health_check(client):
    """Test that health check endpoint returns 200 and valid JSON."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "Smiles Dental Clinic" in data["business_name"]


def test_incoming_call_webhook(client):
    """Test /voice/incoming returns valid TwiML with Google Filipino voice."""
    payload = {
        "CallSid": "CA_test_call_123",
        "From": "+639171112233",
        "To": "+1234567890",
    }
    response = client.post("/voice/incoming", data=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/xml"
    xml_content = response.text

    # Assert TwiML elements
    assert "<Response>" in xml_content
    assert "<Gather" in xml_content
    assert 'voice="Google.fil-PH-Wavenet-A"' in xml_content
    assert 'language="fil-PH"' in xml_content
    assert "Smiles Dental Clinic" in xml_content


def test_respond_to_speech_faq(client):
    """Test /voice/respond answers an FAQ query and prompts for next turn."""
    call_sid = "CA_test_faq_456"
    # First, initialize call
    client.post("/voice/incoming", data={"CallSid": call_sid, "From": "+639171112233", "To": "+1234567890"})

    # Caller asks an FAQ question
    payload = {
        "CallSid": call_sid,
        "From": "+639171112233",
        "To": "+1234567890",
        "SpeechResult": "Bukas po ba kayo ngayon?",
        "Confidence": "0.95",
    }
    response = client.post("/voice/respond", data=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/xml"
    xml_content = response.text

    assert "<Response>" in xml_content
    assert "<Gather" in xml_content
    assert 'voice="Google.fil-PH-Wavenet-A"' in xml_content

    # Check session state updated
    session = session_manager.get(call_sid)
    assert session is not None
    assert len(session.history) == 2  # 1 caller turn, 1 bot turn
    assert session.history[0].speaker == "caller"
    assert session.history[0].content == "Bukas po ba kayo ngayon?"
    assert session.history[1].speaker == "bot"


def test_respond_to_speech_end_call(client):
    """Test /voice/respond hangs up when caller concludes conversation."""
    call_sid = "CA_test_end_789"
    client.post("/voice/incoming", data={"CallSid": call_sid, "From": "+639171112233", "To": "+1234567890"})

    payload = {
        "CallSid": call_sid,
        "From": "+639171112233",
        "To": "+1234567890",
        "SpeechResult": "Sige po salamat, bye!",
    }
    response = client.post("/voice/respond", data=payload)
    assert response.status_code == 200
    xml_content = response.text

    assert "<Hangup" in xml_content


def test_call_status_callback_cleans_session(client):
    """Test /voice/status cleans up the session and runs post-call processing."""
    call_sid = "CA_test_status_999"
    client.post("/voice/incoming", data={"CallSid": call_sid, "From": "+639171112233", "To": "+1234567890"})
    assert session_manager.get(call_sid) is not None

    payload = {
        "CallSid": call_sid,
        "From": "+639171112233",
        "CallStatus": "completed",
        "CallDuration": "45",
    }
    response = client.post("/voice/status", data=payload)
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

    # Session should now be cleared
    assert session_manager.get(call_sid) is None
