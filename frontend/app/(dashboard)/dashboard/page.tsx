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
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
              duration={1.8}
            >
              Clinic Overview
            </FlipText>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance metrics for <span className="text-emerald-400 font-semibold">Smiles Dental Clinic - BGC</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/calls"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 interactive-press hover:border-emerald-500/30 transition-colors"
          >
            <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />
            <span>View All Calls</span>
          </Link>
          <Link href="/dashboard/calendar">
            <CandyButton className="py-2.5 px-4 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20">
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
              className="p-5 rounded-2xl bg-slate-900/90 border border-white/5 hover:border-emerald-500/30 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-xs font-semibold text-slate-300 leading-snug">
                  {kpi.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.accent} shrink-0 group-hover:scale-110 transition-transform duration-200 border border-white/5`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
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
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    {kpi.change}
                  </span>
                  <span className="text-[10px] text-slate-500">{kpi.period}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CALL TRAFFIC DISTRIBUTION CHART */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Inbound Calls by Time of Day</h3>
            <p className="text-[11px] text-slate-400">
              Notice high call volumes during lunch breaks (12-2 PM) and after 6 PM when clinic reception is closed.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
              <span className="text-[9px] font-mono text-slate-500 group-hover:text-emerald-400 transition-colors">
                {bar.calls}
              </span>
              <div
                style={{ height: bar.height }}
                className={`w-full rounded-t-md transition-all group-hover:brightness-125 ${
                  bar.peak
                    ? "bg-emerald-400 shadow-md shadow-emerald-500/20"
                    : bar.afterHours
                    ? "bg-purple-500"
                    : "bg-slate-700"
                }`}
              />
              <span className="text-[9px] text-slate-500 font-mono rotate-45 sm:rotate-0 mt-1">
                {bar.hour}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-5 text-[11px] pt-3 text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span>Lunch Peak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
            <span>After-Hours Evening Calls (Recovered)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
            <span>Standard Hours</span>
          </div>
        </div>
      </div>

      {/* RECENT CALL LOGS FEED */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Inbound Calls & Bookings</h3>
          <Link
            href="/dashboard/calls"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>View transcripts & recordings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {recentCalls.map((call) => (
            <div
              key={call.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white">{call.caller}</span>
                  <span className="text-[10px] font-mono text-slate-400">{call.phone}</span>
                  {call.booked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Booked
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                      Inquiry
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">{call.summary}</p>
              </div>

              <div className="flex items-center sm:flex-col sm:items-end gap-2 text-[10px] text-slate-500 font-mono shrink-0">
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
