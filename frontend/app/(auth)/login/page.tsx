"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { RecaptchaWidget } from "@/components/auth/recaptcha-widget";
import { CandyButton } from "@/components/ui/candy-button";
import { createClient } from "@/lib/supabase/client";
import confetti from "canvas-confetti";

export default function LoginPage() {
  const router = useRouter();
  const { setIsPasswordFocused, setIsEmailFocused, setIsTyping, setAuthStatus } = useAuthVisuals();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setErrorMsg("Security verification is loading, please wait.");
      return;
    }
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setAuthStatus("loading");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setAuthStatus("error");
        setTimeout(() => setAuthStatus("idle"), 2500);
      } else {
        setAuthStatus("success");

        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#09090b", "#7c3aed"],
        });

        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setErrorMsg("An unexpected error occurred during sign in. Please try again.");
      setAuthStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-6 sm:p-8">
      <div className="w-full space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Sign in</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Email
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
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => {
                  setIsEmailFocused(false);
                  setIsTyping(false);
                }}
                placeholder="you@company.ph"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-700">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          <RecaptchaWidget onVerify={(token) => setRecaptchaToken(token)} action="login" />

          <CandyButton
            type="submit"
            variant="black"
            disabled={loading || !recaptchaToken}
            className="w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </CandyButton>
        </form>

        <div className="pt-2 text-center">
          <p className="text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Start free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
