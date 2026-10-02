"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Sparkles, PhoneCall, ArrowLeft } from "lucide-react";
import { InteractiveCharacters } from "@/components/auth/interactive-characters";

interface AuthContextType {
  isPasswordFocused: boolean;
  setIsPasswordFocused: (val: boolean) => void;
  isEmailFocused: boolean;
  setIsEmailFocused: (val: boolean) => void;
  isTyping: boolean;
  setIsTyping: (val: boolean) => void;
  authStatus: "idle" | "loading" | "success" | "error";
  setAuthStatus: (val: "idle" | "loading" | "success" | "error") => void;
}

const AuthContext = createContext<AuthContextType>({
  isPasswordFocused: false,
  setIsPasswordFocused: () => {},
  isEmailFocused: false,
  setIsEmailFocused: () => {},
  isTyping: false,
  setIsTyping: () => {},
  authStatus: "idle",
  setAuthStatus: () => {},
});

export const useAuthVisuals = () => useContext(AuthContext);

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [authStatus, setAuthStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const pathname = usePathname();
  const isSignup = pathname?.startsWith("/signup");
  const isForgotPassword = pathname?.startsWith("/forgot-password");
  const isResetPassword = pathname?.startsWith("/reset-password");
  const backHref = isSignup || isForgotPassword || isResetPassword ? "/login" : "/";
  const backLabel = isSignup || isForgotPassword || isResetPassword ? "Back to Sign In" : "Back to Home";

  return (
    <AuthContext.Provider
      value={{
        isPasswordFocused,
        setIsPasswordFocused,
        isEmailFocused,
        setIsEmailFocused,
        isTyping,
        setIsTyping,
        authStatus,
        setAuthStatus,
      }}
    >
      <div className="min-h-screen w-full flex bg-[#08090d] text-slate-100 overflow-hidden relative">
        {/* Fixed Top-Left Back Button */}
        <div className="fixed top-5 left-5 z-50">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0c0e17]/90 hover:bg-[#151928] text-slate-200 hover:text-white border border-white/15 hover:border-emerald-500/40 shadow-xl shadow-black/50 backdrop-blur-xl text-xs font-semibold transition-all duration-200 interactive-press group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>{backLabel}</span>
          </Link>
        </div>

        {/* LEFT STAGE: INTERACTIVE CURSOR-TRACKING CHARACTERS */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-[#090b12] border-r border-white/5 overflow-hidden">
          {/* Subtle Clean Ambient Glow */}
          <div className="absolute top-1/3 left-1/3 w-[360px] h-[360px] bg-emerald-500/8 blur-[120px] rounded-full pointer-events-none" />

          {/* Top Branding Header */}
          <div className="relative z-10 flex items-center justify-between pt-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">
                  SagotBot
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  AI Receptionist
                </span>
              </div>
            </Link>

            <span className="text-xs text-slate-400">
              Metro Manila, PH
            </span>
          </div>

          {/* Center Stage: Interactive Characters with Minimalist Copy */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <div className="text-center mb-5 max-w-sm">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {isPasswordFocused
                  ? "Confidential & secure."
                  : "Always on duty."}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isPasswordFocused
                  ? "Your clinic credentials remain private and encrypted."
                  : "Answering patient inquiries 24/7 in warm Taglish."}
              </p>
            </div>

            {/* Interactive Characters Component */}
            <InteractiveCharacters
              isPasswordFocused={isPasswordFocused}
              isEmailFocused={isEmailFocused}
              isTyping={isTyping}
              authStatus={authStatus}
            />
          </div>

          {/* Bottom Trust Line */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5 pt-5">
            <span>Trusted by premier PH dental & medical clinics</span>
            <span>DPA 2012 Compliant</span>
          </div>
        </div>

        {/* RIGHT STAGE: AUTHENTICATION FORMS */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="w-full max-w-md relative z-10">
            {children}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
