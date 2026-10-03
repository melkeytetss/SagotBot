"use client";

import React from "react";
import Link from "next/link";
import {
  PhoneCall,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  PhoneIncoming,
  Calendar,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { formatPHP } from "@/lib/utils";
import { GlowBorderCard } from "@/components/ui/glow-border-card";
import { StatsCounter } from "@/components/ui/stats-counter";
import { CandyButton } from "@/components/ui/candy-button";
import { FlipText } from "@/components/ui/flip-text";

export default function DashboardOverviewPage() {
  const kpis = [
    {
      title: "Inbound Calls Handled",
      numericValue: 342,
      duration: 1.5,
      change: "+18.4%",
      period: "vs last 7 days",
      icon: PhoneCall,
      accent: "text-emerald-400",
      bg: "bg-emerald-500/10",
      gradientColors: ["#10b981", "#059669", "#34d399", "#10b981"],
    },
    {
      title: "Appointments Booked",
      numericValue: 187,
      duration: 1.5,
      change: "54.6%",
      period: "call conversion rate",
      icon: CalendarCheck,
      accent: "text-teal-400",
      bg: "bg-teal-500/10",
      gradientColors: ["#06b6d4", "#0ea5e9", "#3b82f6", "#06b6d4"],
    },
    {
      title: "Revenue Booked",
      numericValue: 280500,
      prefix: "₱",
      duration: 2.0,
      decimals: 0,
      change: "+₱42,000",
      period: "recovered after-hours",
      icon: TrendingUp,
      accent: "text-emerald-300",
      bg: "bg-emerald-500/10",
      gradientColors: ["#10b981", "#f59e0b", "#10b981", "#059669"],
    },
    {
      title: "Reception Hours Saved",
      numericValue: 48.5,
      suffix: " hrs",
      decimals: 1,
      duration: 1.8,
      change: "100%",
      period: "answered within 1 ring",
      icon: Clock,
      accent: "text-purple-400",
      bg: "bg-purple-500/10",
      gradientColors: ["#8b5cf6", "#a855f7", "#ec4899", "#8b5cf6"],
    },
  ];

  const recentCalls = [
    {
      id: "call-1",
      caller: "Maria Clara Santos",
      phone: "+63 917 555 0192",
      intent: "Teeth Cleaning (Oral Prophylaxis)",
      duration: "1m 45s",
      booked: true,
      time: "10 mins ago",
      summary: "Patient booked cleaning for tomorrow 2:00 PM. Confirmed HMO accreditation (Maxicare).",
    },
    {
      id: "call-2",
      caller: "Juan Dela Cruz",
      phone: "+63 918 223 9910",
      intent: "Toothache Emergency",
      duration: "2m 10s",
      booked: true,
      time: "32 mins ago",
      summary: "Severe pain in lower molar. Scheduled emergency extraction slot with Doc at 5:00 PM today.",
    },
    {
      id: "call-3",
      caller: "Grace Tan",
      phone: "+63 920 882 1144",
      intent: "Braces Adjustment Inquiry",
      duration: "1m 15s",
      booked: false,
      time: "1 hr ago",
      summary: "Inquired about monthly adjustment fees. Advised to bring panoramic X-ray.",
    },
    {
      id: "call-4",
      caller: "Atty. Rafael Ramos",
      phone: "+63 917 441 0021",
      intent: "Dental Teeth Whitening",
      duration: "1m 50s",
      booked: true,
      time: "2 hrs ago",
      summary: "Booked laser teeth whitening promo for Saturday 11:00 AM. Sent SMS confirmation.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlipText
              className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950"
              duration={1.8}
            >
              Clinic Overview
            </FlipText>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time performance metrics for <span className="text-zinc-900 font-semibold">Smiles Dental Clinic - BGC</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/calls"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 flex items-center gap-2 interactive-press transition-colors shadow-2xs"
          >
            <PhoneIncoming className="w-3.5 h-3.5 text-zinc-500" />
            <span>View All Calls</span>
          </Link>
          <Link href="/dashboard/calendar">
            <CandyButton variant="black" className="py-2 px-3.5 text-xs font-semibold flex items-center gap-2 shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Open Calendar</span>
            </CandyButton>
          </Link>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:border-zinc-300 transition-all duration-200 hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-xs font-medium text-zinc-500 leading-snug">
                  {kpi.title}
                </span>
                <div
                  className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0 group-hover:scale-105 transition-transform duration-200 border border-zinc-200/60"
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-mono tracking-tight">
                  <StatsCounter
                    value={kpi.numericValue}
                    prefix={kpi.prefix}
                    suffix={kpi.suffix}
                    decimals={kpi.decimals}
                    duration={kpi.duration}
                    className="tabular-nums"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] font-mono font-semibold text-blue-600">
                    {kpi.change}
                  </span>
                  <span className="text-[10px] text-zinc-400">{kpi.period}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CALL TRAFFIC DISTRIBUTION CHART */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">Inbound Calls by Time of Day</h3>
            <p className="text-[11px] text-zinc-500">
              Notice high call volumes during lunch breaks (12-2 PM) and after 6 PM when clinic reception is closed.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            100% Handled Automatically
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-4 flex items-end gap-2 h-40">
          {[
            { hour: "8 AM", calls: 8, height: "25%" },
            { hour: "9 AM", calls: 18, height: "45%" },
            { hour: "10 AM", calls: 24, height: "60%" },
            { hour: "11 AM", calls: 38, height: "85%" },
            { hour: "12 PM", calls: 46, height: "100%", peak: true },
            { hour: "1 PM", calls: 42, height: "92%", peak: true },
            { hour: "2 PM", calls: 30, height: "70%" },
            { hour: "3 PM", calls: 22, height: "55%" },
            { hour: "4 PM", calls: 26, height: "65%" },
            { hour: "5 PM", calls: 32, height: "75%" },
            { hour: "6 PM", calls: 36, height: "82%", afterHours: true },
            { hour: "7 PM", calls: 28, height: "68%", afterHours: true },
            { hour: "8 PM", calls: 14, height: "35%", afterHours: true },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[9px] font-mono text-zinc-400 group-hover:text-zinc-950 transition-colors">
                {bar.calls}
              </span>
              <div
                style={{ height: bar.height }}
                className={`w-full rounded-t-md transition-all ${
                  bar.peak
                    ? "bg-blue-600 shadow-xs"
                    : bar.afterHours
                    ? "bg-indigo-500"
                    : "bg-zinc-200 hover:bg-zinc-300"
                }`}
              />
              <span className="text-[9px] text-zinc-400 font-mono rotate-45 sm:rotate-0 mt-1">
                {bar.hour}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-5 text-[11px] pt-3 text-zinc-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span>Lunch Peak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
            <span>After-Hours Evening Calls (Recovered)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-200" />
            <span>Standard Hours</span>
          </div>
        </div>
      </div>

      {/* RECENT CALL LOGS FEED */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-950">Recent Inbound Calls & Bookings</h3>
          <Link
            href="/dashboard/calls"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <span>View transcripts & recordings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-zinc-100">
          {recentCalls.map((call) => (
            <div
              key={call.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/80 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-zinc-900">{call.caller}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{call.phone}</span>
                  {call.booked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Booked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-mono">
                      Inquiry
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600">{call.summary}</p>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end gap-1.5 text-[10px] text-zinc-400 font-mono shrink-0">
                <span>{call.time}</span>
                <span>Duration: {call.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
