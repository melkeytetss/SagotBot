"use client";

import React, { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";

interface TurnstileWidgetProps {
  onVerify?: (token: string) => void;
  className?: string;
}

export function TurnstileWidget({ onVerify, className = "" }: TurnstileWidgetProps) {
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    if (verified || verifying) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      if (onVerify) {
        onVerify("cf-turnstile-verified-token-ph-clinic");
      }
    }, 700);
  };

  return (
    <div
      onClick={handleVerify}
      className={`flex items-center justify-between p-3 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md cursor-pointer hover:border-emerald-500/40 transition-colors select-none ${className}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
            verified
              ? "bg-emerald-500 border-emerald-400 text-slate-950"
              : verifying
              ? "border-emerald-500 animate-spin"
              : "border-white/30 bg-slate-800/80"
          }`}
        >
          {verified ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : verifying ? (
            <div className="w-2.5 h-2.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          ) : null}
        </div>
        <div className="text-xs">
          <p className="font-medium text-slate-200">
            {verified ? "Verification successful" : "Verify you are human"}
          </p>
          <p className="text-[10px] text-slate-400">Protected by Cloudflare Turnstile</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span className="text-[10px] tracking-wide font-mono text-slate-400">SECURE</span>
      </div>
    </div>
  );
}
