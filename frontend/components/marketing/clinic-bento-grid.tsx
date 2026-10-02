"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  CalendarCheck,
  ShieldCheck,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  badge?: string;
}

function ClinicCard({ title, description, children, className = "", badge }: ClinicCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-5",
        "bg-[#0e111a]/90 border border-white/10 hover:border-emerald-500/30",
        "hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300",
        className
      )}
    >
      {/* Ambient hover glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

      <div className="z-10 relative">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-white text-sm sm:text-base tracking-tight">{title}</h3>
          {badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
        <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
      </div>

      <div className="relative mt-4 flex-1 w-full rounded-xl overflow-hidden border border-white/5 bg-[#090b12]/90 p-3.5 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}

export function ClinicBentoGrid({ className = "" }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto", className)}>
      {/* 1. Taglish Voice AI Engine */}
      <ClinicCard
        title="Taglish Voice Engine"
        badge="380ms Latency"
        description="Understands colloquial Philippine Taglish, dental terms ('pasta', 'bunot', 'linis'), and polite 'po/opo' nuances without awkward pauses."
        className="lg:col-span-1 min-h-[300px]"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Taglish Parser
            </span>
            <span className="text-slate-500 text-[10px]">Caller Audio</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-slate-300">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-mono">Caller:</span>
            &ldquo;Doc, magkano po ba ang bunot at cleaning kapag may Maxicare card?&rdquo;
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[9px] text-emerald-400 block font-mono">Intent</span>
              <span className="font-semibold text-white">Extraction + Cleaning</span>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <span className="text-[9px] text-purple-300 block font-mono">HMO Match</span>
              <span className="font-semibold text-white">Maxicare Accredited</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-200">
            <span className="text-[9px] font-mono text-emerald-400 block">AI Spoken Reply:</span>
            &ldquo;Opo! Accredited po ang Smiles Dental sa Maxicare. Available po si Doc bukas ng 2 PM.&rdquo;
          </div>
        </div>
      </ClinicCard>

      {/* 2. Automated HMO & Insurance Verification */}
      <ClinicCard
        title="HMO Accreditation Check"
        badge="Zero Confusion"
        description="Instantly checks coverage for major Philippine HMOs and reminds patients about physical cards and approval requirements."
        className="lg:col-span-1 min-h-[300px]"
      >
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pb-1 border-b border-white/5">
            <span>Supported Providers</span>
            <span className="text-emerald-400">Live Verification</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-200 font-medium">Maxicare</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-200 font-medium">Medicard</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-200 font-medium">Intellicare</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <span className="text-slate-200 font-medium">PhilCare</span>
              <span className="text-[9px] text-amber-400 font-mono">LOA Req.</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[11px] font-bold text-emerald-300 block">
              100% Policy Transparency
            </span>
            <span className="text-[10px] text-slate-400">
              Eliminates front-desk disputes at patient check-in
            </span>
          </div>
        </div>
      </ClinicCard>

      {/* 3. 24/7 After-Hours Revenue Recovery */}
      <ClinicCard
        title="24/7 Revenue Recovery"
        badge="₱42k+ Mo. Recovered"
        description="Captures evening and weekend calls when your staff is off-duty, securing patient appointments before they call competing clinics."
        className="lg:col-span-1 min-h-[300px]"
      >
        <div className="space-y-2">
          <div className="p-2 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Clinic Front Desk</span>
            <span className="text-[10px] text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              Closed (6:00 PM)
            </span>
          </div>

          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px]">
            <span className="text-emerald-300 font-medium">SagotBot Receptionist</span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/15 px-2 py-0.5 rounded-full">
              Answering Active
            </span>
          </div>

          <div className="space-y-1.5 pt-1 text-[10px] text-slate-400 font-mono">
            <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex justify-between">
              <span>8:45 PM • Braces Inquiry</span>
              <span className="text-emerald-400">Booked ✓</span>
            </div>
            <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex justify-between">
              <span>10:12 PM • Toothache Emergency</span>
              <span className="text-emerald-400">Booked ✓</span>
            </div>
          </div>
        </div>
      </ClinicCard>

      {/* 4. Real-Time Google Calendar & Chair Buffer Sync */}
      <ClinicCard
        title="Calendar & Chair Buffers"
        badge="Zero Double-Bookings"
        description="Directly checks doctor availability and individual chair buffers in real time, locking appointments without staff intervention."
        className="lg:col-span-2 min-h-[260px]"
      >
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Dr. Reyes, DMD • Chair 1</span>
              <span className="text-[10px] text-slate-500 font-mono">Smiles Dental BGC</span>
            </div>
            <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Google Calendar Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
              <span className="text-[10px] text-slate-500 font-mono block">1:00 PM - 2:00 PM</span>
              <span className="text-rose-400 font-medium">Root Canal (Occupied)</span>
            </div>

            <motion.div
              animate={{ borderColor: ["rgba(16, 185, 129, 0.4)", "rgba(16, 185, 129, 0.8)", "rgba(16, 185, 129, 0.4)"] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/50 shadow-lg shadow-emerald-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-300 font-mono">2:00 PM - 2:45 PM</span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Locked</span>
              </div>
              <span className="text-white font-bold block mt-0.5">Maria Santos • Cleaning</span>
            </motion.div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
              <span className="text-[10px] text-slate-500 font-mono block">3:00 PM - 4:00 PM</span>
              <span className="text-slate-400">Available Slot</span>
            </div>
          </div>
        </div>
      </ClinicCard>

      {/* 5. Instant Multi-Channel Dispatch */}
      <ClinicCard
        title="SMS & Viber Confirmations"
        badge="Instant Sync"
        description="Sends immediate appointment confirmation messages to the patient's phone and automatically appends records to your clinic Google Sheet."
        className="lg:col-span-1 min-h-[260px]"
      >
        <div className="space-y-2">
          {/* SMS Notification Banner */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold text-white flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                SMS • SmilesDental
              </span>
              <span>Just now</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              Hello Maria! Confirmed po ang cleaning schedule niyo kay Dr. Reyes sa BGC branch.
            </p>
          </div>

          {/* Google Sheet Live Row */}
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] flex items-center justify-between font-mono text-emerald-300">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Sheet Row #142 Appended
            </span>
            <span className="text-emerald-400 font-bold">₱1,500 Booked</span>
          </div>
        </div>
      </ClinicCard>
    </div>
  );
}

export default ClinicBentoGrid;
