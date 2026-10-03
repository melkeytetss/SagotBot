"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  IndustryPreset,
  INDUSTRY_PRESETS,
  FAQItem,
  CallRecord,
  AppointmentRecord,
} from "@/lib/industry-presets";

interface IndustryContextType {
  preset: IndustryPreset;
  industryId: IndustryPreset["id"];
  switchIndustry: (id: IndustryPreset["id"]) => void;
  businessName: string;
  setBusinessName: (val: string) => void;
  greeting: string;
  setGreeting: (val: string) => void;
  forwardingPhone: string;
  setForwardingPhone: (val: string) => void;
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  hours: IndustryPreset["hours"];
  setHours: React.Dispatch<React.SetStateAction<IndustryPreset["hours"]>>;
  calls: CallRecord[];
  appointments: AppointmentRecord[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentRecord[]>>;
  resetToPresetDefaults: (id: IndustryPreset["id"]) => void;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

export function IndustryProvider({ children }: { children: React.ReactNode }) {
  const [industryId, setIndustryId] = useState<IndustryPreset["id"]>("studio");
  const [preset, setPreset] = useState<IndustryPreset>(INDUSTRY_PRESETS.studio);
  const [businessName, setBusinessName] = useState(INDUSTRY_PRESETS.studio.businessName);
  const [greeting, setGreeting] = useState(INDUSTRY_PRESETS.studio.greeting);
  const [forwardingPhone, setForwardingPhone] = useState(INDUSTRY_PRESETS.studio.forwardingPhone);
  const [faqs, setFaqs] = useState<FAQItem[]>(INDUSTRY_PRESETS.studio.faqs);
  const [hours, setHours] = useState(INDUSTRY_PRESETS.studio.hours);
  const [calls, setCalls] = useState<CallRecord[]>(INDUSTRY_PRESETS.studio.calls);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(
    INDUSTRY_PRESETS.studio.appointments
  );

  // Sync from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sagotbot_active_industry") as IndustryPreset["id"] | null;
      if (saved && INDUSTRY_PRESETS[saved]) {
        switchIndustry(saved);
      }
    } catch {
      // LocalStorage not available or blocked
    }
  }, []);

  const switchIndustry = (id: IndustryPreset["id"]) => {
    const selected = INDUSTRY_PRESETS[id] || INDUSTRY_PRESETS.studio;
    setIndustryId(id);
    setPreset(selected);
    setBusinessName(selected.businessName);
    setGreeting(selected.greeting);
    setForwardingPhone(selected.forwardingPhone);
    setFaqs(selected.faqs);
    setHours(selected.hours);
    setCalls(selected.calls);
    setAppointments(selected.appointments);

    try {
      localStorage.setItem("sagotbot_active_industry", id);
    } catch {
      // Ignore storage errors
    }
  };

  const resetToPresetDefaults = (id: IndustryPreset["id"]) => {
    switchIndustry(id);
  };

  return (
    <IndustryContext.Provider
      value={{
        preset,
        industryId,
        switchIndustry,
        businessName,
        setBusinessName,
        greeting,
        setGreeting,
        forwardingPhone,
        setForwardingPhone,
        faqs,
        setFaqs,
        hours,
        setHours,
        calls,
        appointments,
        setAppointments,
        resetToPresetDefaults,
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const context = useContext(IndustryContext);
  if (!context) {
    throw new Error("useIndustry must be used within an IndustryProvider");
  }
  return context;
}
