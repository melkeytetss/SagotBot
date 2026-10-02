"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, User, Mail, Lock, Phone, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { GlowBorderCard } from "@/components/ui/glow-border-card";
import { CandyButton } from "@/components/ui/candy-button";
import confetti from "canvas-confetti";

export default function SignUpPage() {
  const router = useRouter();
  const { setIsPasswordFocused, setIsEmailFocused, setIsTyping, setAuthStatus } = useAuthVisuals();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Owner Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Clinic Workspace Details
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<"dental" | "salon" | "restaurant" | "general">("dental");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg("Please fill in all personal details.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleCompleteSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phoneNumber) {
      setErrorMsg("Please provide your clinic name and contact number.");
      return;
    }

    setLoading(true);
    setAuthStatus("loading");

    // Simulate creating business tenant + owner record in Supabase
    setTimeout(() => {
      setLoading(false);
      setAuthStatus("success");

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#7c3aed", "#fbbf24"],
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 1200);
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
        {/* Back to sign in */}
        {step === 1 ? (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-400 text-xs font-medium mb-5 transition-colors duration-200 interactive-press group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Sign In</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-400 text-xs font-medium mb-5 transition-colors duration-200 interactive-press group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span>Back to Step 1</span>
          </button>
        )}

        {/* Progress Pill Indicator */}
        <div className="flex items-center gap-2 mb-5">
          <div
            className={`h-1 flex-1 rounded-full transition-all ${
              step >= 1 ? "bg-emerald-500" : "bg-white/10"
            }`}
          />
          <div
            className={`h-1 flex-1 rounded-full transition-all ${
              step >= 2 ? "bg-emerald-500" : "bg-white/10"
            }`}
          />
        </div>

        <div className="mb-5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
            Step {step} of 2
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
            {step === 1 ? "Create account" : "Clinic profile"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {step === 1
              ? "14-day free trial. No credit card required."
              : "Set up where SagotBot takes patient calls."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Maria Santos"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email
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

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                />
              </div>
            </div>

            <CandyButton
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 mt-5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </CandyButton>
          </form>
        ) : (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Clinic Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Santos Dental & Aesthetics"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "dental", label: "Dental" },
                  { id: "salon", label: "Aesthetics / Derma" },
                  { id: "medical", label: "Medical / Specialty" },
                  { id: "general", label: "Other Clinic" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setBusinessType(item.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      businessType === item.id
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 shadow-sm"
                        : "border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Clinic Phone Number (PH)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 transition-all font-mono"
                />
              </div>
            </div>

            <div className="pt-1">
              <TurnstileWidget />
            </div>

            <div className="flex gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 interactive-press cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <CandyButton
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete setup</span>
                  </>
                )}
              </CandyButton>
            </div>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </GlowBorderCard>
  );
}
