"use client";

import React from "react";
import Link from "next/link";
import { Bot, ArrowUpRight, ShieldCheck, Globe2 } from "lucide-react";

export function MarketingFooter() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-zinc-200/80 bg-[#f8f8f9] text-zinc-600 font-sans">
      {/* Main SaaS Navigation Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Mission (4 Columns) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-150">
                <Bot className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-950">SagotBot</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-600">
                PH Business AI
              </span>
            </Link>

            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              The AI phone receptionist engineered for Philippine businesses. Answers customer inquiries 24/7 in fluent Taglish, qualifies leads, and syncs directly with Google Calendar.
            </p>

            {/* Live Infrastructure Status */}
            <div className="pt-1 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-zinc-200/80 text-zinc-700 text-xs shadow-2xs w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px]">Telephony Online: 99.98% Uptime</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                <Globe2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>BGC, Taguig City • Metro Manila, Philippines</span>
              </div>
            </div>
          </div>

          {/* SaaS Navigation Columns (8 Columns: 4 x 2) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Column 1: Product */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
                Product
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#live-demo" onClick={scrollTo("live-demo")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Live Phone Demo
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Taglish Voice AI
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    FAQ & Lead Qualification
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Calendar Lock
                  </a>
                </li>
                <li>
                  <a href="#roi-calculator" onClick={scrollTo("roi-calculator")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    ROI Calculator
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Industries */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
                Industries
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Clinics & Wellness
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Salons & Spas
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Professional Services
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Restaurants & Cafes
                  </a>
                </li>
                <li>
                  <a href="#features" onClick={scrollTo("features")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Real Estate & Retail
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Integrations */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
                Integrations
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <span className="text-zinc-600">Google Calendar</span>
                </li>
                <li>
                  <span className="text-zinc-600">Google Sheets</span>
                </li>
                <li>
                  <span className="text-zinc-600">Globe Forwarding</span>
                </li>
                <li>
                  <span className="text-zinc-600">Smart / PLDT Trunk</span>
                </li>
                <li>
                  <span className="text-zinc-600">SMS Notifications</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Account & Trust */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
                Platform
              </p>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#pricing" onClick={scrollTo("pricing")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Pricing Plans
                  </a>
                </li>
                <li>
                  <a href="#faq" onClick={scrollTo("faq")} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Platform FAQs
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-zinc-600 hover:text-zinc-950 transition-colors font-medium">
                    Console Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    Business Dashboard
                  </Link>
                </li>
                <li className="flex items-center gap-1 text-zinc-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[11px] font-mono">DPA 2012 Secure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modern SaaS Bottom Legal Bar */}
      <div className="border-t border-zinc-200/70 bg-[#f8f8f9]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} SagotBot Inc.</span>
            <span className="text-zinc-300">•</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-500">
            <span className="hover:text-zinc-950 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-950 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-zinc-950 transition-colors cursor-pointer">Security</span>
            <span className="hover:text-zinc-950 transition-colors cursor-pointer">System Status</span>
            <span className="text-zinc-300">•</span>
            <span className="font-mono text-[11px] text-zinc-400">PST (UTC+8)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
