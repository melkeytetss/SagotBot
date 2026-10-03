"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, PhoneCall, Clock } from "lucide-react";
import { formatPHP } from "@/lib/utils";

export function RoiCalculator() {
  const [weeklyCalls, setWeeklyCalls] = useState(50);
  const [avgTicket, setAvgTicket] = useState(1800);
  const [missedRate, setMissedRate] = useState(28);

  // Calculations
  const monthlyCalls = weeklyCalls * 4.2;
  const missedCallsMonthly = Math.round(monthlyCalls * (missedRate / 100));
  const convertedAppointments = Math.round(missedCallsMonthly * 0.55);
  const monthlyRevenueRecovered = convertedAppointments * avgTicket;
  const hoursSavedMonthly = Math.round(monthlyCalls * 0.08);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs uppercase tracking-widest text-blue-600 font-mono font-semibold">
            Calculator
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mt-1">
            Estimate recovered business revenue
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            See how much missed calls cost your business each month.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-5">
            {/* Weekly Calls */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                <span className="text-zinc-700">Weekly Customer Calls</span>
                <span className="font-mono text-zinc-950 font-semibold text-xs">
                  {weeklyCalls} calls/wk
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={weeklyCalls}
                onChange={(e) => setWeeklyCalls(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-950"
              />
            </div>

            {/* Average Ticket / Booking Value */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                <span className="text-zinc-700">Avg. Booking / Ticket Value</span>
                <span className="font-mono text-zinc-950 font-semibold text-xs">
                  {formatPHP(avgTicket)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-950"
              />
            </div>

            {/* Missed Call Rate */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                <span className="text-zinc-700">Estimated Missed Calls</span>
                <span className="font-mono text-zinc-950 font-semibold text-xs">
                  {missedRate}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="2"
                value={missedRate}
                onChange={(e) => setMissedRate(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-950"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-blue-600 font-mono font-semibold">
                Recoverable Revenue
              </span>
              <div className="text-3xl font-bold text-zinc-950 tracking-tight mt-0.5 font-mono">
                {formatPHP(monthlyRevenueRecovered)}
                <span className="text-xs font-normal text-zinc-500 block font-sans">
                  per month
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-zinc-200/80 text-left">
              <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-xs">
                <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
                  <PhoneCall className="w-3 h-3 text-blue-600" />
                  <span>Bookings</span>
                </div>
                <p className="text-base font-bold text-zinc-950 font-mono mt-0.5">
                  +{convertedAppointments}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-xs">
                <div className="flex items-center gap-1 text-zinc-400 text-[10px]">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>Hours Saved</span>
                </div>
                <p className="text-base font-bold text-zinc-950 font-mono mt-0.5">
                  +{hoursSavedMonthly} hrs
                </p>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/signup"
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors interactive-press cursor-pointer"
              >
                <span>Start Free Trial</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoiCalculator;
