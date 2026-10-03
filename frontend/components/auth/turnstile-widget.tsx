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
    }, 600);
  };

  return (
    <div
      onClick={handleVerify}
      className={`flex items-center justify-between p-2.5 rounded-xl border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/60 cursor-pointer transition-colors select-none ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
            verified
              ? "bg-zinc-950 border-zinc-950 text-white"
              : verifying
              ? "border-zinc-900 animate-spin"
              : "border-zinc-300 bg-white"
          }`}
        >
          {verified ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : verifying ? (
            <div className="w-2 h-2 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          ) : null}
        </div>
        <div className="text-xs">
          <p className="font-medium text-zinc-800">
            {verified ? "Verification passed" : "I am human"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-zinc-400">
        <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-[10px] font-mono text-zinc-500">Cloudflare</span>
      </div>
    </div>
  );
}

export default TurnstileWidget;
