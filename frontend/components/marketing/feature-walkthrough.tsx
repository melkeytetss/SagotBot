"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Calendar, FileSpreadsheet, Check, Sparkles, ArrowRight } from "lucide-react";

interface FeatureStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  interactivePreview: React.ReactNode;
}

export function FeatureWalkthrough() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: FeatureStep[] = [
    {
      id: "nlp",
      badge: "Chapter 01 • Natural Language Understanding",
      title: "Understands Filipino clinic callers without awkward pauses.",
      description:
        "Patients don't speak textbook English or pure Tagalog. They speak Taglish with nuances like 'po/opo', dental slang ('pasta', 'bunot', 'linis'), and HMO card terms. SagotBot grasps the exact intent instantly.",
      interactivePreview: (
        <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="font-mono text-emerald-400">Taglish Semantic Parsing</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
              Latency: 420ms
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-xs text-slate-300">
              <span className="text-[10px] text-slate-500 font-mono block mb-1">Raw Caller Speech:</span>
              &ldquo;Doc, magkano po ba ang bunot at cleaning kapag may Maxicare card?&rdquo;
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 font-mono block">Detected Intents:</span>
                <span className="font-bold text-white">Extraction + Cleaning</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30">
                <span className="text-[10px] text-purple-400 font-mono block">HMO Identified:</span>
                <span className="font-bold text-white">Maxicare (Accredited)</span>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-xs text-emerald-200"
            >
              <span className="text-[10px] font-mono text-emerald-400 block mb-0.5">Spoken AI Reply:</span>
              &ldquo;Opo! Accredited po ang Smiles Dental sa Maxicare. Libre po ang annual cleaning under your plan. Gusto niyo po ba ng appointment bukas?&rdquo;
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      id: "calendar",
      badge: "Chapter 02 • Real-Time Doctor Scheduling",
      title: "Locks appointments straight into Google Calendar with zero double bookings.",
      description:
        "SagotBot checks your doctors' active schedules in real time. It respects individual chair buffers, procedure durations, and lunch breaks before proposing available slots to the caller.",
      interactivePreview: (
        <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="font-mono text-emerald-400">Google Calendar Real-Time API</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
              Status: Synced
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-200">Dr. Reyes, DMD • Chair 1</p>
                <p className="text-[11px] text-slate-400">Friday, Oct 3</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">BGC Clinic</span>
            </div>

            <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/40">
              <div className="p-2 rounded-lg bg-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                <span>1:00 PM - 2:00 PM</span>
                <span className="text-rose-400">Occupied (Root Canal)</span>
              </div>

              {/* Animated Target Booking Slot */}
              <motion.div
                initial={{ scale: 0.95, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                animate={{ scale: [1, 1.02, 1], backgroundColor: "rgba(16, 185, 129, 0.25)" }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="p-2.5 rounded-xl border border-emerald-500 text-[11px] text-emerald-300 font-bold flex justify-between items-center"
              >
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>2:00 PM - 2:45 PM: Reserved for Maria Clara</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">Locked</span>
              </motion.div>

              <div className="p-2 rounded-lg bg-slate-800/80 text-[11px] text-slate-400 flex justify-between">
                <span>3:00 PM - 4:00 PM</span>
                <span className="text-slate-500">Available</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sync",
      badge: "Chapter 03 • Automated SMS & Google Sheets",
      title: "Keeps clinic staff in sync without manual data entry.",
      description:
        "Every completed booking immediately sends an SMS confirmation to the patient's phone and logs caller details, procedures, and intent into your clinic Google Sheet for reporting.",
      interactivePreview: (
        <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="font-mono text-emerald-400">Automated Patient Push</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
              Delivered
            </span>
          </div>

          {/* SMS Notification Banner */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1.5 shadow-xl"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold text-white">SMS • SmilesDental</span>
              <span>Just now</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Hello Maria Clara! Confirmed ang appointment mo with Dr. Reyes on Friday, 2:00 PM (Teeth Cleaning). See you at BGC High Street Plaza!
            </p>
          </motion.div>

          {/* Google Sheet Live Row */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheet Row #142 Appended</span>
            </div>
            <div className="grid grid-cols-3 gap-1 font-mono text-[10px] text-slate-300">
              <span className="p-1 bg-black/40 rounded">Maria Clara</span>
              <span className="p-1 bg-black/40 rounded">+639175550192</span>
              <span className="p-1 bg-black/40 rounded text-emerald-400">₱1,500 Booked</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-20 px-4" id="features">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Telephony Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How SagotBot turns phone calls into confirmed clinic revenue.
        </h2>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed">
          From the instant the phone rings to the moment the calendar event is created, everything happens in seconds.
        </p>
      </div>

      {/* Interactive Feature Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Step Selector Tabs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <motion.div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                whileHover={{ x: 6 }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 border-emerald-500/50 shadow-2xl shadow-emerald-500/10"
                    : "bg-slate-900/40 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                  {step.badge}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Interactive Preview Canvas (7 Cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -15 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-lg"
            >
              {steps[activeStep].interactivePreview}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
