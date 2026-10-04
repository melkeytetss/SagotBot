import { INDUSTRY_PRESETS, type IndustryPreset } from "@/lib/industry-presets";

export type IndustryId = IndustryPreset["id"];

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

/** Shape stored in businesses.operating_hours. A null open time means closed. */
export type DbHours = Record<DayKey, { open: string | null; close: string | null }>;

export interface HoursRow {
  key: DayKey;
  label: string;
  active: boolean;
  open: string;
  close: string;
}

export function hoursFromDb(hours: Partial<DbHours> | null | undefined): HoursRow[] {
  return DAY_KEYS.map((key) => {
    const day = hours?.[key];
    const active = Boolean(day?.open && day?.close);
    return {
      key,
      label: DAY_LABELS[key],
      active,
      open: day?.open ?? "09:00",
      close: day?.close ?? "18:00",
    };
  });
}

export function hoursToDb(rows: HoursRow[]): DbHours {
  const out = {} as DbHours;
  for (const row of rows) {
    out[row.key] = row.active ? { open: row.open, close: row.close } : { open: null, close: null };
  }
  return out;
}

export const INDUSTRY_OPTIONS = (Object.keys(INDUSTRY_PRESETS) as IndustryId[]).map((id) => ({
  id,
  name: INDUSTRY_PRESETS[id].name,
  categoryName: INDUSTRY_PRESETS[id].categoryName,
}));

/** Accepts current preset ids plus legacy values stored before presets existed. */
export function resolveIndustry(businessType: string | null | undefined): IndustryId {
  if (businessType && businessType in INDUSTRY_PRESETS) return businessType as IndustryId;
  if (businessType === "dental") return "clinic";
  return "studio";
}

export interface TemplateService {
  name: string;
  duration_minutes: number;
}

export interface TemplateFaq {
  question: string;
  category: string;
}

interface IndustryTemplate {
  greetingTopic: string;
  services: TemplateService[];
  faqs: TemplateFaq[];
}

/**
 * Starter content only. It never contains prices, addresses or accreditations,
 * so the receptionist cannot state facts the owner has not written.
 */
const TEMPLATES: Record<IndustryId, IndustryTemplate> = {
  studio: {
    greetingTopic: "your inquiry or consultation schedule",
    services: [
      { name: "Discovery Consultation", duration_minutes: 45 },
      { name: "Project Scoping Call", duration_minutes: 45 },
      { name: "Follow-up Meeting", duration_minutes: 30 },
    ],
    faqs: [
      { question: "How much is the initial consultation?", category: "Pricing" },
      { question: "Where is your office located?", category: "Location" },
      { question: "How long does a typical project take?", category: "Services" },
      { question: "Do you accept rush projects?", category: "Policy" },
    ],
  },
  salon: {
    greetingTopic: "your salon appointment",
    services: [
      { name: "Haircut", duration_minutes: 45 },
      { name: "Hair Color", duration_minutes: 120 },
      { name: "Hair Treatment", duration_minutes: 90 },
    ],
    faqs: [
      { question: "Do I need an advance reservation?", category: "Reservations" },
      { question: "Do you accept walk-ins?", category: "Policy" },
      { question: "Do you have promos?", category: "Promos" },
      { question: "How much are your services?", category: "Pricing" },
    ],
  },
  restaurant: {
    greetingTopic: "a table reservation or your questions about the menu",
    services: [
      { name: "Table Reservation", duration_minutes: 90 },
      { name: "Group or Party Reservation", duration_minutes: 120 },
      { name: "Private Event Inquiry", duration_minutes: 60 },
    ],
    faqs: [
      { question: "Do you have parking?", category: "Amenities" },
      { question: "Is there a corkage fee?", category: "Policies" },
      { question: "Are pets allowed?", category: "Amenities" },
      { question: "What are your opening hours?", category: "Hours" },
    ],
  },
  clinic: {
    greetingTopic: "your checkup or appointment schedule",
    services: [
      { name: "Consultation", duration_minutes: 30 },
      { name: "Checkup", duration_minutes: 45 },
      { name: "Procedure", duration_minutes: 60 },
    ],
    faqs: [
      { question: "Which HMOs do you accept?", category: "HMO" },
      { question: "How much is a consultation?", category: "Pricing" },
      { question: "Where is the clinic located?", category: "Location" },
      { question: "What should I bring to my appointment?", category: "Policy" },
    ],
  },
};

export const DEFAULT_BOT_NAME = "Sarah";

export function defaultGreeting(industry: IndustryId, businessName: string, botName: string): string {
  return `Magandang araw po! Salamat sa pagtawag sa ${businessName}. Ako po si ${botName}, ang virtual receptionist. Paano po kami makakatulong sa ${TEMPLATES[industry].greetingTopic}?`;
}

export function getTemplate(industry: IndustryId, businessName: string, botName = DEFAULT_BOT_NAME) {
  const preset = INDUSTRY_PRESETS[industry];
  const t = TEMPLATES[industry];
  return {
    greeting: defaultGreeting(industry, businessName, botName),
    hours: hoursToDb(
      preset.hours.map((h, i) => ({
        key: DAY_KEYS[i],
        label: h.day,
        active: h.active,
        open: h.open,
        close: h.close,
      }))
    ),
    services: t.services,
    faqs: t.faqs,
  };
}
