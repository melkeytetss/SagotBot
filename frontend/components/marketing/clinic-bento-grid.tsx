"use client";

import React from "react";
import { PhoneCall, ShieldCheck, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  preview: React.ReactNode;
}

function FeatureCard({ icon, title, description, preview }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl p-6",
        "bg-white border border-zinc-200/80 hover:border-zinc-300",
        "shadow-2xs hover:shadow-xs transition-all duration-200"
      )}
    >
      <div>
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-zinc-950 text-base tracking-tight mb-1.5">
          {title}
        </h3>
        <p className="text-zinc-600 text-xs leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-zinc-100">
        {preview}
      </div>
    </div>
  );
}

export function ClinicBentoGrid({ className = "" }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mx-auto", className)}>
      {/* 1. Taglish Voice AI */}
      <FeatureCard
        icon={<PhoneCall className="w-4 h-4 stroke-[2.2]" />}
        title="Taglish Voice AI"
        description="Understands colloquial Philippine Taglish, local phrasing, and customer accents with natural conversational cadence."
        preview={
          <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
            <span className="flex items-center gap-1.5 text-blue-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Taglish Engine
            </span>
            <span className="text-[11px] text-zinc-400">380ms latency</span>
          </div>
        }
      />

      {/* 2. Instant FAQ & Qualification */}
      <FeatureCard
        icon={<ShieldCheck className="w-4 h-4 stroke-[2.2]" />}
        title="Instant FAQ & Qualification"
        description="Answers questions on pricing, services, locations, and operating hours while screening and qualifying high-intent leads."
        preview={
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">Pricing & Rates</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">Hours & Branch</span>
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">Lead Scoring</span>
          </div>
        }
      />

      {/* 3. Google Calendar Locking */}
      <FeatureCard
        icon={<CalendarCheck className="w-4 h-4 stroke-[2.2]" />}
        title="Calendar & Booking Sync"
        description="Checks team availability in real time, respects service buffer times, and confirms bookings straight into Google Calendar."
        preview={
          <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
            <span className="text-zinc-900 font-medium">Auto-Lock Slots</span>
            <span className="text-[11px] text-blue-600">Google Calendar ✓</span>
          </div>
        }
      />
    </div>
  );
}

export default ClinicBentoGrid;
