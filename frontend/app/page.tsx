"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { LivePhoneDemo } from "@/components/marketing/live-phone-demo";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { Pricing } from "@/components/marketing/pricing";
import { FaqSection } from "@/components/marketing/faq";
import { MarketingFooter } from "@/components/marketing/footer";
import { CandyButton } from "@/components/ui/candy-button";
import { ClinicBentoGrid } from "@/components/marketing/clinic-bento-grid";
import { ScrollReveal, Scroll3DPerspective } from "@/components/ui/scroll-reveal";

// Strong ease-out (Emil Kowalski standard)
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// ── Parallax Hero Section ────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Fade out hero headline and CTA text smoothly as user scrolls down towards the demo
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -32]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative pt-32 pb-16 px-4 sm:px-6 border-b border-zinc-200/70 overflow-hidden bg-[#f8f8f9]"
    >
      <motion.div
        style={{ opacity: heroTextOpacity, y: heroTextY }}
        className="max-w-3xl mx-auto text-center space-y-5 pt-4 will-change-transform"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200/80 text-zinc-600 text-xs font-medium shadow-2xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>AI Phone Receptionist for Philippine Businesses</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, transform: "translateY(18px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.45, delay: 0.05, ease: EASE_OUT }}
          className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.1] max-w-2xl mx-auto"
        >
          Never lose a customer to a{" "}
          <span className="text-blue-600">missed call</span>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, transform: "translateY(14px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.45, delay: 0.12, ease: EASE_OUT }}
          className="text-base text-zinc-600 max-w-lg mx-auto leading-relaxed"
        >
          Answers 24/7 in fluent Taglish, qualifies customer inquiries, and books appointments directly into your Google Calendar.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(14px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.45, delay: 0.18, ease: EASE_OUT }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link href="/signup">
            <CandyButton variant="black" className="w-full sm:w-auto px-7 py-3 text-xs font-semibold flex items-center justify-center gap-2">
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </CandyButton>
          </Link>
          <a
            href="#live-demo"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("live-demo");
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 88;
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 text-xs font-medium flex items-center justify-center gap-2 shadow-2xs transition-all duration-150 interactive-press cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Hear Demo</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Live Demo — Scroll-driven 3D perspective lift */}
      <div id="live-demo" className="pt-12">
        <Scroll3DPerspective rotateXStart={8} scaleStart={0.94} translateYStart={30}>
          <LivePhoneDemo />
        </Scroll3DPerspective>
      </div>
    </section>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f9] text-zinc-900 selection:bg-zinc-900 selection:text-white overflow-x-hidden">
      <MarketingNavbar />

      {/* ── HERO with parallax ─────────────────────────────────────── */}
      <HeroSection />

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section id="features" className="py-20 border-b border-zinc-200/70 bg-[#f8f8f9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Section header — smooth transform reveal */}
          <ScrollReveal className="text-center max-w-lg mx-auto space-y-1.5 mb-12">
            <span className="text-xs uppercase tracking-widest text-blue-600 font-mono font-semibold">
              Features
            </span>
            <h2 className="text-3xl font-bold text-zinc-950 tracking-tight">
              Engineered for modern business workflows
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm">
              Taglish voice synthesis, lead qualification, and calendar sync.
            </p>
          </ScrollReveal>

          {/* 3 Minimal Cards */}
          <ScrollReveal distance={28} duration={0.5}>
            <ClinicBentoGrid />
          </ScrollReveal>

          {/* Clean Typographic Metrics Strip (No nested card clutter) */}
          <ScrollReveal distance={24} duration={0.5}>
            <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-around gap-6 pt-12 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-zinc-950">99.4%</div>
                <p className="text-xs text-zinc-500 mt-0.5">Call Intent Accuracy</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-zinc-200" />
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-zinc-950">₱42k/mo</div>
                <p className="text-xs text-zinc-500 mt-0.5">Avg. Recovered Revenue</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-zinc-200" />
              <div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-zinc-950">1.2s</div>
                <p className="text-xs text-zinc-500 mt-0.5">Response Latency</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── ROI CALCULATOR ─────────────────────────────────────────── */}
      <section id="roi-calculator" className="py-16 border-b border-zinc-200/70 bg-[#f8f8f9]">
        <ScrollReveal distance={28} duration={0.5}>
          <RoiCalculator />
        </ScrollReveal>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 border-b border-zinc-200/70 bg-[#f8f8f9]">
        <ScrollReveal distance={28} duration={0.5}>
          <Pricing />
        </ScrollReveal>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 border-b border-zinc-200/70 bg-[#f8f8f9]">
        <ScrollReveal distance={28} duration={0.5}>
          <FaqSection />
        </ScrollReveal>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center bg-[#f8f8f9]">
        <ScrollReveal distance={24} duration={0.5}>
          <div className="max-w-xl mx-auto space-y-3.5">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
              Ready to answer every customer call?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Set up in 5 minutes. Connect your Google Calendar and start taking calls 24/7.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="/signup">
                <CandyButton variant="black" className="px-7 py-3 text-xs font-semibold flex items-center gap-2">
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </CandyButton>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <MarketingFooter />
    </div>
  );
}
