"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { INDUSTRY_PRESETS, type IndustryPreset } from "@/lib/industry-presets";
import { DEFAULT_BOT_NAME, getTemplate, resolveIndustry, type IndustryId } from "@/lib/templates";
import type { Business, Faq, Service } from "@/lib/types";

interface TenantContextType {
  supabase: SupabaseClient;
  status: "loading" | "ready" | "error";
  error: string | null;
  user: User | null;
  fullName: string;
  role: string;
  business: Business | null;
  industry: IndustryId;
  /** Label set (client, booking type) for the tenant's industry. Not business data. */
  labels: IndustryPreset;
  faqs: Faq[];
  services: Service[];
  reload: () => Promise<void>;
  saveBusiness: (patch: Partial<Business>) => Promise<string | null>;
  applyTemplate: (industry: IndustryId) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

async function seedStarter(
  supabase: SupabaseClient,
  businessId: string,
  industry: IndustryId,
  businessName: string,
  botName: string
): Promise<string | null> {
  const template = getTemplate(industry, businessName, botName);

  const { error: bizError } = await supabase
    .from("businesses")
    .update({
      business_type: industry,
      greeting: template.greeting,
      bot_name: botName,
      operating_hours: template.hours,
    })
    .eq("id", businessId);
  if (bizError) return bizError.message;

  // Starter questions stay inactive until the owner writes the answer.
  const { error: faqError } = await supabase.from("business_faqs").insert(
    template.faqs.map((f) => ({
      business_id: businessId,
      question: f.question,
      answer: "",
      category: f.category,
      is_active: false,
    }))
  );
  if (faqError) return faqError.message;

  const { error: serviceError } = await supabase.from("services").insert(
    template.services.map((s) => ({
      business_id: businessId,
      name: s.name,
      duration_minutes: s.duration_minutes,
    }))
  );
  return serviceError ? serviceError.message : null;
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("owner");
  const [business, setBusiness] = useState<Business | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const fetchAll = useCallback(
    async (businessId: string) => {
      const [biz, faqRows, serviceRows] = await Promise.all([
        supabase.from("businesses").select("*").eq("id", businessId).single(),
        supabase.from("business_faqs").select("*").eq("business_id", businessId).order("created_at"),
        supabase.from("services").select("*").eq("business_id", businessId).order("created_at"),
      ]);
      if (biz.error) throw new Error(biz.error.message);
      setBusiness(biz.data as Business);
      setFaqs((faqRows.data ?? []) as Faq[]);
      setServices((serviceRows.data ?? []) as Service[]);
    },
    [supabase]
  );

  const load = useCallback(async () => {
    try {
      const {
        data: { user: current },
      } = await supabase.auth.getUser();
      if (!current) {
        router.replace("/login");
        return;
      }
      setUser(current);

      const { data: member, error: memberError } = await supabase
        .from("business_members")
        .select("business_id, role")
        .eq("user_id", current.id)
        .limit(1)
        .maybeSingle();
      if (memberError) throw new Error(memberError.message);

      let businessId = member?.business_id as string | undefined;
      setRole(member?.role ?? "owner");

      // First sign-in after signup: create the workspace from the signup details.
      if (!businessId) {
        const meta = current.user_metadata ?? {};
        const industry = resolveIndustry(meta.business_type);
        const name = (meta.business_name as string) || "My Business";
        const { data: createdId, error: createError } = await supabase.rpc("create_business_for_user", {
          p_name: name,
          p_business_type: industry,
          p_phone: (meta.phone as string) || "",
        });
        if (createError) throw new Error(createError.message);
        businessId = createdId as string;
        const seedError = await seedStarter(supabase, businessId, industry, name, DEFAULT_BOT_NAME);
        if (seedError) throw new Error(seedError);
        setRole("owner");
      }

      await fetchAll(businessId);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your workspace.");
      setStatus("error");
    }
  }, [supabase, router, fetchAll]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const reload = useCallback(async () => {
    if (business) await fetchAll(business.id);
  }, [business, fetchAll]);

  const saveBusiness = useCallback(
    async (patch: Partial<Business>) => {
      if (!business) return "No workspace loaded.";
      const { error: updateError } = await supabase.from("businesses").update(patch).eq("id", business.id);
      if (updateError) return updateError.message;
      await fetchAll(business.id);
      return null;
    },
    [business, supabase, fetchAll]
  );

  const applyTemplate = useCallback(
    async (industry: IndustryId) => {
      if (!business) return "No workspace loaded.";
      const [{ error: faqError }, { error: serviceError }] = await Promise.all([
        supabase.from("business_faqs").delete().eq("business_id", business.id),
        supabase.from("services").delete().eq("business_id", business.id),
      ]);
      if (faqError || serviceError) return (faqError ?? serviceError)!.message;
      const seedError = await seedStarter(
        supabase,
        business.id,
        industry,
        business.name,
        business.bot_name || DEFAULT_BOT_NAME
      );
      if (seedError) return seedError;
      await fetchAll(business.id);
      return null;
    },
    [business, supabase, fetchAll]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  }, [supabase, router]);

  const industry = resolveIndustry(business?.business_type);
  const fullName = (user?.user_metadata?.full_name as string) || user?.email?.split("@")[0] || "";

  const value: TenantContextType = {
    supabase,
    status,
    error,
    user,
    fullName,
    role,
    business,
    industry,
    labels: INDUSTRY_PRESETS[industry],
    faqs,
    services,
    reload,
    saveBusiness,
    applyTemplate,
    signOut,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used within a TenantProvider");
  return context;
}

/** For pages that render only after the workspace has loaded. */
export function useBusiness() {
  const ctx = useTenant();
  if (!ctx.business) throw new Error("Workspace not loaded");
  return { ...ctx, business: ctx.business };
}
