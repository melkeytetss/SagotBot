"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { GlowBorderCard } from "@/components/ui/glow-border-card";
import { CandyButton } from "@/components/ui/candy-button";
import confetti from "canvas-confetti";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { setIsPasswordFocused, setAuthStatus } = useAuthVisuals();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Compute password strength
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthScore = [hasMinLength, hasNumber, hasSpecial].filter(Boolean).length;

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (strengthScore < 2) {
      setErrorMsg("Please choose a stronger password.");
      return;
    }

    setLoading(true);
    setAuthStatus("loading");

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setAuthStatus("success");

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#7c3aed"],
      });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }, 1000);
  };

  return (
    <GlowBorderCard
      width="100%"
      height="auto"
      aspectRatio="unset"
      borderRadius="1.5rem"
      borderWidth="2px"
      blurAmount="12px"
      gradientColors={["#10b981", "#8b5cf6", "#3b82f6", "#10b981"]}
      className="bg-[#0c0e17]/95 border border-white/10 shadow-2xl p-6 sm:p-8"
    >
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Create new password</h1>
          <p className="text-sm text-slate-400 mt-2">
            Your new password must be at least 8 characters long and contain numbers or symbols.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Password Updated!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Redirecting you to the login portal...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                New Password
              </label>
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

              {/* Password strength meter */}
              {password && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1.5 h-1">
                    <div
                      className={`flex-1 rounded-full transition-all ${
                        strengthScore >= 1 ? "bg-amber-500" : "bg-white/10"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition-all ${
                        strengthScore >= 2 ? "bg-emerald-400" : "bg-white/10"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition-all ${
                        strengthScore >= 3 ? "bg-emerald-500" : "bg-white/10"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {strengthScore === 1 && "Weak - add numbers or special characters"}
                    {strengthScore === 2 && "Good password"}
                    {strengthScore === 3 && "Strong password"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                />
              </div>
            </div>

            <CandyButton
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 mt-6 shadow-xl shadow-emerald-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </CandyButton>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          Remembered your credentials?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Back to sign in
          </Link>
        </p>
      </div>
    </GlowBorderCard>
  );
}
