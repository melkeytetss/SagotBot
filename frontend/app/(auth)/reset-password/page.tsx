"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, KeyRound } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { CandyButton } from "@/components/ui/candy-button";
import { createClient } from "@/lib/supabase/client";
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

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (strengthScore < 2) {
      setErrorMsg("Please choose a stronger password (at least 8 characters with numbers or symbols).");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setAuthStatus("loading");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
        setAuthStatus("error");
      } else {
        setSuccess(true);
        setAuthStatus("success");

        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#2563eb", "#09090b", "#7c3aed"],
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch {
      setErrorMsg("Failed to update password. Please verify your reset link and try again.");
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
            <span>New Password</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Set new password</h1>
          <p className="text-xs text-zinc-500">
            Must be at least 8 characters with numbers or special symbols.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-950">Password Updated!</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Redirecting you to the sign-in portal...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                New Password
              </label>
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
                  className="w-full pl-10 pr-11 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1.5 h-1">
                    <div
                      className={`flex-1 rounded-full transition-all ${
                        strengthScore >= 1 ? "bg-amber-500" : "bg-zinc-200"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition-all ${
                        strengthScore >= 2 ? "bg-blue-600" : "bg-zinc-200"
                      }`}
                    />
                    <div
                      className={`flex-1 rounded-full transition-all ${
                        strengthScore >= 3 ? "bg-zinc-950" : "bg-zinc-200"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    {strengthScore === 1 && "Weak - add numbers or symbols"}
                    {strengthScore === 2 && "Good password"}
                    {strengthScore === 3 && "Strong password"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-colors"
                />
              </div>
            </div>

            <CandyButton
              type="submit"
              variant="black"
              disabled={loading || !password || !confirmPassword}
              className="w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Update Password</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </CandyButton>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                Cancel and return to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
