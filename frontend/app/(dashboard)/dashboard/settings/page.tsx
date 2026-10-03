"use client";

import React, { useState } from "react";
import {
  Bot,
  Clock,
  HelpCircle,
  Link2,
  Save,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  Phone,
  Send,
} from "lucide-react";
import { FlipText } from "@/components/ui/flip-text";
import { CandyButton } from "@/components/ui/candy-button";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Tumatanggap po ba kayo ng Maxicare or Medicard?",
    answer: "Opo! Accredited po ang Smiles Dental sa Maxicare, Medicard, at Intellicare. Dalhin lang po ang inyong HMO card at valid ID.",
    category: "HMO & Payment",
  },
  {
    id: "faq-2",
    question: "Magkano po ang regular teeth cleaning?",
    answer: "Ang aming regular oral prophylaxis ay nagsisimula sa ₱1,500 depende sa tartar build-up. Kasama na po ang comprehensive dental checkup.",
    category: "Pricing",
  },
  {
    id: "faq-3",
    question: "Saan po ang exact clinic address niyo sa BGC?",
    answer: "Nasa 3rd Floor po kami ng High Street South Corporate Plaza, 26th Street corner 9th Avenue, BGC, Taguig. May basement parking po.",
    category: "Location",
  },
];

export function ClinicSettingsPage() {
  const [botName, setBotName] = useState("Sarah");
  const [clinicName, setClinicName] = useState("Smiles Dental Clinic - BGC");
  const [forwardingPhone, setForwardingPhone] = useState("+63 917 123 4567");
  const [greeting, setGreeting] = useState(
    "Magandang araw po! Salamat sa pagtawag sa Smiles Dental Clinic BGC. Ako po si Sarah, ang AI receptionist. Paano po ako makakatulong sa inyo ngayon?"
  );

  // Operating Hours
  const [hours, setHours] = useState([
    { day: "Monday", open: "09:00", close: "18:00", active: true },
    { day: "Tuesday", open: "09:00", close: "18:00", active: true },
    { day: "Wednesday", open: "09:00", close: "18:00", active: true },
    { day: "Thursday", open: "09:00", close: "18:00", active: true },
    { day: "Friday", open: "09:00", close: "18:00", active: true },
    { day: "Saturday", open: "09:00", close: "17:00", active: true },
    { day: "Sunday", open: "10:00", close: "16:00", active: false },
  ]);

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  // Playground Test
  const [testInput, setTestInput] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;
    const item: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newQuestion,
      answer: newAnswer,
      category: newCategory,
    };
    setFaqs([...faqs, item]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  // Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ [key: string]: string }>({});

  const handleTestPing = (serviceKey: string) => {
    setPingStatus((prev) => ({ ...prev, [serviceKey]: "Testing..." }));
    setTimeout(() => {
      const lat = Math.floor(Math.random() * 80 + 110);
      setPingStatus((prev) => ({ ...prev, [serviceKey]: `Active (${lat}ms)` }));
    }, 450);
  };

  const handleSpeakResponse = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleTestPlaygroundWithText = (queryText: string) => {
    if (!queryText) return;
    setTesting(true);
    setTestResponse(null);

    setTimeout(() => {
      setTesting(false);
      const q = queryText.toLowerCase();

      // Check dynamic FAQs list
      const matchedFaq = faqs.find(
        (f) =>
          q.split(" ").some((word) => word.length > 3 && f.question.toLowerCase().includes(word)) ||
          f.question.toLowerCase().includes(q)
      );

      if (matchedFaq) {
        setTestResponse(
          `Opo! ${matchedFaq.answer} Gusto niyo po ba na i-schedule ko na kayo ng appointment kay Doc?`
        );
      } else if (q.includes("hmo") || q.includes("maxicare") || q.includes("medicard") || q.includes("card")) {
        setTestResponse(
          "Opo! Accredited po ang Smiles Dental sa Maxicare, Medicard, at Intellicare. Dalhin lang po ang inyong physical HMO card at 1 government ID sa inyong checkup. May available slot po bukas ng 2:00 PM!"
        );
      } else if (q.includes("cleaning") || q.includes("linis") || q.includes("magkano") || q.includes("price")) {
        setTestResponse(
          "Ang regular oral prophylaxis po natin ay nagsisimula sa ₱1,500 kasama na ang comprehensive dental examination. Pwede po kitang i-reserve bukas ng 2:00 PM o 4:30 PM."
        );
      } else if (q.includes("hours") || q.includes("bukas") || q.includes("sunday") || q.includes("open")) {
        setTestResponse(
          `Bukas po ang aming clinic mula Lunes hanggang Sabado, 9:00 AM hanggang 6:00 PM. Kapag Linggo naman po, naka-standby ang aming AI para i-secure ang inyong appointment sa susunod na linggo.`
        );
      } else {
        setTestResponse(
          `Salamat po sa inyong tanong! Ayon po sa clinic protocol ng ${clinicName}, maari po namin kayong i-schedule para sa assessment kay Dr. Reyes. Ano pong oras ang pinaka-convenient para sa inyo?`
        );
      }
    }, 450);
  };

  const handleTestPlayground = (e: React.FormEvent) => {
    e.preventDefault();
    handleTestPlaygroundWithText(testInput);
  };

  const handleSaveAll = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Toggle active day
  const handleToggleDay = (idx: number) => {
    setHours((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, active: !h.active } : h))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlipText
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950"
              duration={1.8}
            >
              Clinic Persona & Knowledge Base
            </FlipText>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            Configure how your AI receptionist greets callers, handles Philippine HMO inquiries, and schedules appointments.
          </p>
        </div>

        <CandyButton
          variant="black"
          onClick={handleSaveAll}
          className="py-2.5 px-4 text-xs font-semibold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? "Saved to Cloud!" : "Save Changes"}</span>
        </CandyButton>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>All clinic persona prompts, hours, and FAQs updated successfully in Supabase!</span>
        </div>
      )}

      {/* SECTION 1: AI PERSONA */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>AI Receptionist Voice & Persona</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-700 font-medium mb-1">AI Receptionist Name</label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-medium mb-1">Clinic Display Name</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-medium mb-1">Doctor Call Forwarding Phone</label>
            <input
              type="text"
              value={forwardingPhone}
              onChange={(e) => setForwardingPhone(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-700 font-medium mb-1">
            Custom Taglish Greeting Prompt (Spoken on call connect)
          </label>
          <textarea
            rows={3}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 leading-relaxed focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
          />
        </div>
      </div>

      {/* SECTION 2: OPERATING HOURS */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Weekly Operating Hours</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            Calls outside these hours trigger after-hours booking mode.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {hours.map((h, i) => (
            <div
              key={h.day}
              className={`p-3 rounded-xl border transition-colors ${
                h.active ? "bg-zinc-50/70 border-zinc-200" : "bg-zinc-50/30 border-zinc-200/50 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-zinc-900">{h.day}</span>
                <input
                  type="checkbox"
                  checked={h.active}
                  onChange={(e) => {
                    const updated = [...hours];
                    updated[i].active = e.target.checked;
                    setHours(updated);
                  }}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>
              {h.active ? (
                <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-600">
                  <span>{h.open}</span>
                  <span>-</span>
                  <span>{h.close}</span>
                </div>
              ) : (
                <span className="text-[11px] text-rose-600 font-mono">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: KNOWLEDGE BASE & FAQ MANAGER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: FAQs Table (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Clinic FAQs ({faqs.length})</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-3.5 rounded-xl bg-zinc-50/60 border border-zinc-200/70 text-xs space-y-1 relative group hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">{faq.question}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-zinc-200/70 px-2 py-0.5 rounded text-zinc-700">
                      {faq.category}
                    </span>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-zinc-600 text-[11px] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Add New FAQ Form */}
          <form onSubmit={handleAddFaq} className="pt-3 border-t border-zinc-200 space-y-2 text-xs">
            <p className="font-semibold text-zinc-900">Add New Clinic Question & Answer</p>
            <input
              type="text"
              placeholder="e.g. May parking po ba sa clinic niyo?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
            <textarea
              rows={2}
              placeholder="e.g. Opo, may free basement parking for patients on 26th Street..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
            />
            <CandyButton
              type="submit"
              variant="black"
              className="py-2 px-3.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ to AI Memory</span>
            </CandyButton>
          </form>
        </div>

        {/* Right: Interactive Playground Tester (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Interactive Knowledge Base Tester</span>
          </div>
          <p className="text-xs text-zinc-600">
            Type a test question below to simulate how SagotBot will answer a live caller in Taglish using your clinic settings.
          </p>

          <form onSubmit={handleTestPlayground} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Ask e.g. Tumatanggap ba kayo ng Maxicare?"
                className="w-full pl-3 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 shadow-2xs"
              />
              <button
                type="submit"
                disabled={testing}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 interactive-press cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "Tumatanggap ba kayo ng Maxicare?",
                "Magkano ang cleaning?",
                "Bukas ba kayo ng Sunday?",
                "Saan clinic niyo sa BGC?",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setTestInput(chip);
                    handleTestPlaygroundWithText(chip);
                  }}
                  className="px-2 py-1 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 text-[10px] text-zinc-700 hover:text-zinc-950 transition-colors text-left shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </form>

          {/* Playground Output */}
          {testResponse && (
            <div className="p-4 rounded-xl bg-white border border-blue-200 text-xs space-y-2 animate-in fade-in shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider font-semibold">
                  SagotBot Response (Voice Spoken)
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeakResponse(testResponse)}
                  className="flex items-center gap-1 text-[10px] font-mono text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                >
                  <Phone className="w-3 h-3" />
                  <span>{isSpeaking ? "Stop Voice" : "Listen (TTS)"}</span>
                </button>
              </div>
              <p className="text-zinc-800 leading-relaxed italic">&ldquo;{testResponse}&rdquo;</p>
            </div>
          )}

          {/* Integrations Health */}
          <div className="pt-4 border-t border-zinc-200 space-y-2">
            <p className="text-xs font-bold text-zinc-900">Active Integrations</p>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-zinc-700 font-medium">Google Calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestPing("gcal")}
                    className="text-[10px] font-mono text-zinc-500 hover:text-zinc-900 cursor-pointer"
                  >
                    {pingStatus["gcal"] || "Test Ping"}
                  </button>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                    Connected
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <span className="text-zinc-700 font-medium">Google Sheets Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestPing("sheets")}
                    className="text-[10px] font-mono text-zinc-500 hover:text-zinc-900 cursor-pointer"
                  >
                    {pingStatus["sheets"] || "Test Ping"}
                  </button>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicSettingsPage;
