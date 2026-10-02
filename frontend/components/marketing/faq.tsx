"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Do I need to replace my existing clinic landline or mobile number?",
    a: "Hindi po! You can keep your existing clinic phone number. You simply turn on standard call forwarding (via Globe, Smart, or PLDT) so unanswered calls or after-hours calls forward seamlessly to your dedicated SagotBot AI number.",
  },
  {
    q: "How does SagotBot avoid double-booking patients on Google Calendar?",
    a: "SagotBot checks your connected Google Calendar in real-time before proposing any appointment slot to the caller. It automatically factors in buffer times between procedures (e.g. 45 mins for cleaning, 90 mins for root canal) so schedules never overlap.",
  },
  {
    q: "Can SagotBot answer questions about Philippine HMOs like Maxicare, Intellicare, or Medicard?",
    a: "Opo! You can configure your accredited HMOs in the dashboard knowledge base. When callers ask about their insurance, SagotBot explains your clinic's requirements (e.g., bringing physical cards and LOA approval) and guides them to book an accredited time slot.",
  },
  {
    q: "What happens if a caller has a dental or medical emergency?",
    a: "SagotBot is programmed with safety triage rules. If a patient mentions severe trauma, bleeding, or excruciating pain, SagotBot immediately provides emergency instructions and can automatically forward the live call directly to the on-call doctor's private mobile phone.",
  },
  {
    q: "Is there a contract or can I cancel anytime?",
    a: "Walang contract! All plans are billed month-to-month. You can upgrade, downgrade, or cancel anytime with one click directly inside your clinic settings.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-4" id="faq">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Everything you need to know about SagotBot
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Got a question? We have answers. If you need custom enterprise setup, our BGC team is ready to assist.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <ScrollReveal key={idx} delay={idx * 0.06} amount={0.05}>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden transition-colors duration-200 hover:border-white/20">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 interactive-press cursor-pointer"
                >
                  <span className="text-sm font-semibold text-slate-200">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="text-slate-400 shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
