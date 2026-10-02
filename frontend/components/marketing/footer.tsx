import React from "react";
import Link from "next/link";
import { Bot, PhoneCall, ShieldCheck, Heart } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#07080c] py-12 px-6 text-slate-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-xs">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Bot className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">SagotBot</span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            The AI phone receptionist that speaks fluent Taglish. Built proudly for Philippine dental clinics, salons, and SME businesses.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>99.98% Telephony Uptime in PH</span>
          </div>
        </div>

        {/* Product Links */}
        <div className="space-y-2">
          <p className="text-white font-semibold uppercase tracking-wider text-[10px]">Product</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><a href="#live-demo" className="hover:text-emerald-400 transition-colors link-hover-underline">Web Phone Simulator</a></li>
            <li><a href="#features" className="hover:text-emerald-400 transition-colors link-hover-underline">Taglish Speech Engine</a></li>
            <li><a href="#roi-calculator" className="hover:text-emerald-400 transition-colors link-hover-underline">Clinic ROI Calculator</a></li>
            <li><a href="#pricing" className="hover:text-emerald-400 transition-colors link-hover-underline">Plans & Packages</a></li>
          </ul>
        </div>

        {/* Industry Verticals */}
        <div className="space-y-2">
          <p className="text-white font-semibold uppercase tracking-wider text-[10px]">Industries</p>
          <ul className="space-y-1.5 text-[11px]">
            <li><a href="#verticals" className="hover:text-emerald-400 transition-colors link-hover-underline">Dental Clinics</a></li>
            <li><a href="#verticals" className="hover:text-emerald-400 transition-colors link-hover-underline">Aesthetic Centers & Salons</a></li>
            <li><a href="#verticals" className="hover:text-emerald-400 transition-colors link-hover-underline">Restaurants & Bars</a></li>
            <li><a href="#verticals" className="hover:text-emerald-400 transition-colors link-hover-underline">Multi-Branch Chains</a></li>
          </ul>
        </div>

        {/* Compliance & Security */}
        <div className="space-y-2">
          <p className="text-white font-semibold uppercase tracking-wider text-[10px]">Security & Legal</p>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Tenant Supabase RLS</span>
            </li>
            <li><span>Philippine Data Privacy Act Compliant</span></li>
            <li><span>Google Cloud Enterprise OAuth</span></li>
            <li><span>Cloudflare Bot Mitigation</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
        <p>© 2026 SagotBot Inc. Metro Manila, Philippines. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Philippine SME clinics
        </p>
      </div>
    </footer>
  );
}
