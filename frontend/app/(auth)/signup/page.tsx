"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, User, Mail, Lock, Phone, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuthVisuals } from "../layout";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
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
      setErrorMsg("Please fill in all details.");
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
      setErrorMsg("Please provide your business name and phone number.");
      return;
    }

    setLoading(true);
    setAuthStatus("loading");

    setTimeout(() => {
      setLoading(false);
      setAuthStatus("success");

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#09090b", "#7c3aed"],
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }, 1000);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/90 shadow-2xs p-6 sm:p-8">
      <div className="w-full space-y-5">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-semibold">
            Step {step} of 2
          </span>
          <div className="flex gap-1.5">
            <span className={`w-6 h-1 rounded-full ${step >= 1 ? "bg-zinc-950" : "bg-zinc-200"}`} />
            <span className={`w-6 h-1 rounded-full ${step >= 2 ? "bg-zinc-950" : "bg-zinc-200"}`} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            {step === 1 ? "Create account" : "Business details"}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {step === 1
              ? "Start your 14-day free trial. No credit card required."
              : "Where should SagotBot route and schedule calls?"}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Maria Santos"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <CandyButton
              type="submit"
              variant="black"
              className="w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </CandyButton>
          </form>
        ) : (
          <form onSubmit={handleCompleteSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Business Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Acme Studio / Santos & Partners"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "services", label: "Services / Studio" },
                  { id: "clinic", label: "Clinic / Health" },
                  { id: "salon", label: "Salon / Spa" },
                  { id: "general", label: "Retail / Other" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setBusinessType(item.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      businessType === item.id
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Business Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            <TurnstileWidget />

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium flex items-center justify-center gap-1.5 interactive-press cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <CandyButton
                type="submit"
                variant="black"
                disabled={loading}
                className="flex-1 py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </>
                )}
              </CandyButton>
            </div>
          </form>
        )}

        <p className="text-center text-xs text-zinc-500 pt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
