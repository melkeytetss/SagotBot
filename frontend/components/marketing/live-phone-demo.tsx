"use client";

import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, Calendar, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TranscriptTurn {
  speaker: "caller" | "bot";
  text: string;
  delayMs: number;
}

const DEMO_TRANSCRIPT: TranscriptTurn[] = [
  {
    speaker: "bot",
    text: "Magandang araw po! Salamat sa pagtawag sa Studio Apex. Ako po si Sarah, ang inyong AI receptionist. Paano po ako makakatulong?",
    delayMs: 800,
  },
  {
    speaker: "caller",
    text: "Hello po, magtatanong lang po sana kung may available slot kayo bukas para sa consultation and service booking?",
    delayMs: 2500,
  },
  {
    speaker: "bot",
    text: "Meron po! Bukas po available ang aming team ng 2:00 PM at 4:30 PM. Ang initial consultation po ay ₱1,500. Alin pong oras ang mas convenient sa inyo?",
    delayMs: 4600,
  },
  {
    speaker: "caller",
    text: "Ayos po yung 2:00 PM! Under Maria Clara po.",
    delayMs: 7200,
  },
  {
    speaker: "bot",
    text: "Naka-book na po ang schedule niyo, Ma'am Maria! Tomorrow, 2:00 PM. Nag-text na rin po kami ng confirmation sa inyong number. Maraming salamat po!",
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
    <div className="relative w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 py-8">
      {/* LEFT: Context & Highlights */}
      <div className="lg:w-1/2 text-left space-y-4">
        <span className="text-xs uppercase tracking-widest text-blue-600 font-mono font-semibold">
          Interactive Demo
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
          Hear SagotBot on a live business call
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
          Test our Philippine AI receptionist in action. Switches effortlessly between Tagalog and English, answers customer questions, checks real-time slot availability, and books into your calendar.
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Natural Taglish speech synthesis</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Real-time Google Calendar locking</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-700">
            <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Instant customer SMS confirmation</span>
          </div>
        </div>

        {callState !== "incoming" && (
          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset demo call</span>
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: THE SMARTPHONE INTERFACE (LIGHT MODE) */}
      <div className="lg:w-1/2 flex justify-center">
        <div className="relative w-[300px] h-[580px] rounded-[42px] bg-white border-[6px] border-zinc-200/90 shadow-lg flex flex-col overflow-hidden">
          {/* Dynamic Island Pill */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-zinc-950 rounded-full z-30 flex items-center justify-between px-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-zinc-800" />
          </div>

          {/* LIGHT MODE SCREEN CONTENT */}
          <div className="flex-1 flex flex-col justify-between pt-10 pb-5 px-3.5 bg-[#fafafa] text-zinc-900 relative">
            {callState === "incoming" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-between py-4 text-center"
              >
                <div>
                  <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider font-semibold">
                    Inbound Customer Call
                  </span>
                  <h3 className="text-lg font-bold text-zinc-950 mt-1">Maria Clara</h3>
                  <p className="text-xs text-zinc-500 font-mono">+63 917 555 0192</p>
                  <span className="inline-block text-[10px] text-zinc-600 mt-2 bg-white py-0.5 px-2.5 rounded-full border border-zinc-200/80 shadow-2xs">
                    Taglish Service Inquiry
                  </span>
                </div>

                {/* Light Avatar */}
                <div className="relative w-24 h-24 my-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
                  <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-950 font-bold text-xl shadow-xs">
                    MC
                  </div>
                </div>

                {/* Call Answer Button */}
                <div className="w-full space-y-2">
                  <button
                    onClick={handleStartCall}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs flex items-center justify-center gap-2 interactive-press cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Answer Call</span>
                  </button>
                  <p className="text-[10px] text-zinc-400">Click to listen to AI receptionist</p>
                </div>
              </motion.div>
            )}

            {(callState === "active" || callState === "completed") && (
              <div className="flex-1 flex flex-col justify-between">
                {/* Active Header & Timer */}
                <div className="text-center pb-2 border-b border-zinc-200/70">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-xs font-mono text-blue-600 font-medium">
                      {callState === "completed" ? "Call Ended • Confirmed" : formatTimer(seconds)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-zinc-950 mt-0.5">AI Business Receptionist</h4>

                  {/* Soundwave Visualizer */}
                  {callState === "active" && (
                    <div className="flex items-center justify-center gap-1 h-5 mt-1.5">
                      {[12, 20, 16, 24, 10, 18, 26, 14, 22, 12, 16].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, h, 4] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            delay: i * 0.08,
                            ease: "easeInOut",
                          }}
                          className="w-1 bg-blue-600 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Dialogue Stream Container */}
                <div className="flex-1 overflow-y-auto space-y-2 py-2.5 pr-0.5 text-left text-xs">
                  {transcript.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col ${
                        msg.speaker === "bot" ? "items-start" : "items-end"
                      }`}
                    >
                      <span className="text-[9px] text-zinc-400 font-mono mb-0.5 px-0.5">
                        {msg.speaker === "bot" ? "SagotBot" : "Maria Clara"}
                      </span>
                      <div
                        className={`p-2.5 rounded-xl max-w-[88%] text-[11px] leading-relaxed ${
                          msg.speaker === "bot"
                            ? "bg-white text-zinc-800 rounded-tl-xs border border-zinc-200/80 shadow-2xs"
                            : "bg-zinc-950 text-white rounded-tr-xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Google Calendar Booking Card */}
                <AnimatePresence>
                  {showCalendarBooking && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ type: "spring", stiffness: 240, damping: 20 }}
                      className="p-2.5 rounded-xl bg-white border border-blue-200 text-xs shadow-xs mb-2 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-950 text-[10px]">
                          <Calendar className="w-3 h-3 text-blue-600" />
                          <span>Slot Confirmed</span>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          Google Calendar ✓
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-700">
                        Maria Clara • Service Consultation & Booking
                      </p>
                      <p className="text-[9px] text-zinc-500 font-mono">
                        Tomorrow at 2:00 PM - 2:45 PM
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Action */}
                <div className="pt-1">
                  {callState === "active" ? (
                    <button
                      onClick={() => setCallState("completed")}
                      className="w-full py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-medium text-xs flex items-center justify-center gap-1.5 interactive-press cursor-pointer transition-colors"
                    >
                      <PhoneOff className="w-3 h-3" />
                      <span>End Call</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReset}
                      className="w-full py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 interactive-press cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replay Call</span>
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

export default LivePhoneDemo;
