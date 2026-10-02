"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { GlowBorderCard } from "@/components/ui/glow-border-card";
import { CandyButton } from "@/components/ui/candy-button";
import confetti from "canvas-confetti";

export default function LoginPage() {
  const router = useRouter();
  const { setIsPasswordFocused, setIsEmailFocused, setIsTyping, setAuthStatus } = useAuthVisuals();

  const [email, setEmail] = useState("owner@smilesdental.ph");
  const [password, setPassword] = useState("SagotBot2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    setAuthStatus("loading");

    // Simulate authenticating against Supabase Multi-Tenancy
    setTimeout(() => {
      if (!password || password.length < 6) {
        setErrorMsg("Please enter a valid password (minimum 6 characters).");
        setLoading(false);
        setAuthStatus("error");
        setTimeout(() => setAuthStatus("idle"), 2500);
        return;
      }

      setAuthStatus("success");
      setLoading(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#7c3aed", "#fbbf24", "#ff6b4a"],
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 900);
  };

  const handleQuickDemo = () => {
    setEmail("dr.reyes@smilesdental.ph");
    setPassword("Smiles2026!");
    setAuthStatus("success");
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
      colors: ["#10b981", "#7c3aed"],
    });
    setTimeout(() => router.push("/dashboard"), 600);
  };

  return (
    <GlowBorderCard
      width="100%"
      height="auto"
      aspectRatio="unset"
      borderRadius="1.25rem"
      borderWidth="1.5px"
      blurAmount="8px"
      gradientColors={["#10b981", "#059669", "#047857", "#10b981"]}
      className="bg-[#0c0e17]/95 border border-white/10 shadow-2xl p-6 sm:p-8"
    >
      <div className="w-full">
        {/* Mobile Top Header */}
        <div className="lg:hidden flex items-center justify-between mb-6 pb-3 border-b border-white/10">
          <Link href="/" className="text-lg font-bold text-white flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
              S
            </div>
            <span>SagotBot</span>
          </Link>
          <span className="text-[10px] text-emerald-400 font-mono">PH Receptionist</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign in</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your clinic&apos;s calls, calendar bookings, and AI logs.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsTyping(true);
                }}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => {
                  setIsEmailFocused(false);
                  setIsTyping(false);
                }}
                placeholder="doctor@clinic.ph"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember this device</span>
            </label>
          </div>

          {/* Bot Security */}
          <div className="pt-1">
            <TurnstileWidget onVerify={(token) => setTurnstileToken(token)} />
          </div>

          {/* Submit Button */}
          <CandyButton
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </CandyButton>
        </form>

        {/* Minimal Quick Demo Account Button */}
        <div className="mt-3">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 px-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors interactive-press cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Demo: Dr. Reyes (Smiles Dental)</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Start 14-day free trial
          </Link>
        </p>
      </div>
    </GlowBorderCard>
  );
}
