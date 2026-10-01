"""Twilio Voice Webhook endpoints for call handling, speech gathering, and status callbacks."""

import logging
from typing import Optional
from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Request, Response
from app.config.settings import settings
from app.models.session import session_manager
from app.models.schemas import CallIntent
from app.services.twilio_service import twilio_service
from app.services.llm_service import llm_service
from app.services.stt_service import stt_service
from app.services.sheets_service import sheets_service
from app.services.calendar_service import calendar_service, parse_appointment_datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/voice", tags=["Voice Telephony"])


async def handle_post_call_summary(
    call_sid: str,
    caller_number: str,
    duration: int,
    session_turns: list,
    booking_state: Optional[dict] = None,
):
    """Background task to dispatch owner SMS alert and log transcript."""
    logger.info(f"Processing post-call summary for CallSid: {call_sid}")

    # Build concise summary for SMS
    turns_count = len(session_turns)
    is_booked = bool(booking_state and booking_state.get("is_confirmed"))
    booked_info = "Walang appointment na na-book."
    if is_booked:
        booked_info = (
            f"APPOINTMENT CONFIRMED!\n"
            f"Pasyente: {booking_state.get('caller_name', 'N/A')}\n"
            f"Service: {booking_state.get('service', 'N/A')}\n"
            f"Date/Time: {booking_state.get('preferred_date', 'N/A')} {booking_state.get('preferred_time', 'N/A')}"
        )

    sms_body = (
        f"[SagotBot Alert] Bagong Tawag!\n"
        f"Galing kay: {caller_number}\n"
        f"Tagal: {duration}s ({turns_count} turns)\n"
        f"{booked_info}"
    )

    # 1. Log to Google Sheets
    call_summary_text = f"Turns: {turns_count}. {booked_info}"
    await sheets_service.log_call(
        call_sid=call_sid,
        caller_number=caller_number,
        duration_seconds=duration,
        intent="book_appointment" if is_booked else "faq",
        appointment_booked=is_booked,
        summary=call_summary_text,
    )

    # 2. Dispatch SMS alert to owner
    if settings.OWNER_PHONE_NUMBER:
        await twilio_service.send_sms_alert(
            to_phone=settings.OWNER_PHONE_NUMBER,
            message_body=sms_body,
        )


@router.post("/incoming")
async def incoming_call(
    request: Request,
    x_twilio_signature: Optional[str] = Header(None, alias="X-Twilio-Signature"),
):
    """Initial webhook invoked when a caller dials the Twilio phone number."""
    form_data = await request.form()
    params = dict(form_data)
    call_sid = params.get("CallSid", "unknown_call")
    caller_number = params.get("From", "anonymous")
    to_number = params.get("To", settings.TWILIO_PHONE_NUMBER)

    # Validate Twilio signature in production
    url = str(request.url)
    if not twilio_service.validate_request(url, params, x_twilio_signature or ""):
        logger.warning(f"Unauthorized webhook attempt on /voice/incoming from {caller_number}")
        raise HTTPException(status_code=403, detail="Invalid Twilio Signature")

    # Initialize or reset session context
    session = session_manager.get_or_create(call_sid, caller_number, to_number)
    logger.info(f"Incoming call initialized: CallSid={call_sid} | From={caller_number}")

    twiml_xml = twilio_service.build_welcome_twiml()
    return Response(content=twiml_xml, media_type="application/xml")


@router.post("/respond")
async def respond_to_speech(
    request: Request,
    x_twilio_signature: Optional[str] = Header(None, alias="X-Twilio-Signature"),
):
    """Webhook invoked after Twilio gathers caller speech or records audio."""
    form_data = await request.form()
    params = dict(form_data)
    call_sid = params.get("CallSid", "unknown_call")
    caller_number = params.get("From", "anonymous")
    to_number = params.get("To", settings.TWILIO_PHONE_NUMBER)
    speech_result = params.get("SpeechResult")
    recording_url = params.get("RecordingUrl")

    # Validate signature if configured
    url = str(request.url)
    if not twilio_service.validate_request(url, params, x_twilio_signature or ""):
        raise HTTPException(status_code=403, detail="Invalid Twilio Signature")

    session = session_manager.get_or_create(call_sid, caller_number, to_number)

    # Determine caller text from SpeechResult or Whisper fallback
    caller_text = speech_result
    if not caller_text and recording_url:
        logger.info(f"Transcribing audio recording from {recording_url}")
        caller_text = await stt_service.transcribe_url(recording_url)

    # Handle silence or missing speech
    if not caller_text or not caller_text.strip():
        logger.info(f"Empty speech input for CallSid={call_sid}")
        twiml_xml = twilio_service.build_response_twiml(
            reply_text="Paumanhin po, hindi ko po kayo narinig. Maaari po bang ulitin?",
            intent="general",
            should_end=False,
        )
        return Response(content=twiml_xml, media_type="application/xml")

    logger.info(f"Caller [{caller_number}] said: '{caller_text}'")
    session.add_message("caller", caller_text)

    # Generate LLM response using Groq with full conversation history
    history = session.get_chat_history_for_llm()
    # Exclude the latest user message from history parameter as it's passed separately
    past_history = history[:-1] if history else []

    llm_output = await llm_service.generate_response(
        caller_text=caller_text,
        history=past_history,
        current_slots=session.booking_state,
    )

    logger.info(f"AI response: intent='{llm_output.intent}', reply='{llm_output.reply}'")

    # Save bot turn and update slot filling state
    session.add_message("bot", llm_output.reply)
    if llm_output.appointment:
        session.merge_booking_details(llm_output.appointment)

    # If appointment is confirmed and not yet created in calendar, book it!
    if (
        session.booking_state.is_confirmed
        and not session.booking_state.calendar_event_id
        and session.booking_state.service
    ):
        try:
            start_dt = parse_appointment_datetime(
                session.booking_state.preferred_date,
                session.booking_state.preferred_time,
            )
            event_id = await calendar_service.create_appointment(
                customer_name=session.booking_state.caller_name or "Valued Patient",
                service_name=session.booking_state.service,
                phone_number=caller_number,
                start_dt=start_dt,
            )
            if event_id:
                session.booking_state.calendar_event_id = event_id
                logger.info(f"Booked Google Calendar event {event_id} for CallSid={call_sid}")
        except Exception as e:
            logger.error(f"Failed to book Google Calendar event: {e}")

    # Generate TwiML according to intent
    should_end = (llm_output.intent == CallIntent.END_CALL)
    twiml_xml = twilio_service.build_response_twiml(
        reply_text=llm_output.reply,
        intent=llm_output.intent.value,
        should_end=should_end,
    )

    return Response(content=twiml_xml, media_type="application/xml")


@router.post("/status")
async def call_status_callback(
    request: Request,
    background_tasks: BackgroundTasks,
    x_twilio_signature: Optional[str] = Header(None, alias="X-Twilio-Signature"),
):
    """Twilio status callback webhook triggered on call completion or termination."""
    form_data = await request.form()
    params = dict(form_data)
    call_sid = params.get("CallSid", "unknown_call")
    call_status = params.get("CallStatus", "unknown")
    caller_number = params.get("From", "unknown")
    duration = int(params.get("CallDuration", 0))

    logger.info(f"Call status callback: CallSid={call_sid} | Status={call_status} | Duration={duration}s")

    session = session_manager.get(call_sid)
    if session:
        booking_dict = session.booking_state.model_dump()
        session_turns = [turn.model_dump() for turn in session.history]

        # Trigger background processing (SMS notification & logging)
        background_tasks.add_task(
            handle_post_call_summary,
            call_sid=call_sid,
            caller_number=caller_number,
            duration=duration,
            session_turns=session_turns,
            booking_state=booking_dict,
        )

        # Cleanup active memory session
        session_manager.remove(call_sid)

    return {"status": "ok", "call_sid": call_sid}
