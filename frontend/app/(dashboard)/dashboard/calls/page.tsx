"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  Search,
  Filter,
  Play,
  Pause,
  X,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Volume2,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FlipText } from "@/components/ui/flip-text";
import { CandyButton } from "@/components/ui/candy-button";

interface CallRecord {
  id: string;
  caller: string;
  phone: string;
  time: string;
  duration: string;
  intent: string;
  language: "Taglish" | "English" | "Tagalog";
  booked: boolean;
  appointmentTime?: string;
  summary: string;
  transcripts: {
    speaker: "caller" | "bot";
    text: string;
    timestamp: string;
  }[];
}

const CALL_LOGS: CallRecord[] = [
  {
    id: "call-101",
    caller: "Maria Clara Santos",
    phone: "+63 917 555 0192",
    time: "Today, 2:15 PM",
    duration: "1m 45s",
    intent: "Oral Prophylaxis (Cleaning)",
    language: "Taglish",
    booked: true,
    appointmentTime: "Tomorrow, 2:00 PM - 2:45 PM",
    summary: "Caller inquired about teeth cleaning pricing and available afternoon slots. Confirmed Maxicare HMO accreditation. Successfully booked Friday 2:00 PM.",
    transcripts: [
      {
        speaker: "bot",
        text: "Magandang hapon po! Salamat sa pagtawag sa Smiles Dental Clinic BGC. Ako po si Sarah, paano po ako makakatulong?",
        timestamp: "00:03",
      },
      {
        speaker: "caller",
        text: "Hi po, magtatanong lang kung magkano magpalinis ng ngipin at kung may available kayo bukas?",
        timestamp: "00:12",
      },
      {
        speaker: "bot",
        text: "Ang regular teeth cleaning po natin starts at ₱1,500. Bukas po, Friday, may available slot si Doc ng 2:00 PM at 4:30 PM. Alin po mas preferred niyo?",
        timestamp: "00:26",
      },
      {
        speaker: "caller",
        text: "Yung 2:00 PM po sana. Accredited po ba kayo sa Maxicare?",
        timestamp: "00:38",
      },
      {
        speaker: "bot",
        text: "Opo, accredited po tayo sa Maxicare! Dalhin lang po ang physical HMO card at 1 government ID. Naka-reserve na po kayo bukas ng 2:00 PM under Maria Clara Santos.",
        timestamp: "00:58",
      },
      {
        speaker: "caller",
        text: "Sige po, maraming salamat!",
        timestamp: "01:05",
      },
    ],
  },
  {
    id: "call-102",
    caller: "Juan Dela Cruz",
    phone: "+63 918 223 9910",
    time: "Today, 1:40 PM",
    duration: "2m 10s",
    intent: "Toothache Emergency",
    language: "Taglish",
    booked: true,
    appointmentTime: "Today, 5:00 PM - 5:45 PM",
    summary: "Patient experiencing severe throbbing pain in lower molar. Triaged as emergency extraction. Booked immediate emergency slot today at 5:00 PM.",
    transcripts: [
      {
        speaker: "bot",
        text: "Magandang hapon po! Smiles Dental Clinic, Sarah speaking. Paano po makakatulong?",
        timestamp: "00:02",
      },
      {
        speaker: "caller",
        text: "Doc sobrang sakit nung bagang ko kaninang umaga pa, pwedeng magpatingin ngayon?",
        timestamp: "00:14",
      },
      {
        speaker: "bot",
        text: "Naku, pasensya na po sa nararamdaman niyo. May emergency slot po si Doc ngayon bandang 5:00 PM para ma-check at mabigyan kayo ng pain relief o bunot kung kinakailangan. I-secure ko na po ba?",
        timestamp: "00:32",
      },
      {
        speaker: "caller",
        text: "Opo please, punta ako diyan bago mag-5 PM. Juan Dela Cruz po.",
        timestamp: "00:44",
      },
      {
        speaker: "bot",
        text: "Noted po, Mr. Juan Dela Cruz! Scheduled na po kayo today at 5:00 PM. Nag-send na po kami ng directions sa BGC clinic via SMS. Ingat po sa biyahe!",
        timestamp: "01:02",
      },
    ],
  },
  {
    id: "call-103",
    caller: "Atty. Rafael Ramos",
    phone: "+63 917 441 0021",
    time: "Today, 11:20 AM",
    duration: "1m 50s",
    intent: "Laser Teeth Whitening",
    language: "English",
    booked: true,
    appointmentTime: "Saturday, 11:00 AM - 12:30 PM",
    summary: "Caller inquired about laser teeth whitening promotion and duration. Confirmed 90-minute treatment. Booked Saturday 11:00 AM.",
    transcripts: [
      {
        speaker: "bot",
        text: "Good morning! Thank you for calling Smiles Dental Clinic. This is Sarah, how may I assist you today?",
        timestamp: "00:03",
      },
      {
        speaker: "caller",
        text: "Hi, I saw your promo for laser teeth whitening. How much is it and how long does the session take?",
        timestamp: "00:15",
      },
      {
        speaker: "bot",
        text: "Our laser whitening is currently on promo at ₱7,999 inclusive of consultation and shade evaluation. The session takes around 90 minutes. Would you like to book this Saturday at 11:00 AM?",
        timestamp: "00:36",
      },
      {
        speaker: "caller",
        text: "Saturday at 11 AM works perfectly for me. Book it under Rafael Ramos.",
        timestamp: "00:48",
      },
      {
        speaker: "bot",
        text: "Confirmed, Atty. Ramos! Your session is scheduled for Saturday, 11:00 AM. We look forward to seeing you at our BGC branch.",
        timestamp: "01:10",
      },
    ],
  },
  {
    id: "call-104",
    caller: "Grace Tan",
    phone: "+63 920 882 1144",
    time: "Yesterday, 6:45 PM",
    duration: "1m 15s",
    intent: "Braces Adjustment Inquiry",
    language: "Taglish",
    booked: false,
    summary: "After-hours inquiry regarding monthly bracket adjustment fees for transferred patients. Answered FAQ details and invited caller to send photo via Viber.",
    transcripts: [
      {
        speaker: "bot",
        text: "Magandang gabi po! Salamat sa pagtawag sa Smiles Dental Clinic. Sarah po, paano po makakatulong?",
        timestamp: "00:02",
      },
      {
        speaker: "caller",
        text: "Hi, tumatanggap po ba kayo ng transfer patient for braces adjustment?",
        timestamp: "00:12",
      },
      {
        speaker: "bot",
        text: "Opo, nag-aaccept po si Doc ng transfer patients. Kailangan lang po ng initial ortho assessment fee na ₱1,000 kasama ang panoramic X-ray. Gusto niyo po ba magpa-appointment this weekend?",
        timestamp: "00:31",
      },
      {
        speaker: "caller",
        text: "Check ko muna X-ray ko then tawag ako ulit. Thank you!",
        timestamp: "00:44",
      },
      {
        speaker: "bot",
        text: "Walang anuman po! Pwede rin po kayong mag-message sa aming clinic Viber. Magandang gabi po!",
        timestamp: "00:55",
      },
    ],
  },
];

export function CallLogsPage() {
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  // Audio Playback Engine States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  // Helper to parse duration "1m 45s" -> 105 seconds
  const parseDurationSec = (dur: string) => {
    const minsMatch = dur.match(/(\d+)m/);
    const secsMatch = dur.match(/(\d+)s/);
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    const secs = secsMatch ? parseInt(secsMatch[1], 10) : 0;
    return mins * 60 + secs || 60;
  };

  const totalDurationSec = selectedCall ? parseDurationSec(selectedCall.duration) : 60;

  // Real-time audio playback simulation ticker
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && selectedCall) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, selectedCall, totalDurationSec]);

  // Reset audio state when drawer opens or closes
  const handleOpenCall = (call: CallRecord) => {
    setSelectedCall(call);
    setCurrentTimeSec(0);
    setIsPlaying(false);
  };

  const handleCloseDrawer = () => {
    setSelectedCall(null);
    setIsPlaying(false);
    setCurrentTimeSec(0);
  };

  const formatSeconds = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = Math.floor(totalSecs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (index: number, totalBars: number) => {
    const target = Math.round((index / totalBars) * totalDurationSec);
    setCurrentTimeSec(target);
    setIsPlaying(true);
  };

  const handleSeekTimestamp = (timestampStr: string) => {
    const parts = timestampStr.split(":");
    if (parts.length === 2) {
      const targetSec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      setCurrentTimeSec(targetSec);
      setIsPlaying(true);
    }
  };

  const handleCopyTranscript = () => {
    if (!selectedCall) return;
    const text = selectedCall.transcripts
      .map((t) => `[${t.timestamp}] ${t.speaker === "bot" ? "SagotBot" : selectedCall.caller}: ${t.text}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  const filteredLogs = CALL_LOGS.filter((call) => {
    const q = search.toLowerCase();
    const matchesSearch =
      call.caller.toLowerCase().includes(q) ||
      call.phone.includes(q) ||
      call.intent.toLowerCase().includes(q);

    const matchesLanguage =
      languageFilter === "All" || call.language === languageFilter;

    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Booked"
        ? call.booked
        : !call.booked;

    return matchesSearch && matchesLanguage && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlipText
              className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950"
              duration={1.8}
            >
              Live Call Logs & Recordings
            </FlipText>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Review turn-by-turn Taglish audio transcripts, caller intents, and automated Google Calendar bookings.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by caller name, phone number, or procedure..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 shadow-2xs"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 focus:outline-none focus:border-zinc-900 shadow-2xs cursor-pointer"
          >
            <option value="All">All Languages (Taglish & English)</option>
            <option value="Taglish">Taglish Only</option>
            <option value="English">English Only</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 focus:outline-none focus:border-zinc-900 shadow-2xs cursor-pointer"
          >
            <option value="All">All Booking Statuses</option>
            <option value="Booked">Booked Only</option>
            <option value="Inquiry">General Inquiries</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Caller & Phone</th>
                <th className="py-3.5 px-4">Primary Intent</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400 text-xs">
                    No calls match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => handleOpenCall(log)}
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <p className="font-semibold text-zinc-950 group-hover:text-blue-600 transition-colors">
                        {log.caller}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-400">{log.phone}</p>
                      <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">
                        {log.time}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-zinc-700 font-medium">{log.intent}</td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                        {log.language}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-zinc-500">{log.duration}</td>
                    <td className="py-4 px-4">
                      {log.booked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Booked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-mono">
                          Inquiry
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="text-xs text-blue-600 font-medium group-hover:underline">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLIDE-OVER CALL INSPECTOR DRAWER */}
      <AnimatePresence>
        {selectedCall && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white border-l border-zinc-200 shadow-2xl z-50 flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-950">{selectedCall.caller}</h3>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {selectedCall.phone} • {selectedCall.time}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseDrawer}
                  className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-lg hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Middle: Audio Player & Turn-by-Turn Transcripts */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Audio Waveform Player Bar */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-xs interactive-press cursor-pointer hover:bg-zinc-800 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                      </button>
                      <span className="text-xs font-mono text-zinc-900 font-medium">
                        {formatSeconds(currentTimeSec)} / {formatSeconds(totalDurationSec)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[1, 1.5, 2].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-colors ${
                            playbackSpeed === spd
                              ? "bg-zinc-900 text-white font-medium shadow-xs"
                              : "bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-950"
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Soundwave Interactive Scrubbing Bars */}
                  <div className="flex items-center gap-1 h-8 pt-1 cursor-pointer">
                    {[12, 22, 18, 28, 14, 24, 30, 16, 20, 10, 24, 18, 26, 14, 20, 28, 16, 22, 12, 18, 24, 14, 20, 28].map((h, i, arr) => {
                      const barPercent = (i / arr.length) * 100;
                      const currentPercent = (currentTimeSec / totalDurationSec) * 100;
                      const isPlayed = barPercent <= currentPercent;
                      return (
                        <div
                          key={i}
                          onClick={() => handleSeek(i, arr.length)}
                          style={{ height: `${h}px` }}
                          title={`Jump to ${formatSeconds((i / arr.length) * totalDurationSec)}`}
                          className={`flex-1 rounded-full transition-all duration-150 hover:opacity-80 ${
                            isPlayed ? "bg-blue-600" : "bg-zinc-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono text-center">
                    Click any waveform bar or transcript line to seek playback
                  </p>
                </div>

                {/* AI Summary Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-blue-700 font-semibold tracking-wider">
                    AI Clinical Summary
                  </span>
                  <p className="text-xs text-zinc-700 leading-relaxed">{selectedCall.summary}</p>
                </div>

                {/* Booking Status Card */}
                {selectedCall.booked && (
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-950">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>Google Calendar Appointment Added</span>
                      </div>
                      <span className="text-[9px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-xs text-blue-900 font-mono font-medium">
                      {selectedCall.appointmentTime}
                    </p>
                    <p className="text-[10px] text-zinc-600">
                      Synced with Dr. Reyes Google Calendar & Google Sheet row ID #142
                    </p>
                  </div>
                )}

                {/* Turn-by-Turn Transcript Bubbles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-zinc-900">Turn-by-Turn Transcript</p>
                    <button
                      onClick={handleCopyTranscript}
                      className="text-[10px] font-mono text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                    >
                      {copiedTranscript ? "Copied to Clipboard!" : "Copy Full Text"}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {selectedCall.transcripts.map((turn, i) => (
                      <div
                        key={i}
                        onClick={() => handleSeekTimestamp(turn.timestamp)}
                        className={`flex flex-col cursor-pointer transition-transform hover:scale-[1.01] ${
                          turn.speaker === "bot" ? "items-start" : "items-end"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono mb-1">
                          <span>{turn.speaker === "bot" ? "SagotBot (Sarah)" : selectedCall.caller}</span>
                          <span>•</span>
                          <span className="text-blue-600 hover:underline">{turn.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                            turn.speaker === "bot"
                              ? "bg-zinc-100 text-zinc-900 rounded-tl-sm border border-zinc-200/60"
                              : "bg-blue-600 text-white rounded-tr-sm"
                          }`}
                        >
                          {turn.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-zinc-200 bg-zinc-50/50 flex gap-2">
                <CandyButton
                  onClick={handleCloseDrawer}
                  variant="black"
                  className="flex-1 py-2.5 px-4 text-xs font-medium justify-center"
                >
                  Close Drawer
                </CandyButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CallLogsPage;
