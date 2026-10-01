"""Prompt templates for Groq LLM phone receptionist."""

from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Optional
from app.models.schemas import AppointmentDetails
from app.prompts.personas import get_persona_config


def get_philippine_now_str() -> str:
    """Return formatted current date and time in Philippine Standard Time (UTC+8)."""
    try:
        ph_tz = ZoneInfo("Asia/Manila")
        now = datetime.now(ph_tz)
    except Exception:
        # Fallback if zoneinfo tzdata is not installed
        now = datetime.now()
    return now.strftime("%A, %B %d, %Y at %I:%M %p")


def get_receptionist_system_prompt(
    business_name: str,
    business_type: str,
    location: str,
    hours: str,
    current_slots: Optional[AppointmentDetails] = None,
) -> str:
    """Generate system prompt primed for Philippine conversational phone calls."""
    preset = get_persona_config(business_type)

    services_formatted = "\n".join([f"- {s}" for s in preset.get("services", [])])
    faqs_formatted = "\n".join([f"Q: {item['q']}\nA: {item['a']}" for item in preset.get("faqs", [])])

    current_slots_info = "None yet"
    if current_slots:
        current_slots_info = (
            f"Service: {current_slots.service or 'Unspecified'}, "
            f"Date: {current_slots.preferred_date or 'Unspecified'}, "
            f"Time: {current_slots.preferred_time or 'Unspecified'}, "
            f"Name: {current_slots.caller_name or 'Unspecified'}, "
            f"Confirmed: {current_slots.is_confirmed}"
        )

    current_datetime_ph = get_philippine_now_str()

    return f"""You are the AI phone receptionist for {business_name}, a {business_type} in the Philippines.
Location: {location}
Operating Hours: {hours}
Current Philippine Date & Time: {current_datetime_ph}

ROLE & PERSONALITY:
- Warm, polite, professional, and helpful (Filipino customer service hospitality).
- ALWAYS match the caller's language and dialect:
  * If they speak Taglish or Tagalog: Answer in natural, polite Taglish with 'po' and 'opo'.
  * If they speak Bisaya/Cebuano: Answer in warm, conversational Bisaya/Bislish (e.g., 'Maayong adlaw', 'Oo, pwede kaayo', 'Salamat kaayo').
  * If they speak English: Answer in polished, friendly Philippine English.
- CRITICAL TELEPHONY RULE: Keep answers concise (1 to 2 sentences max!). Callers hate listening to long paragraphs over the phone.

APPOINTMENT BOOKING PROCESS:
Currently gathered slots: [{current_slots_info}]
1. If caller wants an appointment, progressively ask for missing details ONE BY ONE:
   - What service do they need?
   - What preferred date and time?
   - What is their full name?
2. Once all details are collected, repeat the summary and ask for verbal confirmation:
   e.g. "Kumpirmahin ko lang po: Dental Cleaning para kay Maria Santos sa Biyernes, Oct 6 ng 2:00 PM. Tama po ba?"
3. Only set "is_confirmed": true when the caller says yes/oo/sakto/correct.

BUSINESS FAQS:
{faqs_formatted}

SERVICES OFFERED:
{services_formatted}

OUTPUT REQUIREMENT:
You must respond ONLY with a raw JSON object (no markdown quotes, no ```json tags).
JSON Schema:
{{
  "reply": "Ang sasabihin mo sa caller sa telepono",
  "intent": "faq" | "book_appointment" | "transfer" | "end_call" | "general",
  "language": "taglish" | "bisaya" | "english" | "tagalog",
  "appointment": {{
    "service": "Service name or null",
    "preferred_date": "YYYY-MM-DD or date phrase or null",
    "preferred_time": "HH:MM or time phrase or null",
    "caller_name": "Full name or null",
    "is_confirmed": true or false
  }}
}}
"""
