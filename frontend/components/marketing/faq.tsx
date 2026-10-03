"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Do I need to change my business phone number?",
    a: "No. You keep your existing landline or mobile. Simply enable conditional call forwarding with Globe, Smart, DITO, or PLDT.",
  },
  {
    q: "How does it prevent double bookings?",
    a: "SagotBot checks your connected Google Calendar in real time and automatically applies scheduling buffers between confirmed slots.",
  },
  {
    q: "Can it answer our custom business questions and pricing?",
    a: "Yes. You can customize your knowledge base with your exact services, rates, branch locations, operating hours, and booking guidelines.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All plans are month-to-month with zero setup fees or long-term contracts.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4" id="faq">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-blue-600 font-mono font-semibold">
          FAQ
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mt-1">
          Frequently asked questions
        </h3>
      </div>

      <div className="space-y-2.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <ScrollReveal key={idx} delay={idx * 0.05} amount={0.05}>
              <div className="rounded-xl border border-zinc-200/80 bg-white overflow-hidden transition-all duration-200 hover:border-zinc-300 shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-3.5 px-5 text-left flex items-center justify-between gap-4 interactive-press cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-zinc-900">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="text-zinc-400 shrink-0"
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
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100">
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

export default FaqSection;
