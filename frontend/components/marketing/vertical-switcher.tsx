"use client";

import React, { useState } from "react";
import { Sparkles, Stethoscope, Scissors, UtensilsCrossed, CheckCircle2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VerticalData {
  id: "dental" | "salon" | "restaurant";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  commonQuestions: string[];
  sampleDialogue: {
    caller: string;
    bot: string;
  };
  features: string[];
}

const VERTICALS: VerticalData[] = [
  {
    id: "dental",
    name: "Dental Clinics",
    icon: Stethoscope,
    tagline: "Handle toothache emergencies, teeth cleaning bookings, and HMO coverage checks.",
    commonQuestions: [
      "Tumatanggap po ba kayo ng Maxicare or Intellicare?",
      "Magkano po bunot ng wisdom tooth kay Doc?",
      "Pwedeng magpa-reschedule ng adjustment ng braces ko?",
    ],
    sampleDialogue: {
      caller: "Hi, accredited po ba kayo sa Medicard for tooth extraction?",
      bot: "Opo! Accredited po ang Smiles Dental sa Medicard at Maxicare. Dalhin lang po ang inyong HMO card at valid ID. Gusto niyo po ba magpa-schedule kay Doc bukas ng 3:00 PM?",
    },
    features: [
      "HMO & Insurance verification guidance",
      "Chair-time and procedure length buffer management",
      "Automated appointment reminders to prevent clinic no-shows",
    ],
  },
  {
    id: "salon",
    name: "Aesthetic Salons & Spas",
    icon: Scissors,
    tagline: "Coordinate stylist calendars, facial appointments, and hair treatment consultations.",
    commonQuestions: [
      "Available po ba si Sir Mark for hair color on Saturday?",
      "Gaano po katagal ang Brazilian blowout procedure?",
      "Pwede po bang mag-walk in today para sa eyelash extension?",
    ],
    sampleDialogue: {
      caller: "Hello sis, may slot pa ba si Miss Anne for balayage this Saturday morning?",
      bot: "Good morning po! Check ko po ang calendar ni Miss Anne... Available po siya this Saturday at 10:30 AM! Ang treatment po takes around 3 hours. I-reserve ko na po ba sa pangalan niyo?",
    },
    features: [
      "Multi-stylist schedule separation",
      "Long-duration procedure buffer protection",
      "Pre-treatment preparation guidelines via SMS",
    ],
  },
  {
    id: "restaurant",
    name: "Restaurants & Dining",
    icon: UtensilsCrossed,
    tagline: "Lock in table reservations, private function room bookings, and corkage inquiries.",
    commonQuestions: [
      "May table for 8 po ba kayo tonight at 7:30 PM?",
      "Magkano po ang corkage fee for wine and outside cake?",
      "Pet-friendly po ba ang al fresco area niyo?",
    ],
    sampleDialogue: {
      caller: "Good afternoon, reservation sana for 6 pax tonight dinner around 8:00 PM.",
      bot: "Magandang hapon po! Available po ang indoor main dining table for 6 tonight at 8:00 PM. May special dietary requests po ba or celebration? I-confirm ko na po under what name?",
    },
    features: [
      "Real-time table capacity threshold check",
      "Instant SMS reservation code for diners",
      "Direct catering & group inquiry notification to manager",
    ],
  },
];

export function VerticalSwitcher() {
  const [activeVertical, setActiveVertical] = useState<"dental" | "salon" | "restaurant">("dental");
  const selected = VERTICALS.find((v) => v.id === activeVertical)!;

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Trained for the exact nuances of Philippine SMEs
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          SagotBot understands clinic procedures, salon jargon, and restaurant table requirements right out of the box.
        </p>
      </div>

      {/* Tabs Switcher with Emil Kowalski spring indicators */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
          {VERTICALS.map((v) => {
            const Icon = v.icon;
            const isActive = activeVertical === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVertical(v.id)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors interactive-press cursor-pointer ${
                  isActive ? "text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="vertical-active-pill"
                    className="absolute inset-0 bg-emerald-400 rounded-xl shadow-lg shadow-emerald-500/25 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                <span>{v.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Card with Smooth AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-white/10 shadow-xl"
        >
          {/* Left: Tagline & Features */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                Tailored Philippine Vertical
              </span>
              <h4 className="text-xl font-bold text-white mt-1">{selected.tagline}</h4>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-300">Key Built-in Capabilities:</p>
              {selected.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                Frequently Handled Questions
              </p>
              <div className="space-y-1.5">
                {selected.commonQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300"
                  >
                    &ldquo;{q}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Simulated Conversation */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-black/50 border border-white/5 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-semibold text-slate-300">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Real Taglish Conversation Example</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Caller */}
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-slate-500 font-mono mb-1">Inbound Caller</span>
                <div className="p-3 rounded-2xl rounded-tl-sm bg-slate-800 text-slate-200 max-w-[90%] leading-relaxed border border-white/5">
                  {selected.sampleDialogue.caller}
                </div>
              </div>

              {/* Bot */}
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-emerald-400 font-mono mb-1">SagotBot AI</span>
                <div className="p-3 rounded-2xl rounded-tr-sm bg-emerald-950/80 text-emerald-100 max-w-[90%] leading-relaxed border border-emerald-500/30">
                  {selected.sampleDialogue.bot}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                100% Autonomous • Auto-Synced to Google
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
