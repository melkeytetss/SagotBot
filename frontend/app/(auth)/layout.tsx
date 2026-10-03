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
      <div className="min-h-screen w-full flex bg-[#fafafa] text-zinc-900 overflow-hidden relative">
        {/* Fixed Top-Left Back Button */}
        <div className="fixed top-5 left-5 z-50">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950 border border-zinc-200/80 shadow-xs text-xs font-medium transition-all duration-150 interactive-press group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>{backLabel}</span>
          </Link>
        </div>

        {/* LEFT STAGE: INTERACTIVE CURSOR-TRACKING CHARACTERS */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-zinc-100/70 border-r border-zinc-200/80 overflow-hidden">
          {/* Top Branding Header */}
          <div className="relative z-10 flex items-center justify-between pt-10">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-zinc-950">
                  SagotBot
                </span>
                <span className="text-[10px] font-mono text-zinc-600 bg-white px-2 py-0.5 rounded-full border border-zinc-200">
                  AI Receptionist
                </span>
              </div>
            </Link>

            <span className="text-xs text-zinc-500">
              Metro Manila, PH
            </span>
          </div>

          {/* Center Stage: Interactive Characters */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            <InteractiveCharacters
              isPasswordFocused={isPasswordFocused}
              isEmailFocused={isEmailFocused}
              isTyping={isTyping}
              authStatus={authStatus}
            />
          </div>
        </div>

        {/* RIGHT STAGE: AUTHENTICATION FORMS */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-[#f8f8f9]">
          <div className="w-full max-w-md relative z-10">
            {children}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
