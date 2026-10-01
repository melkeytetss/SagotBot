"""Google Sheets service for automated call logging and CRM updates."""

import asyncio
from datetime import datetime, timezone
import logging
import os
from typing import List, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)


class SheetsService:
    """Appends call details, transcripts, and booking outcomes to Google Sheets."""

    def __init__(self):
        self.credentials_path = settings.GOOGLE_APPLICATION_CREDENTIALS
        self.sheet_id = settings.GOOGLE_SHEET_ID
        self._client = None

    def _get_client(self):
        """Lazy load gspread client."""
        if not self._client and self.credentials_path and os.path.exists(self.credentials_path):
            try:
                import gspread
                self._client = gspread.service_account(filename=self.credentials_path)
                logger.info("Google Sheets gspread client initialized.")
            except Exception as e:
                logger.warning(f"Could not initialize Google Sheets client: {e}")
        return self._client

    def _sync_append_call_log(
        self,
        call_sid: str,
        caller_number: str,
        duration_seconds: int,
        intent: str,
        appointment_booked: bool,
        summary: str,
    ) -> bool:
        """Synchronously append row to Google Sheet."""
        client = self._get_client()
        if not client or not self.sheet_id:
            logger.info(
                f"[MOCK SHEETS] Appended log: CallSid={call_sid} | Caller={caller_number} | "
                f"Intent={intent} | Booked={appointment_booked} | Duration={duration_seconds}s"
            )
            return True

        try:
            sheet = client.open_by_key(self.sheet_id).sheet1
            # Add header row if spreadsheet is empty
            if len(sheet.get_all_values()) == 0:
                sheet.append_row([
                    "Timestamp (PH Time)",
                    "Call SID",
                    "Caller Number",
                    "Duration",
                    "Detected Intent",
                    "Booked?",
                    "AI Call Summary"
                ])

            from datetime import timedelta
            ph_now = datetime.now(timezone(timedelta(hours=8)))
            timestamp_str = ph_now.strftime("%Y-%m-%d %I:%M %p")
            row = [
                timestamp_str,
                call_sid,
                caller_number,
                f"{duration_seconds}s",
                intent,
                "YES" if appointment_booked else "NO",
                summary,
            ]
            sheet.append_row(row)
            logger.info(f"Successfully logged call {call_sid} to Google Sheet.")
            return True
        except Exception as e:
            logger.error(f"Failed to append row to Google Sheet: {e}")
            return False

    async def log_call(
        self,
        call_sid: str,
        caller_number: str,
        duration_seconds: int,
        intent: str,
        appointment_booked: bool,
        summary: str,
    ) -> bool:
        """Async wrapper for logging call to Google Sheets."""
        return await asyncio.to_thread(
            self._sync_append_call_log,
            call_sid,
            caller_number,
            duration_seconds,
            intent,
            appointment_booked,
            summary,
        )


sheets_service = SheetsService()
