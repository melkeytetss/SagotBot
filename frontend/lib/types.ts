import type { DbHours } from "@/lib/templates";

export interface Business {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  phone_number: string | null;
  forwarding_phone: string | null;
  operating_hours: DbHours;
  location: string | null;
  timezone: string;
  greeting: string | null;
  bot_name: string | null;
  google_calendar_id: string | null;
  google_sheet_id: string | null;
  onboarding_complete: boolean;
}

export interface Faq {
  id: string;
  business_id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price_min: number | null;
  price_max: number | null;
  duration_minutes: number;
  is_active: boolean;
}

export interface CallLog {
  id: string;
  business_id: string;
  call_sid: string;
  caller_number: string;
  duration_seconds: number;
  detected_language: string | null;
  primary_intent: string | null;
  appointment_booked: boolean;
  call_summary: string | null;
  created_at: string;
}

export interface CallTranscript {
  id: string;
  call_log_id: string;
  speaker: string;
  content: string;
  turn_order: number;
}

export type AppointmentStatus = "confirmed" | "rescheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  business_id: string;
  call_log_id: string | null;
  customer_name: string;
  customer_phone: string;
  service: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string | null;
}
