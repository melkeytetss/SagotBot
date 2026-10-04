"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { RecaptchaWidget } from "@/components/auth/recaptcha-widget";
import { CandyButton } from "@/components/ui/candy-button";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const { setIsTyping, setAuthStatus } = useAuthVisuals();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your account email.");
      return;
    }
    if (!recaptchaToken) {
      setErrorMsg("Security verification is loading, please wait.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setAuthStatus("loading");

    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMsg(error.message);
        setAuthStatus("error");
      } else {
        setSubmitted(true);
        setAuthStatus("idle");
      }
    } catch {
      setErrorMsg("Unable to send reset instructions. Please try again.");
      setAuthStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-6 sm:p-8">
      <div className="w-full space-y-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-mono mb-2">
            <KeyRound className="w-3 h-3 text-zinc-500" />
            <span>Password Recovery</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Reset your password</h1>
          <p className="text-xs text-zinc-500">
            Enter the email associated with your business account and we&apos;ll send you a secure reset link.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Reset link sent!</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                Instructions sent to <span className="text-zinc-900 font-mono font-medium">{email}</span>. Please check your inbox or spam folder.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-950 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-colors"
                />
              </div>
            </div>

            <div className="pt-1">
              <RecaptchaWidget
                action="forgot_password"
                onVerify={(token) => setRecaptchaToken(token)}
              />
            </div>

            <CandyButton
              type="submit"
              variant="black"
              disabled={loading || !recaptchaToken}
              className="w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </CandyButton>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-zinc-500 hover:text-zinc-950 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
