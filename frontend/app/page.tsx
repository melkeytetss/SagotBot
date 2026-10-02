"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, CheckCircle, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { LivePhoneDemo } from "@/components/marketing/live-phone-demo";
import { RoiCalculator } from "@/components/marketing/roi-calculator";
import { Pricing } from "@/components/marketing/pricing";
import { FaqSection } from "@/components/marketing/faq";
import { MarketingFooter } from "@/components/marketing/footer";
import { CandyButton } from "@/components/ui/candy-button";
import { StatsCounter } from "@/components/ui/stats-counter";
import { AnimatedRays } from "@/components/ui/animated-rays";
import { ClinicBentoGrid } from "@/components/marketing/clinic-bento-grid";
import { ScrollReveal, Scroll3DPerspective, ScrollRevealGroup } from "@/components/ui/scroll-reveal";

// Strong ease-out (Emil Kowalski standard)
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

// ── Parallax Hero Section ────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // Ambient glow drifts up as user scrolls
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  // Fade out hero headline and CTA text smoothly as user scrolls down towards the demo
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.25], [0, -36]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative pt-32 pb-16 px-4 sm:px-6 hero-mesh border-b border-white/5 overflow-hidden"
    >
      {/* Animated background rays */}
      <div className="absolute inset-0 pointer-events-none opacity-20 -z-10 overflow-hidden">
        <AnimatedRays />
      </div>

      {/* Parallax ambient glow */}
      <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10"
      />

      <motion.div
        style={{ opacity: heroTextOpacity, y: heroTextY }}
        className="max-w-4xl mx-auto text-center space-y-6 pt-4 will-change-transform"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Phone Receptionist for Philippine Clinics</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, transform: "translateY(24px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.5, delay: 0.06, ease: EASE_OUT }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-3xl mx-auto"
        >
          Never lose a patient to a{" "}
          <span className="text-emerald-400">missed call</span>.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, transform: "translateY(18px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.48, delay: 0.14, ease: EASE_OUT }}
          className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          Answers 100% of clinic inquiries in fluent Taglish, qualifies HMO
          coverage, and books slots directly into your Google Calendar.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.48, delay: 0.22, ease: EASE_OUT }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link href="/signup">
            <CandyButton className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2">
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
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
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/10 hover:border-emerald-500/25 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white text-sm font-medium flex items-center justify-center gap-2 transition-all duration-250 interactive-press cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Hear Sample Call</span>
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero hardware setup</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Calendar sync</span>
          </span>
          <span className="text-slate-700">•</span>
          <span>Trusted by 40+ PH clinics</span>
        </motion.div>
      </motion.div>

      {/* Live Demo — Scroll-driven 3D perspective lift */}
      <div id="live-demo" className="pt-14">
        <Scroll3DPerspective rotateXStart={10} scaleStart={0.93} translateYStart={35}>
          <LivePhoneDemo />
        </Scroll3DPerspective>
      </div>
    </section>
  );
}

// ── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      <MarketingNavbar />

      {/* ── HERO with parallax ─────────────────────────────────────── */}
      <HeroSection />

      {/* ── FEATURES / BENTO GRID ──────────────────────────────────── */}
      <section id="features" className="py-20 border-b border-white/5 bg-[#090b12]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header — smooth transform reveal */}
          <ScrollReveal className="text-center max-w-xl mx-auto space-y-2.5 mb-12">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Clinic Workflows
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Real-time Taglish speech synthesis, automated HMO qualification,
              and calendar locking.
            </p>
          </ScrollReveal>

          {/* Bento grid — smooth transform reveal with card hover effects */}
          <ScrollReveal distance={36} duration={0.6}>
            <ClinicBentoGrid />
          </ScrollReveal>

          {/* Stats row — staggered reveal with hover glow */}
          <ScrollRevealGroup
            staggerMs={90}
            className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12"
          >
            {[
              {
                value: 99.4, decimals: 1, suffix: "%",
                label: "Clinical Intent Accuracy",
                sub: "Understands medical & dental Taglish",
                duration: 1.5,
              },
              {
                value: 42000, prefix: "₱", suffix: "/mo",
                label: "Recovered Revenue",
                sub: "From evening & weekend callers",
                duration: 2,
              },
              {
                value: 1.2, decimals: 1, suffix: "s",
                label: "Response Latency",
                sub: "Zero patient hold queues",
                duration: 1.8,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-1 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group cursor-default"
              >
                <StatsCounter
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={stat.duration}
                  className="text-3xl font-mono font-bold text-emerald-400 group-hover:scale-105 transition-transform duration-200"
                />
                <p className="text-xs font-semibold text-slate-200">{stat.label}</p>
                <p className="text-[11px] text-slate-500">{stat.sub}</p>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* ── ROI CALCULATOR ─────────────────────────────────────────── */}
      <section id="roi-calculator" className="py-16 border-b border-white/5">
        <ScrollReveal distance={32} duration={0.6}>
          <RoiCalculator />
        </ScrollReveal>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 border-b border-white/5 bg-[#090b12]">
        <ScrollReveal distance={32} duration={0.6}>
          <Pricing />
        </ScrollReveal>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 border-b border-white/5">
        <ScrollReveal distance={32} duration={0.6}>
          <FaqSection />
        </ScrollReveal>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center relative overflow-hidden bg-[#090b12]">
        <ScrollReveal distance={28} duration={0.6}>
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-emerald-500/8 blur-[100px] rounded-full" />
          </div>
          <div className="max-w-2xl mx-auto space-y-4 relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to answer every patient call?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Set up SagotBot in 5 minutes. Connect your Google Calendar and start
              taking calls 24/7.
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="/signup">
                <CandyButton className="px-8 py-3.5 text-sm font-bold flex items-center gap-2">
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
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
