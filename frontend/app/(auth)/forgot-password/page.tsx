"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { RecaptchaWidget } from "@/components/auth/recaptcha-widget";
import { GlowBorderCard } from "@/components/ui/glow-border-card";
import { CandyButton } from "@/components/ui/candy-button";

export default function ForgotPasswordPage() {
  const { setIsTyping, setAuthStatus } = useAuthVisuals();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !recaptchaToken) return;
    setLoading(true);
    setAuthStatus("loading");

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setAuthStatus("idle");
    }, 800);
  };

  return (
    <GlowBorderCard
      width="100%"
      height="auto"
      aspectRatio="unset"
      borderRadius="1.5rem"
      borderWidth="2px"
      blurAmount="12px"
      gradientColors={["#8b5cf6", "#3b82f6", "#10b981", "#8b5cf6"]}
      className="bg-[#0c0e17]/95 border border-white/10 shadow-2xl p-6 sm:p-8"
    >
      <div className="w-full">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5 text-slate-300 hover:text-violet-400 text-xs font-medium mb-4 transition-colors duration-200 interactive-press group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Sign In</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password Recovery</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Reset your password</h1>
          <p className="text-sm text-slate-400 mt-2">
            Enter the email associated with your business account and we&apos;ll send you a secure password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Reset link sent!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                We&apos;ve sent instructions to <span className="text-emerald-400 font-mono">{email}</span>. Please check your inbox and spam folder.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/reset-password"
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <span>Have a recovery token? Set new password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Account Email
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
                  onBlur={() => setIsTyping(false)}
                  placeholder="you@company.ph"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <RecaptchaWidget
                action="forgot_password"
                onVerify={(token) => setRecaptchaToken(token)}
              />
            </div>

            <CandyButton
              type="submit"
              disabled={loading || !recaptchaToken}
              className="w-full py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 mt-6 shadow-xl shadow-emerald-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </CandyButton>
          </form>
        )}
      </div>
    </GlowBorderCard>
  );
}
