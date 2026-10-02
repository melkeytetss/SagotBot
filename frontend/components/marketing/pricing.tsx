"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: "Starter Clinic",
      desc: "Ideal for solo dental practitioners and boutique aesthetic studios.",
      monthlyPrice: 3999,
      annualPrice: 3199,
      minutes: "100 AI voice minutes/mo",
      popular: false,
      features: [
        "100 AI phone receptionist minutes",
        "Taglish & English NLP voice engine",
        "1 Google Calendar sync",
        "Instant SMS confirmation to callers",
        "Basic call summaries & transcripts",
        "Standard email support",
      ],
      cta: "Start 14-Day Trial",
      href: "/signup",
    },
    {
      name: "Pro Clinic",
      desc: "For busy clinics with high call volume, multiple doctors, and HMO patients.",
      monthlyPrice: 7999,
      annualPrice: 6399,
      minutes: "350 AI voice minutes/mo",
      popular: true,
      features: [
        "350 AI phone receptionist minutes",
        "All Starter features included",
        "Multi-doctor & room calendar sync",
        "Real-time Google Sheet logging",
        "Philippine HMO qualification (Maxicare, etc.)",
        "Call recording playback & transcripts",
        "Priority WhatsApp & phone support",
      ],
      cta: "Launch Pro Trial",
      href: "/signup",
    },
    {
      name: "Multi-Branch Group",
      desc: "For dental hospital chains, medical groups, and franchised salons.",
      monthlyPrice: 15999,
      annualPrice: 12799,
      minutes: "1,000 AI voice minutes/mo",
      popular: false,
      features: [
        "1,000 AI phone receptionist minutes",
        "All Pro features included",
        "Multi-tenant branch management",
        "Dedicated PBX / SIP trunk forwarding",
        "Custom doctor voice & clinic persona",
        "Custom API & EHR integration support",
        "Dedicated account manager",
      ],
      cta: "Contact Enterprise",
      href: "/signup",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4" id="pricing">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simple, Predictable Plans</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Invest once. Recover dozens of lost patients every month.
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          One saved root canal or braces inquiry covers your entire monthly subscription.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-xs font-medium ${!annual ? "text-white" : "text-slate-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 rounded-full bg-slate-800 p-0.5 relative transition-colors cursor-pointer interactive-press"
          >
            <motion.div
              animate={{ x: annual ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-5 h-5 rounded-full bg-emerald-400 shadow-md"
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-medium ${annual ? "text-white" : "text-slate-400"}`}>
              Yearly
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {tiers.map((tier, i) => {
          const price = annual ? tier.annualPrice : tier.monthlyPrice;
          return (
            <ScrollReveal key={tier.name} delay={i * 0.1} amount={0.05}>
              <div
                className={`relative flex flex-col justify-between h-full p-7 rounded-3xl cursor-pointer hover-lift ${
                  tier.popular
                    ? "bg-gradient-to-b from-[#181b29] to-[#0e101a] border-2 border-emerald-500/60 shadow-2xl shadow-emerald-500/15 z-10"
                    : "bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 hover-glow shadow-lg transition-colors duration-200"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wide uppercase shadow-lg shadow-emerald-500/30">
                    Most Popular for Clinics
                  </div>
                )}

                <div>
                  <h4 className="text-lg font-bold text-white">{tier.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{tier.desc}</p>

                  <div className="my-5 pb-5 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-mono">
                        ₱{price.toLocaleString("en-US")}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
                      {tier.minutes}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-slate-300">Included features:</p>
                    {tier.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href={tier.href}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 interactive-press transition-colors duration-150 ${
                      tier.popular
                        ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25"
                        : "bg-white/10 hover:bg-white/15 text-white"
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
