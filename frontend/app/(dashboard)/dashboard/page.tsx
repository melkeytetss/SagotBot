"use client";

import React from "react";
import Link from "next/link";
import {
  PhoneCall,
  CalendarCheck,
  TrendingUp,
  Clock,
  PhoneIncoming,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Bot,
} from "lucide-react";
import { StatsCounter } from "@/components/ui/stats-counter";
import { CandyButton } from "@/components/ui/candy-button";
import { PageHeader } from "@/components/dashboard/page-header";
import { useIndustry } from "@/context/industry-context";

export default function DashboardOverviewPage() {
  const { businessName, calls, appointments, services } = useIndustry();

  // Dynamic KPI computations
  const totalCalls = calls.length;
  const bookedAppointments = appointments.filter((a) => a.status === "confirmed").length;

  // Average service price for revenue calculation
  const avgServicePrice =
    services.length > 0
      ? services.reduce((acc, s) => acc + (s.price_min + s.price_max) / 2, 0) / services.length
      : 1500;

  const estimatedRevenue = Math.round(bookedAppointments * avgServicePrice);
  const conversionRate = totalCalls > 0 ? Math.round((bookedAppointments / totalCalls) * 100) : 0;
  const hoursSaved = (totalCalls * 0.25).toFixed(1);

  const kpis = [
    {
      title: "Inbound Calls Handled",
      numericValue: totalCalls,
      duration: 1.5,
      change: "100%",
      period: "answered in 1 ring",
      icon: PhoneCall,
    },
    {
      title: "Bookings Confirmed",
      numericValue: bookedAppointments,
      duration: 1.5,
      change: `${conversionRate}%`,
      period: "conversion rate",
      icon: CalendarCheck,
    },
    {
      title: "Estimated Revenue Booked",
      numericValue: estimatedRevenue,
      prefix: "₱",
      duration: 2.0,
      decimals: 0,
      change: `Avg ₱${Math.round(avgServicePrice).toLocaleString()}`,
      period: "per appointment",
      icon: TrendingUp,
    },
    {
      title: "Frontdesk Hours Saved",
      numericValue: Number(hoursSaved),
      suffix: " hrs",
      decimals: 1,
      duration: 1.8,
      change: "0 dropped",
      period: "calls handled",
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Business Overview"
        description={`Real-time telephony performance metrics for ${businessName}.`}
        action={
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/calls"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 flex items-center gap-2 interactive-press transition-colors shadow-2xs"
            >
              <PhoneIncoming className="w-3.5 h-3.5 text-zinc-500" />
              <span>View All Calls ({calls.length})</span>
            </Link>
            <Link href="/dashboard/calendar">
              <CandyButton variant="black" className="py-2 px-3.5 text-xs font-semibold flex items-center gap-2 shadow-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>Open Calendar ({appointments.length})</span>
              </CandyButton>
            </Link>
          </div>
        }
      />

      {/* KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs hover:border-zinc-300 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-xs font-medium text-zinc-500 leading-snug">
                  {kpi.title}
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0 border border-zinc-200/60">
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

      {/* CALL TRAFFIC DISTRIBUTION */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">Inbound Call Activity by Time of Day</h3>
            <p className="text-[11px] text-zinc-500">
              Peak call volume automatically answered without placing callers on hold.
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
            100% Handled
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="pt-4 flex items-end gap-2 h-40">
          {[
            { hour: "8 AM", calls: Math.max(1, Math.round(totalCalls * 0.05)), height: "25%" },
            { hour: "9 AM", calls: Math.max(2, Math.round(totalCalls * 0.1)), height: "45%" },
            { hour: "10 AM", calls: Math.max(3, Math.round(totalCalls * 0.15)), height: "60%" },
            { hour: "11 AM", calls: Math.max(4, Math.round(totalCalls * 0.2)), height: "85%" },
            { hour: "12 PM", calls: Math.max(5, Math.round(totalCalls * 0.25)), height: "100%", peak: true },
            { hour: "1 PM", calls: Math.max(4, Math.round(totalCalls * 0.22)), height: "92%", peak: true },
            { hour: "2 PM", calls: Math.max(3, Math.round(totalCalls * 0.16)), height: "70%" },
            { hour: "3 PM", calls: Math.max(2, Math.round(totalCalls * 0.12)), height: "55%" },
            { hour: "4 PM", calls: Math.max(3, Math.round(totalCalls * 0.14)), height: "65%" },
            { hour: "5 PM", calls: Math.max(4, Math.round(totalCalls * 0.18)), height: "75%" },
            { hour: "6 PM", calls: Math.max(3, Math.round(totalCalls * 0.15)), height: "82%", afterHours: true },
            { hour: "7 PM", calls: Math.max(2, Math.round(totalCalls * 0.1)), height: "68%", afterHours: true },
            { hour: "8 PM", calls: Math.max(1, Math.round(totalCalls * 0.05)), height: "35%", afterHours: true },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <span className="text-[9px] font-mono text-zinc-400 group-hover:text-zinc-950 transition-colors">
                {bar.calls}
              </span>
              <div
                style={{ height: bar.height }}
                className={`w-full rounded-t-md transition-all ${
                  bar.peak
                    ? "bg-zinc-950 shadow-xs"
                    : bar.afterHours
                    ? "bg-blue-600"
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
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-950" />
            <span>Peak Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span>After-Hours Recovered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-200" />
            <span>Regular Daytime</span>
          </div>
        </div>
      </div>

      {/* RECENT CALL LOGS FEED */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-950">Recent Inbound Calls</h3>
          <Link
            href="/dashboard/calls"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <span>View all transcripts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {calls.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400 space-y-2">
            <Bot className="w-7 h-7 mx-auto text-zinc-300" />
            <p className="font-medium text-zinc-600">No calls logged yet</p>
            <p className="text-[11px] text-zinc-400">
              Try the Call Simulator in Settings to generate your first test call transcript!
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/settings"
                className="inline-flex px-3 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-medium"
              >
                Open Simulator
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {calls.slice(0, 5).map((call) => (
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
        )}
      </div>
    </div>
  );
}
