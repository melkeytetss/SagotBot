"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: "Starter",
      desc: "For solo operators, freelancers & boutique studios.",
      monthlyPrice: 3999,
      annualPrice: 3199,
      popular: false,
      features: [
        "100 AI voice minutes/mo",
        "Taglish voice engine",
        "Google Calendar booking",
        "Instant SMS confirmation",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Pro",
      desc: "For growing businesses, multi-staff teams & service providers.",
      monthlyPrice: 7999,
      annualPrice: 6399,
      popular: true,
      features: [
        "350 AI voice minutes/mo",
        "Multi-staff calendar sync",
        "Custom FAQs & lead qualification",
        "Call recordings & transcripts",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Enterprise",
      desc: "For multi-branch chains, franchises & high-volume organizations.",
      monthlyPrice: 15999,
      annualPrice: 12799,
      popular: false,
      features: [
        "1,000 AI voice minutes/mo",
        "Multi-branch tenant routing",
        "Dedicated PBX / SIP trunk",
        "Custom brand voice persona",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4" id="pricing">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-blue-600 font-mono font-semibold">
          Pricing
        </span>
        <h3 className="text-3xl font-bold text-zinc-950 tracking-tight mt-1">
          Simple, transparent plans
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 mt-1.5">
          14-day free trial. No credit card required.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-xs font-medium ${!annual ? "text-zinc-950 font-semibold" : "text-zinc-500"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="w-11 h-6 rounded-full bg-zinc-200 p-0.5 relative transition-colors cursor-pointer interactive-press"
          >
            <motion.div
              animate={{ x: annual ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-5 h-5 rounded-full bg-zinc-900 shadow-xs"
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-medium ${annual ? "text-zinc-950 font-semibold" : "text-zinc-500"}`}>
              Annual
            </span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-mono">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {tiers.map((tier, i) => {
          const price = annual ? tier.annualPrice : tier.monthlyPrice;
          return (
            <ScrollReveal key={tier.name} delay={i * 0.08} amount={0.05}>
              <div
                className={`relative flex flex-col justify-between h-full p-6 rounded-2xl transition-all duration-200 ${
                  tier.popular
                    ? "bg-white border-2 border-zinc-950 shadow-sm"
                    : "bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-2xs"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-zinc-950 text-white font-medium text-[10px] tracking-wide uppercase">
                    Popular
                  </div>
                )}

                <div>
                  <h4 className="text-base font-bold text-zinc-950">{tier.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1 min-h-[32px]">{tier.desc}</p>

                  <div className="my-4 pb-4 border-b border-zinc-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-zinc-950 font-mono">
                        ₱{price.toLocaleString("en-US")}
                      </span>
                      <span className="text-xs text-zinc-500">/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-zinc-600 mb-6">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/signup"
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center transition-all duration-150 interactive-press cursor-pointer flex items-center justify-center gap-1.5 ${
                    tier.popular
                      ? "bg-zinc-950 hover:bg-zinc-800 text-white"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200/80"
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}

export default Pricing;
