"""Google Calendar service for checking appointment slots and booking events."""

import asyncio
from datetime import datetime, timedelta, timezone
import logging
import os
from typing import Any, Dict, List, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)


class CalendarService:
    """Manages Google Calendar slot checks and event creation."""

    def __init__(self):
        self._service = None

    @property
    def credentials_path(self) -> Optional[str]:
        return settings.GOOGLE_APPLICATION_CREDENTIALS

    @property
    def calendar_id(self) -> str:
        return settings.GOOGLE_CALENDAR_ID

    def _get_service(self):
        """Lazy load Google Calendar API client."""
        if not self._service and self.credentials_path and os.path.exists(self.credentials_path):
            try:
                from google.oauth2 import service_account
                from googleapiclient.discovery import build

                scopes = ["https://www.googleapis.com/auth/calendar"]
                creds = service_account.Credentials.from_service_account_file(
                    self.credentials_path, scopes=scopes
                )
                self._service = build("calendar", "v3", credentials=creds)
                logger.info("Google Calendar client successfully initialized.")
            except Exception as e:
                logger.warning(f"Could not initialize Google Calendar client: {e}")
        return self._service

    def _sync_check_slot_available(self, start_dt: datetime, end_dt: datetime) -> bool:
        """Synchronously query free/busy calendar API."""
        service = self._get_service()
        if not service:
            logger.info("[MOCK CALENDAR] Treating slot as available (credentials not provided).")
            return True

        # Ensure valid RFC3339 UTC string
        start_utc = start_dt if start_dt.tzinfo else start_dt.replace(tzinfo=timezone.utc)
        end_utc = end_dt if end_dt.tzinfo else end_dt.replace(tzinfo=timezone.utc)
        start_utc = start_utc.astimezone(timezone.utc)
        end_utc = end_utc.astimezone(timezone.utc)

        body = {
            "timeMin": start_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "timeMax": end_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "items": [{"id": self.calendar_id}],
        }
        events_result = service.freebusy().query(body=body).execute()
        busy_slots = events_result.get("calendars", {}).get(self.calendar_id, {}).get("busy", [])
        return len(busy_slots) == 0

    async def is_slot_available(self, start_dt: datetime, end_dt: datetime) -> bool:
        """Check if time range is free without blocking async event loop."""
        return await asyncio.to_thread(self._sync_check_slot_available, start_dt, end_dt)

    def _sync_create_event(
        self,
        customer_name: str,
        service_name: str,
        phone_number: str,
        start_dt: datetime,
        end_dt: datetime,
    ) -> Optional[str]:
        """Synchronously insert event into Google Calendar."""
        service = self._get_service()
        if not service:
            logger.info(f"[MOCK CALENDAR] Created event: {service_name} for {customer_name} at {start_dt}")
            return "mock_event_id_12345"

        event = {
            "summary": f"[SagotBot] {service_name} - {customer_name}",
            "description": f"Booked via SagotBot Phone Receptionist.\nCustomer: {customer_name}\nPhone: {phone_number}\nService: {service_name}",
            "start": {"dateTime": start_dt.isoformat(), "timeZone": "Asia/Manila"},
            "end": {"dateTime": end_dt.isoformat(), "timeZone": "Asia/Manila"},
            "reminders": {
                "useDefault": False,
                "overrides": [
                    {"method": "popup", "minutes": 30},
                    {"method": "popup", "minutes": 1440},  # 1 day before
                ],
            },
        }
        created = service.events().insert(calendarId=self.calendar_id, body=event).execute()
        return created.get("id")

    async def create_appointment(
        self,
        customer_name: str,
        service_name: str,
        phone_number: str,
        start_dt: datetime,
        duration_minutes: int = 45,
    ) -> Optional[str]:
        """Async wrapper to book appointment slot."""
        end_dt = start_dt + timedelta(minutes=duration_minutes)
        return await asyncio.to_thread(
            self._sync_create_event,
            customer_name,
            service_name,
            phone_number,
            start_dt,
            end_dt,
        )


calendar_service = CalendarService()


def parse_appointment_datetime(date_str: Optional[str], time_str: Optional[str]) -> datetime:
    """Parse various natural date and time strings into a Manila timezone datetime."""
    try:
        from zoneinfo import ZoneInfo
        ph_tz = ZoneInfo("Asia/Manila")
    except Exception:
        ph_tz = timezone.utc

    now = datetime.now(ph_tz)
    target_date = now.date()

    if date_str:
        d_lower = date_str.lower().strip()
        if "bukas" in d_lower or "tomorrow" in d_lower:
            target_date = now.date() + timedelta(days=1)
        elif "samakalawa" in d_lower:
            target_date = now.date() + timedelta(days=2)
        else:
            weekdays = {
                "monday": 0, "lunes": 0,
                "tuesday": 1, "martes": 1,
                "wednesday": 2, "miyerkules": 2,
                "thursday": 3, "huwebes": 3,
                "friday": 4, "biyernes": 4,
                "saturday": 5, "sabado": 5,
                "sunday": 6, "linggo": 6,
            }
            matched_day = None
            for name, num in weekdays.items():
                if name in d_lower:
                    matched_day = num
                    break

            if matched_day is not None:
                days_ahead = (matched_day - now.weekday()) % 7
                if days_ahead == 0:
                    days_ahead = 7
                target_date = now.date() + timedelta(days=days_ahead)
            else:
                import re
                iso_match = re.search(r"\b(\d{4})-(\d{1,2})-(\d{1,2})\b", date_str)
                if iso_match:
                    try:
                        target_date = datetime.strptime(iso_match.group(0), "%Y-%m-%d").date()
                    except Exception:
                        pass

    # Parse time (default 10:00 AM)
    hour = 10
    minute = 0
    if time_str:
        t_lower = time_str.lower().strip()
        import re
        match_hm = re.search(r"(\d{1,2}):(\d{2})", t_lower)
        match_single = re.search(r"(\d{1,2})\s*(am|pm)?", t_lower)
        if match_hm:
            h = int(match_hm.group(1))
            minute = int(match_hm.group(2))
            if "pm" in t_lower and h < 12:
                h += 12
            elif "am" in t_lower and h == 12:
                h = 0
            hour = h
        elif match_single:
            h = int(match_single.group(1))
            is_pm = match_single.group(2) == "pm" or "hapon" in t_lower or "gabi" in t_lower
            is_am = match_single.group(2) == "am" or "umaga" in t_lower
            if is_pm and h < 12:
                h += 12
            elif is_am and h == 12:
                h = 0
            elif h <= 6:
                h += 12
            hour = h

    return datetime(target_date.year, target_date.month, target_date.day, hour, minute, tzinfo=ph_tz)

