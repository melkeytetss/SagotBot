"use client";

import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Calendar, Check, Volume2, UserCheck, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TranscriptTurn {
  speaker: "caller" | "bot";
  text: string;
  delayMs: number;
}

const DEMO_TRANSCRIPT: TranscriptTurn[] = [
  {
    speaker: "bot",
    text: "Magandang araw po! Salamat sa pagtawag sa Smiles Dental Clinic. Ako po si Sarah, ang AI receptionist. Paano po ako makakatulong?",
    delayMs: 800,
  },
  {
    speaker: "caller",
    text: "Hello po, magtatanong lang po sana kung may available slot po kayo bukas para sa teeth cleaning?",
    delayMs: 2500,
  },
  {
    speaker: "bot",
    text: "Meron po! Bukas, Friday, available po si Doc ng 2:00 PM at 4:30 PM. Ang regular cleaning po ay ₱1,500. Alin pong oras ang mas convenient sa inyo?",
    delayMs: 4600,
  },
  {
    speaker: "caller",
    text: "Ayos po yung 2:00 PM! Under Maria Clara po.",
    delayMs: 7200,
  },
  {
    speaker: "bot",
    text: "Naka-book na po ang appointment niyo, Ma'am Maria! Tomorrow, 2:00 PM for Oral Prophylaxis. Nag-text na rin po kami ng confirmation sa number na ito. Maraming salamat po!",
    delayMs: 9200,
  },
];

export function LivePhoneDemo() {
  const [callState, setCallState] = useState<"incoming" | "active" | "completed">("incoming");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [showCalendarBooking, setShowCalendarBooking] = useState(false);

  // Timer logic for active call
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "active") {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Dialogue sequence simulation
  useEffect(() => {
    if (callState !== "active") return;

    const timeouts: NodeJS.Timeout[] = [];

    DEMO_TRANSCRIPT.forEach((turn) => {
      const t = setTimeout(() => {
        setTranscript((prev) => [...prev, turn]);
        if (turn.text.includes("Naka-book na po")) {
          setTimeout(() => setShowCalendarBooking(true), 1200);
          setTimeout(() => setCallState("completed"), 3800);
        }
      }, turn.delayMs);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [callState]);

  const handleStartCall = () => {
    setCallState("active");
    setSeconds(0);
    setTranscript([]);
    setShowCalendarBooking(false);
  };

  const handleReset = () => {
    setCallState("incoming");
    setSeconds(0);
    setTranscript([]);
    setShowCalendarBooking(false);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `00:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 py-8">
      {/* LEFT: Context & Highlights */}
      <div className="lg:w-1/2 text-left space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Browser Simulator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
          Hear how SagotBot sounds on a real clinic call.
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Test our Philippine dental clinic receptionist in action. Notice how effortlessly it switches between Tagalog and English, checks real-time slot availability, and writes appointments directly to Google Calendar.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Natural Taglish Code-Switching</p>
              <p className="text-[11px] text-slate-400">Speaks like a warm, polite Philippine clinic receptionist (*po/opo*).</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Live Google Calendar Integration</p>
              <p className="text-[11px] text-slate-400">Instantly books confirmed slots with zero double-booking risk.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Automated SMS Reminders & Sheets Sync</p>
              <p className="text-[11px] text-slate-400">Caller receives an instant SMS confirmation and row logs to Sheets.</p>
            </div>
          </div>
        </div>

        {callState !== "incoming" && (
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors interactive-press"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Replay Demo Call</span>
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: THE SMARTPHONE INTERFACE */}
      <div className="lg:w-1/2 flex justify-center">
        <div className="relative w-[320px] h-[640px] rounded-[48px] bg-slate-950 border-[7px] border-slate-800 shadow-2xl shadow-emerald-500/10 flex flex-col overflow-hidden">
          {/* Dynamic Island Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/20" />
          </div>

          {/* SCREEN CONTENT */}
          <div className="flex-1 flex flex-col justify-between pt-12 pb-6 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white relative">
            {callState === "incoming" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-between py-6 text-center"
              >
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 tracking-wider uppercase">
                    Inbound Clinic Call
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Maria Clara</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">+63 917 555 0192</p>
                  <p className="text-[11px] text-slate-500 mt-2 bg-white/5 py-1 px-3 rounded-full border border-white/5">
                    Taglish Dental Inquiry
                  </p>
                </div>

                {/* Animated Caller Avatar Ring */}
                <div className="relative w-28 h-28 my-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-2xl shadow-xl shadow-emerald-500/30">
                    MC
                  </div>
                </div>

                {/* Call Answer Buttons */}
                <div className="w-full space-y-3">
                  <button
                    onClick={handleStartCall}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2.5 interactive-press cursor-pointer"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" />
                    <span>Answer Call po</span>
                  </button>
                  <p className="text-[10px] text-slate-400">Click to listen to AI Taglish receptionist</p>
                </div>
              </motion.div>
            )}

            {(callState === "active" || callState === "completed") && (
              <div className="flex-1 flex flex-col justify-between">
                {/* Active Header & Timer */}
                <div className="text-center pb-2 border-b border-white/10">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      {callState === "completed" ? "Call Ended • Success" : formatTimer(seconds)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">Smiles Dental Receptionist</h4>

                  {/* Real-Time Audio Soundwave Visualizer */}
                  {callState === "active" && (
                    <div className="flex items-center justify-center gap-1 h-6 mt-2">
                      {[14, 24, 18, 28, 12, 22, 32, 16, 26, 14, 20].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [6, h, 6] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.08,
                            ease: "easeInOut",
                          }}
                          className="w-1 bg-emerald-400 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Dialogue Stream Container */}
                <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-left text-xs">
                  {transcript.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex flex-col ${
                        msg.speaker === "bot" ? "items-start" : "items-end"
                      }`}
                    >
                      <span className="text-[9px] text-slate-500 font-mono mb-0.5 px-1">
                        {msg.speaker === "bot" ? "SagotBot (Sarah)" : "Maria Clara"}
                      </span>
                      <div
                        className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          msg.speaker === "bot"
                            ? "bg-slate-800/90 text-slate-100 rounded-tl-sm border border-white/5"
                            : "bg-emerald-600 text-white rounded-tr-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Automatic Google Calendar Event Confirmation Card */}
                <AnimatePresence>
                  {showCalendarBooking && (
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ type: "spring", stiffness: 240, damping: 18 }}
                      className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs shadow-xl mb-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Google Calendar Slot Confirmed</span>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          Auto-Synced
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Maria Clara • Oral Prophylaxis (Cleaning)
                      </p>
                      <p className="text-[10px] text-emerald-400 font-mono">
                        Tomorrow at 2:00 PM - 2:45 PM (Asia/Manila)
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* End Call / Reset */}
                <div className="pt-1">
                  {callState === "active" ? (
                    <button
                      onClick={() => setCallState("completed")}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 interactive-press"
                    >
                      <PhoneOff className="w-3.5 h-3.5" />
                      <span>End Simulated Call</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 interactive-press"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Try Another Demo Call</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
