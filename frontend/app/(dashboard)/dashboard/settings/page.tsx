"use client";

import React, { useState } from "react";
import {
  Bot,
  Clock,
  HelpCircle,
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
import { useIndustry } from "@/context/industry-context";
import { INDUSTRY_PRESETS, IndustryPreset, FAQItem } from "@/lib/industry-presets";

export function SettingsPage() {
  const {
    preset,
    industryId,
    switchIndustry,
    businessName,
    setBusinessName,
    greeting,
    setGreeting,
    forwardingPhone,
    setForwardingPhone,
    faqs,
    setFaqs,
    hours,
    setHours,
  } = useIndustry();

  const [botName, setBotName] = useState("Sarah");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  // Playground Test
  const [testInput, setTestInput] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pingStatus, setPingStatus] = useState<{ [key: string]: string }>({});

  const presetKeys: IndustryPreset["id"][] = ["studio", "salon", "restaurant", "clinic"];

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
          `Opo! ${matchedFaq.answer} Nais niyo po ba na i-schedule ko na ang inyong appointment o reservation?`
        );
      } else if (q.includes("hmo") || q.includes("card") || q.includes("health")) {
        setTestResponse(
          "Para po sa health plans at accreditations, accredited po tayo sa major Philippine providers. Pakidala lamang po ang inyong physical card at valid ID."
        );
      } else if (q.includes("hours") || q.includes("bukas") || q.includes("open") || q.includes("oras")) {
        setTestResponse(
          `Bukas po ang aming opisina ayon sa schedule. Available po ang ating AI 24/7 para sagutin ang inyong mga tawag at i-reserve ang inyong slot.`
        );
      } else if (q.includes("price") || q.includes("magkano") || q.includes("rates") || q.includes("fee")) {
        setTestResponse(
          `Salamat po sa inyong tanong! Ang aming standard rates po ay nagsisimula sa customized package options. Maaari po namin kayong i-schedule para sa detailed consultation.`
        );
      } else {
        setTestResponse(
          `Salamat po sa inyong tanong! Ayon po sa protocol ng ${businessName}, maaari po namin kayong i-schedule. Ano pong date at time ang pinaka-convenient para sa inyo?`
        );
      }
    }, 400);
  };

  const handleTestPlayground = (e: React.FormEvent) => {
    e.preventDefault();
    handleTestPlaygroundWithText(testInput);
  };

  const handleSaveAll = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <FlipText
            className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950"
            duration={1.8}
          >
            AI Persona & Knowledge Base
          </FlipText>
          <p className="text-xs text-zinc-500 mt-1">
            Configure greeting prompts, business details, operating hours, and custom FAQs.
          </p>
        </div>

        <CandyButton
          variant="black"
          onClick={handleSaveAll}
          className="py-2.5 px-4 text-xs font-semibold flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{savedSuccess ? "Saved to Cloud" : "Save Changes"}</span>
        </CandyButton>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Settings, persona prompts, hours, and FAQs saved successfully.</span>
        </div>
      )}

      {/* 1-CLICK INDUSTRY PRESET SWITCHER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-950 font-mono">
              Industry Presets
            </h3>
            <p className="text-xs text-zinc-500">
              Load pre-calibrated Taglish persona, FAQs, and service guidelines in 1 click.
            </p>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Active: <span className="text-zinc-950 font-semibold">{preset.name}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {presetKeys.map((key) => {
            const item = INDUSTRY_PRESETS[key];
            const isCurrent = industryId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => switchIndustry(key)}
                className={`p-3 rounded-xl border text-left transition-all interactive-press cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                    : "bg-zinc-50/70 hover:bg-zinc-100 text-zinc-700 border-zinc-200/80"
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider block ${
                      isCurrent ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {item.categoryName}
                  </span>
                  <p className="text-xs font-semibold mt-0.5 truncate">{item.name}</p>
                </div>
                <p
                  className={`text-[10px] truncate mt-2 font-mono ${
                    isCurrent ? "text-zinc-400" : "text-zinc-400"
                  }`}
                >
                  {item.businessName}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: AI PERSONA */}
      <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
          <Bot className="w-4 h-4 text-blue-600" />
          <span>Voice & Persona Settings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-700 font-medium mb-1">Receptionist Name</label>
            <input
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-medium mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-zinc-700 font-medium mb-1">Call Forwarding Phone</label>
            <input
              type="text"
              value={forwardingPhone}
              onChange={(e) => setForwardingPhone(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-700 font-medium mb-1">
            Taglish Greeting Prompt (Spoken on call connect)
          </label>
          <textarea
            rows={3}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 leading-relaxed focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
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
            Calls outside hours trigger after-hours calendar reservation mode.
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
                  className="rounded text-zinc-950 focus:ring-0 cursor-pointer"
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

      {/* SECTION 3: KNOWLEDGE BASE & PLAYGROUND */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: FAQs Table (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Business FAQs ({faqs.length})</span>
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
                      title="Delete FAQ"
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
            <p className="font-semibold text-zinc-900">Add New Question & Answer</p>
            <input
              type="text"
              placeholder="e.g. May parking po ba kayo?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
            <textarea
              rows={2}
              placeholder="e.g. Opo, may customer parking po kami sa basement..."
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
            />
            <CandyButton
              type="submit"
              variant="black"
              className="py-2 px-3.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </CandyButton>
          </form>
        </div>

        {/* Right: Interactive Playground Tester (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-950">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Interactive Simulator</span>
          </div>
          <p className="text-xs text-zinc-600">
            Test how SagotBot will answer a live caller in Taglish using your current settings.
          </p>

          <form onSubmit={handleTestPlayground} className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Ask e.g. Magkano consultation fee?"
                className="w-full pl-3 pr-10 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 shadow-2xs"
              />
              <button
                type="submit"
                disabled={testing}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 interactive-press cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {preset.quickTestChips.map((chip) => (
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
                  SagotBot Response
                </span>
                <button
                  type="button"
                  onClick={() => handleSpeakResponse(testResponse)}
                  className="flex items-center gap-1 text-[10px] font-mono text-zinc-700 hover:text-zinc-950 cursor-pointer font-medium"
                >
                  <Phone className="w-3 h-3 text-blue-600" />
                  <span>{isSpeaking ? "Stop" : "Listen (TTS)"}</span>
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

export default SettingsPage;
