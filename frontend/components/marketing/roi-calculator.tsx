"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, Sparkles, PhoneCall, Clock, CheckCircle } from "lucide-react";
import { formatPHP } from "@/lib/utils";

export function RoiCalculator() {
  const [weeklyCalls, setWeeklyCalls] = useState(50);
  const [avgTicket, setAvgTicket] = useState(1800);
  const [missedRate, setMissedRate] = useState(28);

  // Calculations
  const monthlyCalls = weeklyCalls * 4.2;
  const missedCallsMonthly = Math.round(monthlyCalls * (missedRate / 100));
  const convertedAppointments = Math.round(missedCallsMonthly * 0.55); // 55% booking rate
  const monthlyRevenueRecovered = convertedAppointments * avgTicket;
  const hoursSavedMonthly = Math.round(monthlyCalls * 0.08); // ~5 mins per call saved

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#12141f] to-[#0c0e17] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow behind stats */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Philippine Clinic Revenue Calculator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How much revenue is your clinic losing to missed calls?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            When patients call during lunch breaks, Sunday closures, or while reception is busy, 80% do not leave a voicemail—they call the clinic down the street.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SLIDERS (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Weekly Calls */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-2">
                <span className="text-slate-300">Weekly Inbound Phone Calls</span>
                <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {weeklyCalls} calls/week
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={weeklyCalls}
                onChange={(e) => setWeeklyCalls(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>10 calls</span>
                <span>125 calls</span>
                <span>250 calls</span>
              </div>
            </div>

            {/* Slider 2: Average Appointment Value */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-2">
                <span className="text-slate-300">Average Patient Value (PHP)</span>
                <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
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
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>₱500 (Basic)</span>
                <span>₱5,000 (Ortho/Veneer)</span>
                <span>₱10,000+</span>
              </div>
            </div>

            {/* Slider 3: Missed Call Rate */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-2">
                <span className="text-slate-300">Estimated Missed Calls Rate</span>
                <span className="font-mono text-amber-400 font-bold text-sm bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
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
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Industry average for clinics in Metro Manila & Cebu is 28-35% missed after 5:00 PM.
              </p>
            </div>
          </div>

          {/* RESULTS CARD (Right 5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-5 shadow-xl">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-semibold">
                Recovered Revenue Potential
              </span>
              <div className="text-4xl font-black text-white tracking-tight mt-1 font-mono text-emerald-300">
                {formatPHP(monthlyRevenueRecovered)}
                <span className="text-xs font-normal text-slate-400 block font-sans mt-0.5">
                  / month in saved bookings
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <PhoneCall className="w-3 h-3 text-emerald-400" />
                  <span>Bookings Saved</span>
                </div>
                <p className="text-lg font-bold text-white font-mono mt-1">
                  +{convertedAppointments}{" "}
                  <span className="text-[10px] font-normal text-slate-400">pts</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Staff Hours</span>
                </div>
                <p className="text-lg font-bold text-white font-mono mt-1">
                  +{hoursSavedMonthly}{" "}
                  <span className="text-[10px] font-normal text-slate-400">hrs</span>
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/signup"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 interactive-press cursor-pointer"
              >
                <span>Recover This Revenue Now</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
