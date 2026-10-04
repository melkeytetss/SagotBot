"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  IndustryPreset,
  INDUSTRY_PRESETS,
  FAQItem,
  CallRecord,
  AppointmentRecord,
} from "@/lib/industry-presets";
import { createClient } from "@/lib/supabase/client";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
  is_active?: boolean;
}

export interface DayHour {
  day: string;
  open: string;
  close: string;
  active: boolean;
}

interface IndustryContextType {
  preset: IndustryPreset;
  industryId: IndustryPreset["id"];
  switchIndustry: (id: IndustryPreset["id"]) => void;
  businessId: string | null;
  businessName: string;
  setBusinessName: (val: string) => void;
  greeting: string;
  setGreeting: (val: string) => void;
  forwardingPhone: string;
  setForwardingPhone: (val: string) => void;
  botName: string;
  setBotName: (val: string) => void;
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
  hours: DayHour[];
  setHours: React.Dispatch<React.SetStateAction<DayHour[]>>;
  calls: CallRecord[];
  setCalls: React.Dispatch<React.SetStateAction<CallRecord[]>>;
  appointments: AppointmentRecord[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentRecord[]>>;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  user: any;
  userRole: string;
  loading: boolean;
  saveSettings: () => Promise<boolean>;
  applyTemplate: (id: IndustryPreset["id"]) => Promise<void>;
  addService: (item: Omit<ServiceItem, "id">) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addFaq: (item: Omit<FAQItem, "id">) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  addAppointment: (apt: {
    clientName: string;
    clientPhone: string;
    service: string;
    date: string;
    time: string;
  }) => Promise<void>;
  rescheduleAppointment: (id: string, newTime: string, newDate?: string) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  logCall: (callData: {
    caller: string;
    phone: string;
    duration: string;
    intent: string;
    language: string;
    booked: boolean;
    appointmentTime?: string;
    summary: string;
    transcripts?: { speaker: "caller" | "bot"; text: string; timestamp: string }[];
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const IndustryContext = createContext<IndustryContextType | undefined>(undefined);

const DEFAULT_HOURS: DayHour[] = [
  { day: "Monday", open: "09:00", close: "18:00", active: true },
  { day: "Tuesday", open: "09:00", close: "18:00", active: true },
  { day: "Wednesday", open: "09:00", close: "18:00", active: true },
  { day: "Thursday", open: "09:00", close: "18:00", active: true },
  { day: "Friday", open: "09:00", close: "18:00", active: true },
  { day: "Saturday", open: "09:00", close: "18:00", active: true },
  { day: "Sunday", open: "10:00", close: "16:00", active: false },
];

export function IndustryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("owner");
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [industryId, setIndustryId] = useState<IndustryPreset["id"]>("clinic");
  const [preset, setPreset] = useState<IndustryPreset>(INDUSTRY_PRESETS.clinic);
  const [businessName, setBusinessName] = useState("SagotBot Receptionist");
  const [greeting, setGreeting] = useState("Salamat sa pagtawag! Ako po si Sarah, paano kita matutulungan today?");
  const [forwardingPhone, setForwardingPhone] = useState("+63 917 123 4567");
  const [botName, setBotName] = useState("Sarah");
  const [hours, setHours] = useState<DayHour[]>(DEFAULT_HOURS);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);

  // Convert DB jsonb operating_hours to DayHour[]
  const parseOperatingHours = (raw: any): DayHour[] => {
    if (!raw || typeof raw !== "object") return DEFAULT_HOURS;
    const dayMap: Record<string, string> = {
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
      sun: "Sunday",
    };

    return Object.entries(dayMap).map(([key, label]) => {
      const entry = raw[key];
      if (entry && entry.open && entry.close) {
        return { day: label, open: entry.open, close: entry.close, active: true };
      }
      return { day: label, open: "09:00", close: "18:00", active: false };
    });
  };

  // Convert DayHour[] to DB jsonb operating_hours
  const serializeOperatingHours = (hourList: DayHour[]) => {
    const keyMap: Record<string, string> = {
      Monday: "mon",
      Tuesday: "tue",
      Wednesday: "wed",
      Thursday: "thu",
      Friday: "fri",
      Saturday: "sat",
      Sunday: "sun",
    };
    const result: Record<string, any> = {};
    hourList.forEach((h) => {
      const k = keyMap[h.day] || h.day.toLowerCase().slice(0, 3);
      result[k] = h.active ? { open: h.open, close: h.close } : { open: null, close: null };
    });
    return result;
  };

  // Load tenant data from Supabase
  const loadTenantData = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      if (!currentUser) {
        // Fallback to sample presets for guest preview if any
        setPreset(INDUSTRY_PRESETS.clinic);
        setBusinessName(INDUSTRY_PRESETS.clinic.businessName);
        setFaqs(INDUSTRY_PRESETS.clinic.faqs);
        setCalls(INDUSTRY_PRESETS.clinic.calls);
        setAppointments(INDUSTRY_PRESETS.clinic.appointments);
        setLoading(false);
        return;
      }

      // 1. Fetch user's business membership
      let { data: members } = await supabase
        .from("business_members")
        .select("business_id, role")
        .eq("user_id", currentUser.id)
        .limit(1);

      let currentBizId = members && members.length > 0 ? members[0].business_id : null;
      if (members && members.length > 0) {
        setUserRole(members[0].role || "owner");
      }

      // If user has no business, provision one automatically via RPC
      if (!currentBizId) {
        const fallbackName = currentUser.user_metadata?.full_name
          ? `${currentUser.user_metadata.full_name}'s Workspace`
          : "My Business";
        const { data: newBizId, error: rpcErr } = await supabase.rpc("create_business_for_user", {
          p_name: fallbackName,
          p_business_type: "general",
          p_phone: "+63 917 123 4567",
        });

        if (!rpcErr && newBizId) {
          currentBizId = newBizId;
        } else {
          // If RPC didn't return, check first business
          const { data: firstBiz } = await supabase.from("businesses").select("id").limit(1);
          if (firstBiz && firstBiz.length > 0) {
            currentBizId = firstBiz[0].id;
          }
        }
      }

      if (!currentBizId) {
        setLoading(false);
        return;
      }

      setBusinessId(currentBizId);

      // 2. Fetch Business details
      const { data: biz } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", currentBizId)
        .single();

      if (biz) {
        setBusinessName(biz.name || "SagotBot Receptionist");
        setGreeting(biz.greeting || "Salamat sa pagtawag! Ako po si Sarah, paano po kita matutulungan today?");
        setForwardingPhone(biz.forwarding_phone || biz.phone_number || "+63 917 123 4567");
        setBotName(biz.bot_name || "Sarah");

        const parsedHours = parseOperatingHours(biz.operating_hours);
        setHours(parsedHours);

        const type = (biz.business_type || "clinic") as IndustryPreset["id"];
        if (INDUSTRY_PRESETS[type]) {
          setIndustryId(type);
          setPreset(INDUSTRY_PRESETS[type]);
        }
      }

      // 3. Fetch Services
      const { data: dbServices } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", currentBizId)
        .order("created_at", { ascending: true });

      if (dbServices) {
        setServices(
          dbServices.map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description || "",
            price_min: Number(s.price_min) || 0,
            price_max: Number(s.price_max) || Number(s.price_min) || 0,
            duration_minutes: s.duration_minutes || 45,
            is_active: s.is_active !== false,
          }))
        );
      }

      // 4. Fetch FAQs
      const { data: dbFaqs } = await supabase
        .from("business_faqs")
        .select("*")
        .eq("business_id", currentBizId)
        .order("created_at", { ascending: true });

      if (dbFaqs) {
        setFaqs(
          dbFaqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category || "General",
          }))
        );
      }

      // 5. Fetch Appointments
      const { data: dbApts } = await supabase
        .from("appointments")
        .select("*")
        .eq("business_id", currentBizId)
        .order("start_time", { ascending: false });

      if (dbApts) {
        setAppointments(
          dbApts.map((a) => {
            const start = a.start_time ? new Date(a.start_time) : new Date();
            const dateStr = start.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            });
            const timeStr = start.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            });

            return {
              id: a.id,
              clientName: a.customer_name || "Guest Customer",
              clientPhone: a.customer_phone || "+63 900 000 0000",
              service: a.service || "Standard Session",
              staffOrLocation: a.notes || "Main Branch",
              time: timeStr,
              date: dateStr,
              status: (a.status || "confirmed") as AppointmentRecord["status"],
              origin: a.google_event_id ? "AI Phone Call" : "Manual Entry",
            };
          })
        );
      }

      // 6. Fetch Call Logs and Transcripts
      const { data: dbCalls } = await supabase
        .from("call_logs")
        .select("*, call_transcripts(*)")
        .eq("business_id", currentBizId)
        .order("created_at", { ascending: false });

      if (dbCalls && dbCalls.length > 0) {
        setCalls(
          dbCalls.map((c) => {
            const createdAt = c.created_at ? new Date(c.created_at) : new Date();
            const timeStr = createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            });
            const minutes = Math.floor((c.duration_seconds || 0) / 60);
            const seconds = (c.duration_seconds || 0) % 60;

            const transcriptsList = (c.call_transcripts || [])
              .sort((a: any, b: any) => (a.turn_order || 0) - (b.turn_order || 0))
              .map((t: any) => ({
                speaker: (t.speaker || "bot") as "caller" | "bot",
                text: t.content || "",
                timestamp: "00:15",
              }));

            return {
              id: c.id,
              caller: c.primary_intent || "Inbound Caller",
              phone: c.caller_number || "+63 900 000 0000",
              time: timeStr,
              duration: `${minutes}m ${seconds}s`,
              intent: c.primary_intent || "General Inquiry",
              language: (c.detected_language === "tagalog" ? "Tagalog" : c.detected_language === "english" ? "English" : "Taglish"),
              booked: Boolean(c.appointment_booked),
              appointmentTime: c.appointment_booked ? "Scheduled via Call" : "",
              summary: c.call_summary || "Call answered by SagotBot AI receptionist.",
              transcripts: transcriptsList,
            };
          })
        );
      }
    } catch (err) {
      console.error("Error loading tenant data from Supabase:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTenantData();
  }, [loadTenantData]);

  // Persist business settings (Persona, Hours, Forwarding)
  const saveSettings = async (): Promise<boolean> => {
    if (!businessId) return false;
    try {
      const supabase = createClient();
      const serializedHours = serializeOperatingHours(hours);

      const { error } = await supabase
        .from("businesses")
        .update({
          name: businessName,
          bot_name: botName,
          greeting,
          forwarding_phone: forwardingPhone,
          operating_hours: serializedHours,
          updated_at: new Date().toISOString(),
        })
        .eq("id", businessId);

      if (error) {
        console.error("Error saving business settings:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error saving settings:", err);
      return false;
    }
  };

  // Start from template action
  const applyTemplate = async (id: IndustryPreset["id"]) => {
    const selected = INDUSTRY_PRESETS[id] || INDUSTRY_PRESETS.clinic;
    setIndustryId(id);
    setPreset(selected);
    setBusinessName(selected.businessName);
    setGreeting(selected.greeting);
    setForwardingPhone(selected.forwardingPhone);
    setHours(selected.hours);

    if (!businessId) return;

    try {
      const supabase = createClient();
      await supabase
        .from("businesses")
        .update({
          business_type: id,
          name: selected.businessName,
          greeting: selected.greeting,
          forwarding_phone: selected.forwardingPhone,
          operating_hours: serializeOperatingHours(selected.hours),
        })
        .eq("id", businessId);

      // Add default FAQs for this preset
      for (const faq of selected.faqs.slice(0, 3)) {
        await supabase.from("business_faqs").insert({
          business_id: businessId,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
        });
      }

      await loadTenantData();
    } catch (err) {
      console.error("Error applying template:", err);
    }
  };

  // Services CRUD
  const addService = async (item: Omit<ServiceItem, "id">) => {
    if (!businessId) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("services")
        .insert({
          business_id: businessId,
          name: item.name,
          description: item.description,
          price_min: item.price_min,
          price_max: item.price_max,
          duration_minutes: item.duration_minutes,
        })
        .select()
        .single();

      if (!error && data) {
        setServices((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            description: data.description || "",
            price_min: Number(data.price_min) || 0,
            price_max: Number(data.price_max) || 0,
            duration_minutes: data.duration_minutes || 45,
            is_active: data.is_active !== false,
          },
        ]);
      }
    } catch (err) {
      console.error("Error adding service:", err);
    }
  };

  const deleteService = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from("services").delete().eq("id", id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  // FAQs CRUD
  const addFaq = async (item: Omit<FAQItem, "id">) => {
    if (!businessId) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("business_faqs")
        .insert({
          business_id: businessId,
          question: item.question,
          answer: item.answer,
          category: item.category || "General",
        })
        .select()
        .single();

      if (!error && data) {
        setFaqs((prev) => [
          ...prev,
          {
            id: data.id,
            question: data.question,
            answer: data.answer,
            category: data.category,
          },
        ]);
      }
    } catch (err) {
      console.error("Error adding FAQ:", err);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from("business_faqs").delete().eq("id", id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Error deleting FAQ:", err);
    }
  };

  // Appointments CRUD
  const addAppointment = async (apt: {
    clientName: string;
    clientPhone: string;
    service: string;
    date: string;
    time: string;
  }) => {
    if (!businessId) return;
    try {
      const supabase = createClient();
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 45 * 60000);

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          business_id: businessId,
          customer_name: apt.clientName,
          customer_phone: apt.clientPhone,
          service: apt.service,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: "confirmed",
          notes: "Manual Entry",
        })
        .select()
        .single();

      if (!error && data) {
        const newRecord: AppointmentRecord = {
          id: data.id,
          clientName: apt.clientName,
          clientPhone: apt.clientPhone,
          service: apt.service,
          staffOrLocation: "Main Branch",
          time: apt.time,
          date: apt.date || "Today",
          status: "confirmed",
          origin: "Manual Entry",
        };
        setAppointments((prev) => [newRecord, ...prev]);
      }
    } catch (err) {
      console.error("Error adding appointment:", err);
    }
  };

  const rescheduleAppointment = async (id: string, newTime: string, newDate?: string) => {
    try {
      const supabase = createClient();
      const updatedTime = new Date();

      await supabase
        .from("appointments")
        .update({
          start_time: updatedTime.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, time: newTime, date: newDate || a.date, status: "rescheduled" } : a
        )
      );
    } catch (err) {
      console.error("Error rescheduling appointment:", err);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  // Call Logs logging
  const logCall = async (callData: {
    caller: string;
    phone: string;
    duration: string;
    intent: string;
    language: string;
    booked: boolean;
    appointmentTime?: string;
    summary: string;
    transcripts?: { speaker: "caller" | "bot"; text: string; timestamp: string }[];
  }) => {
    if (!businessId) return;
    try {
      const supabase = createClient();
      const sid = `sim-${Date.now()}`;
      const { data, error } = await supabase
        .from("call_logs")
        .insert({
          business_id: businessId,
          call_sid: sid,
          caller_number: callData.phone,
          duration_seconds: 90,
          detected_language: callData.language.toLowerCase(),
          primary_intent: callData.intent,
          appointment_booked: callData.booked,
          call_summary: callData.summary,
        })
        .select()
        .single();

      if (!error && data) {
        if (callData.transcripts && callData.transcripts.length > 0) {
          const turns = callData.transcripts.map((t, idx) => ({
            call_log_id: data.id,
            business_id: businessId,
            speaker: t.speaker,
            content: t.text,
            turn_order: idx + 1,
          }));
          await supabase.from("call_transcripts").insert(turns);
        }

        const newCallRecord: CallRecord = {
          id: data.id,
          caller: callData.caller,
          phone: callData.phone,
          time: "Just now",
          duration: callData.duration,
          intent: callData.intent,
          language: callData.language,
          booked: callData.booked,
          appointmentTime: callData.appointmentTime || "",
          summary: callData.summary,
          transcripts: callData.transcripts || [],
        };
        setCalls((prev) => [newCallRecord, ...prev]);
      }
    } catch (err) {
      console.error("Error logging call:", err);
    }
  };

  // Real Supabase Sign Out
  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      router.push("/login");
    }
  };

  return (
    <IndustryContext.Provider
      value={{
        preset,
        industryId,
        switchIndustry: (id) => applyTemplate(id),
        businessId,
        businessName,
        setBusinessName,
        greeting,
        setGreeting,
        forwardingPhone,
        setForwardingPhone,
        botName,
        setBotName,
        faqs,
        setFaqs,
        hours,
        setHours,
        calls,
        setCalls,
        appointments,
        setAppointments,
        services,
        setServices,
        user,
        userRole,
        loading,
        saveSettings,
        applyTemplate,
        addService,
        deleteService,
        addFaq,
        deleteFaq,
        addAppointment,
        rescheduleAppointment,
        cancelAppointment,
        logCall,
        signOut,
        refresh: loadTenantData,
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
