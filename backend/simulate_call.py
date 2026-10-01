"""Interactive CLI Call Simulator for SagotBot.

Test conversational turns, slot filling, and multilingual responses
directly in your terminal without needing a Twilio number or phone call.
"""

import sys
import xml.etree.ElementTree as ET
import httpx


SERVER_URL = "http://localhost:8000"
CALL_SID = "CA_simulated_terminal_call"
CALLER_NUMBER = "+639171234567"


def extract_bot_speech(twiml_xml: str) -> str:
    """Extract spoken text inside <Say> tags from TwiML XML."""
    try:
        root = ET.fromstring(twiml_xml)
        say_elements = root.findall(".//Say")
        if say_elements and say_elements[0].text:
            return say_elements[0].text.strip()
    except Exception:
        pass
    return twiml_xml


def main():
    print("=" * 60)
    print("🇵🇭  SAGOTBOT LOCAL CALL SIMULATOR")
    print("Simulating an incoming phone call to Smiles Dental Clinic.")
    print("Type what you would say into the phone. Type 'exit' to quit.")
    print("=" * 60)

    # 1. Incoming Call Step
    print("\n📞 [CALL CONNECTED] Ringing...")
    try:
        resp = httpx.post(
            f"{SERVER_URL}/voice/incoming",
            data={"CallSid": CALL_SID, "From": CALLER_NUMBER, "To": "+1234567890"},
        )
        resp.raise_for_status()
        greeting = extract_bot_speech(resp.text)
        print(f"\n🤖 AI Receptionist: \"{greeting}\"\n")
    except Exception as e:
        print(f"\n❌ Error connecting to backend server at {SERVER_URL}: {e}")
        print("Make sure `uvicorn app.main:app` is running!")
        sys.exit(1)

    # 2. Conversational Turns
    turn = 1
    while True:
        try:
            user_input = input(f"👤 Caller (Turn {turn}): ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nCall terminated.")
            break

        if not user_input:
            continue
        if user_input.lower() in ["exit", "quit"]:
            print("\nEnding simulated call...")
            break

        try:
            resp = httpx.post(
                f"{SERVER_URL}/voice/respond",
                data={
                    "CallSid": CALL_SID,
                    "From": CALLER_NUMBER,
                    "To": "+1234567890",
                    "SpeechResult": user_input,
                },
            )
            resp.raise_for_status()
            reply_text = extract_bot_speech(resp.text)
            print(f"\n🤖 AI Receptionist: \"{reply_text}\"\n")

            # Check if bot explicitly ended the call (no <Gather> prompt returned)
            if "<Gather" not in resp.text:
                print("📴 [CALL ENDED BY RECEPTIONIST]")
                break

            turn += 1

        except Exception as e:
            print(f"❌ Error communicating with server: {e}")

    # 3. Call Status Callback
    try:
        httpx.post(
            f"{SERVER_URL}/voice/status",
            data={
                "CallSid": CALL_SID,
                "From": CALLER_NUMBER,
                "CallStatus": "completed",
                "CallDuration": str(turn * 15),
            },
        )
        print("✅ Session ended & post-call background jobs processed.")
    except Exception:
        pass


if __name__ == "__main__":
    main()
