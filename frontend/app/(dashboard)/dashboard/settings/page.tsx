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
  Phone,
  Send,
  Volume2,
  Building2,
  Layers,
  Wand2,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardTitle } from "@/components/dashboard/card";
import { Tabs } from "@/components/dashboard/tabs";
import { CandyButton } from "@/components/ui/candy-button";
import { useIndustry } from "@/context/industry-context";
import { INDUSTRY_PRESETS, IndustryPreset } from "@/lib/industry-presets";

type TabId = "persona" | "hours" | "knowledge" | "simulator";

export default function SettingsPage() {
  const {
    businessName,
    setBusinessName,
    greeting,
    setGreeting,
    forwardingPhone,
    setForwardingPhone,
    botName,
    setBotName,
    hours,
    setHours,
    faqs,
    addFaq,
    deleteFaq,
    services,
    addService,
    deleteService,
    saveSettings,
    applyTemplate,
  } = useIndustry();

  const [activeTab, setActiveTab] = useState<TabId>("persona");
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // New FAQ form state
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [isAddingFaq, setIsAddingFaq] = useState(false);

  // New Service form state
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newPriceMin, setNewPriceMin] = useState("1000");
  const [newPriceMax, setNewPriceMax] = useState("2000");
  const [newDuration, setNewDuration] = useState("45");
  const [isAddingService, setIsAddingService] = useState(false);

  // Playground state
  const [simQuery, setSimQuery] = useState("");
  const [simMessages, setSimMessages] = useState<
    { speaker: "caller" | "bot"; text: string; time: string }[]
  >([
    {
      speaker: "bot",
      text: greeting,
      time: "Just now",
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const ok = await saveSettings();
    setIsSaving(false);
    if (ok) {
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setIsAddingFaq(true);
    await addFaq({
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      category: newCategory.trim() || "General",
    });
    setNewQuestion("");
    setNewAnswer("");
    setIsAddingFaq(false);
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    setIsAddingService(true);
    await addService({
      name: newServiceName.trim(),
      description: newServiceDesc.trim(),
      price_min: Number(newPriceMin) || 0,
      price_max: Number(newPriceMax) || Number(newPriceMin) || 0,
      duration_minutes: Number(newDuration) || 45,
    });
    setNewServiceName("");
    setNewServiceDesc("");
    setIsAddingService(false);
  };

  const handleSimulateCall = (queryText: string) => {
    if (!queryText.trim()) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    // Find match in FAQs or services
    const qLower = queryText.toLowerCase();
    let reply = `Opo, salamat sa pagtanong. Para sa ${queryText}, ikalulugod po naming kayong i-assist sa aming clinic/office.`;

    const matchedFaq = faqs.find(
      (f) =>
        f.question.toLowerCase().includes(qLower) ||
        qLower.includes(f.question.toLowerCase().slice(0, 10))
    );

    if (matchedFaq) {
      reply = `${matchedFaq.answer} May maitutulong pa po ba ako para sa booking ninyo?`;
    } else {
      const matchedService = services.find(
        (s) =>
          s.name.toLowerCase().includes(qLower) ||
          qLower.includes(s.name.toLowerCase().slice(0, 8))
      );
      if (matchedService) {
        reply = `Ang ${matchedService.name} po natin ay ₱${matchedService.price_min.toLocaleString()} to ₱${matchedService.price_max.toLocaleString()} at tumatagal ng ${matchedService.duration_minutes} minutes. Gusto niyo po bang magpa-book ng slot?`;
      } else if (qLower.includes("oras") || qLower.includes("open") || qLower.includes("hours")) {
        reply = `Bukas po kami ayon sa aming weekly schedule, karaniwan mula 9:00 AM hanggang 6:00 PM. Anong oras niyo po gustong magpa-schedule?`;
      }
    }

    setSimMessages((prev) => [
      ...prev,
      { speaker: "caller", text: queryText, time: now },
      { speaker: "bot", text: reply, time: now },
    ]);
    setSimQuery("");
  };

  const speakText = (text: string) => {
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

  const tabs = [
    { id: "persona" as TabId, label: "Persona & Voice" },
    { id: "hours" as TabId, label: "Operating Hours" },
    { id: "knowledge" as TabId, label: "Knowledge Base" },
    { id: "simulator" as TabId, label: "Call Simulator" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="AI Persona & Settings"
        description="Configure your automated Taglish receptionist, knowledge base, and operating hours."
        action={
          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="text-xs text-blue-600 font-medium flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Changes saved to database</span>
              </span>
            )}
            <CandyButton
              variant="black"
              onClick={handleSave}
              disabled={isSaving}
              className="py-2 px-4 text-xs font-semibold flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save Changes</span>
            </CandyButton>
          </div>
        }
      />

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3">
        <Tabs tabs={tabs} value={activeTab} onChange={(id) => setActiveTab(id)} />
        <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
          {businessName} • {services.length} Services • {faqs.length} FAQs
        </span>
      </div>

      {/* TAB 1: PERSONA & VOICE */}
      {activeTab === "persona" && (
        <div className="space-y-6">
          <Card className="space-y-5">
            <div>
              <CardTitle>Receptionist Identity</CardTitle>
              <p className="text-xs text-zinc-500 mt-1">
                Customize how your AI receptionist introduces itself to callers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  AI Receptionist Name
                </label>
                <div className="relative">
                  <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Inbound Greeting Prompt (Taglish)
              </label>
              <textarea
                rows={3}
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors leading-relaxed"
              />
              <p className="text-[10px] text-zinc-500 mt-1">
                The receptionist speaks this greeting within 1 second of answering every inbound call.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Staff Forwarding Phone Number
              </label>
              <div className="relative max-w-md">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="tel"
                  value={forwardingPhone}
                  onChange={(e) => setForwardingPhone(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Calls requiring human triage or urgent escalations are transferred here.
              </p>
            </div>
          </Card>

          {/* Start From Template Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-blue-600" />
                  <span>Start from Industry Template</span>
                </CardTitle>
                <p className="text-xs text-zinc-500 mt-1">
                  Prefill realistic services, greeting, and FAQs tailored to your industry.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {[
                { id: "clinic" as const, name: "Clinic / Health", desc: "Dental checkup, cleaning, HMO FAQs" },
                { id: "salon" as const, name: "Salon & Spa", desc: "Haircut, blowdry, styling reservation" },
                { id: "restaurant" as const, name: "Restaurant / Cafe", desc: "Table reservation, corkage, dietary" },
                { id: "studio" as const, name: "Studio / Services", desc: "Consultations, discovery, package pricing" },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => applyTemplate(tmpl.id)}
                  className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 text-left transition-all interactive-press cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                      {tmpl.name}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-snug">{tmpl.desc}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 mt-3 pt-2 border-t border-zinc-200/60 block">
                    Click to load defaults →
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: OPERATING HOURS */}
      {activeTab === "hours" && (
        <Card className="space-y-5">
          <div>
            <CardTitle>Operating Hours</CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              Calls received outside these hours will inform callers of your schedule and offer next-day booking slots.
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            {hours.map((h, idx) => (
              <div key={h.day} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-36">
                  <input
                    type="checkbox"
                    checked={h.active}
                    onChange={(e) => {
                      const updated = [...hours];
                      updated[idx].active = e.target.checked;
                      setHours(updated);
                    }}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs font-medium ${h.active ? "text-zinc-900" : "text-zinc-400"}`}>
                    {h.day}
                  </span>
                </div>

                {h.active ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => {
                        const updated = [...hours];
                        updated[idx].open = e.target.value;
                        setHours(updated);
                      }}
                      className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-900 focus:bg-white"
                    />
                    <span className="text-xs text-zinc-400">to</span>
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => {
                        const updated = [...hours];
                        updated[idx].close = e.target.value;
                        setHours(updated);
                      }}
                      className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-900 focus:bg-white"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-mono text-zinc-400 italic">Closed</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2">
            <CandyButton variant="black" onClick={handleSave} className="py-2 px-4 text-xs font-semibold">
              Save Hours
            </CandyButton>
          </div>
        </Card>
      )}

      {/* TAB 3: KNOWLEDGE BASE (FAQS & SERVICES) */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          {/* Services Section */}
          <Card className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Services Catalog</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">
                  The receptionist quotes these exact prices and durations to callers.
                </p>
              </div>
            </div>

            {/* Services List */}
            <div className="divide-y divide-zinc-100 border border-zinc-200/80 rounded-xl overflow-hidden bg-white">
              {services.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  No services added yet. Add your first service below.
                </div>
              ) : (
                services.map((srv) => (
                  <div key={srv.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-zinc-50/50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-950">{srv.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                          {srv.duration_minutes} mins
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500">{srv.description}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs font-mono font-semibold text-zinc-900">
                        {srv.price_min === srv.price_max
                          ? `₱${srv.price_min.toLocaleString()}`
                          : `₱${srv.price_min.toLocaleString()} - ₱${srv.price_max.toLocaleString()}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteService(srv.id)}
                        className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                        title="Delete service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Service Form */}
            <form onSubmit={handleCreateService} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
              <span className="text-xs font-semibold text-zinc-900 block">Add New Service</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Service Name (e.g. Tooth Extraction)"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Min Price (₱)</label>
                  <input
                    type="number"
                    value={newPriceMin}
                    onChange={(e) => setNewPriceMin(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Max Price (₱)</label>
                  <input
                    type="number"
                    value={newPriceMax}
                    onChange={(e) => setNewPriceMax(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 mb-1 block">Duration (mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAddingService || !newServiceName}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50 interactive-press cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Service</span>
              </button>
            </form>
          </Card>

          {/* FAQs Section */}
          <Card className="space-y-4">
            <div>
              <CardTitle>Frequently Asked Questions (FAQs)</CardTitle>
              <p className="text-xs text-zinc-500 mt-1">
                Your receptionist uses these questions and answers to resolve caller inquiries instantly.
              </p>
            </div>

            {/* FAQs List */}
            <div className="divide-y divide-zinc-100 border border-zinc-200/80 rounded-xl overflow-hidden bg-white">
              {faqs.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  No FAQs yet. Add common questions below.
                </div>
              ) : (
                faqs.map((faq) => (
                  <div key={faq.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-zinc-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-950">{faq.question}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-relaxed">{faq.answer}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteFaq(faq.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors shrink-0"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add FAQ Form */}
            <form onSubmit={handleCreateFaq} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-3">
              <span className="text-xs font-semibold text-zinc-900 block">Add New FAQ</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Question (e.g. May parking po ba?)"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Parking, HMO)"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <textarea
                rows={2}
                required
                placeholder="Answer (Taglish or English instructions for callers)"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 leading-relaxed"
              />

              <button
                type="submit"
                disabled={isAddingFaq || !newQuestion || !newAnswer}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50 interactive-press cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save FAQ</span>
              </button>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 4: SIMULATOR / TEST PLAYGROUND */}
      {activeTab === "simulator" && (
        <Card className="space-y-4">
          <div>
            <CardTitle>Call Simulator & Test Playground</CardTitle>
            <p className="text-xs text-zinc-500 mt-1">
              Test how your receptionist handles caller questions using your current services and FAQs.
            </p>
          </div>

          {/* Quick Test Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-zinc-500">Quick tests:</span>
            {[
              "Magkano ang services ninyo?",
              "Puwede po ba mag-walk in bukas?",
              "Anong oras po kayo bukas?",
              "Tumatanggap po ba kayo ng card o GCash?",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSimulateCall(chip)}
                className="px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs interactive-press cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Transcript Window */}
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 min-h-[300px] max-h-[420px] overflow-y-auto space-y-3">
            {simMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.speaker === "caller" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-mono text-zinc-400 capitalize">
                    {msg.speaker === "bot" ? botName : "Caller"}
                  </span>
                  <span className="text-[9px] text-zinc-400">{msg.time}</span>
                </div>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.speaker === "caller"
                      ? "bg-zinc-950 text-white rounded-br-xs"
                      : "bg-white border border-zinc-200 text-zinc-900 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.speaker === "bot" && (
                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      className="mt-2 text-[10px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{isSpeaking ? "Stop voice" : "Listen in Taglish voice"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSimulateCall(simQuery);
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              placeholder="Ask a question as an inbound caller (e.g. Magkano po teeth cleaning?)..."
              value={simQuery}
              onChange={(e) => setSimQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 shadow-2xs"
            />
            <CandyButton
              type="submit"
              variant="black"
              disabled={!simQuery.trim()}
              className="py-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </CandyButton>
          </form>
        </Card>
      )}
    </div>
  );
}
