"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  Search,
  Download,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Volume2,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/dashboard/card";
import { Drawer } from "@/components/dashboard/drawer";
import { CandyButton } from "@/components/ui/candy-button";
import { useIndustry } from "@/context/industry-context";
import { CallRecord } from "@/lib/industry-presets";

export default function CallsPage() {
  const { businessName, calls } = useIndustry();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  // Filter call logs
  const filteredCalls = calls.filter((call) => {
    if (selectedLanguage !== "All" && call.language !== selectedLanguage) {
      return false;
    }
    if (selectedStatus === "Booked" && !call.booked) {
      return false;
    }
    if (selectedStatus === "Inquiry" && call.booked) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        call.caller.toLowerCase().includes(q) ||
        call.phone.toLowerCase().includes(q) ||
        call.intent.toLowerCase().includes(q) ||
        call.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredCalls.length === 0) return;
    const headers = ["ID", "Caller", "Phone", "Time", "Duration", "Intent", "Language", "Booked", "Summary"];
    const rows = filteredCalls.map((c) => [
      c.id,
      `"${c.caller.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.time}"`,
      `"${c.duration}"`,
      `"${c.intent.replace(/"/g, '""')}"`,
      c.language,
      c.booked ? "Yes" : "No",
      `"${c.summary.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sagotbot-calls-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Live Call Logs"
        description="Every incoming customer call answered and logged by your automated receptionist."
        action={
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredCalls.length === 0}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 flex items-center gap-2 interactive-press transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Export CSV ({filteredCalls.length})</span>
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by caller, phone, intent, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Calls</option>
              <option value="Booked">Booked Only</option>
              <option value="Inquiry">Inquiries Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span>Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Languages</option>
              <option value="Taglish">Taglish</option>
              <option value="English">English</option>
              <option value="Tagalog">Tagalog</option>
            </select>
          </div>
        </div>
      </div>

      {/* Call Logs Table */}
      <div className="border border-zinc-200/80 rounded-2xl bg-white shadow-2xs overflow-hidden">
        {filteredCalls.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400 space-y-2">
            <PhoneCall className="w-8 h-8 mx-auto text-zinc-300" />
            <p className="font-medium text-zinc-600">No call records found</p>
            <p className="text-[11px] text-zinc-400">
              When callers ring your SagotBot number or you use the test simulator, records will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 border-b border-zinc-200/80 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Caller / Phone</th>
                  <th className="py-3 px-4">Primary Intent</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Duration & Time</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCalls.map((call) => (
                  <tr
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className="hover:bg-zinc-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-950 group-hover:text-blue-600 transition-colors">
                        {call.caller}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">{call.phone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-zinc-800">{call.intent}</span>
                    </td>

                    <td className="py-3 px-4">
                      {call.booked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Booked</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] font-mono font-medium">
                          Inquiry
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono text-zinc-500">{call.language}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-zinc-700">{call.duration}</div>
                      <div className="text-[10px] text-zinc-400">{call.time}</div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="text-zinc-400 group-hover:text-zinc-900 transition-colors inline-flex items-center gap-1 text-[11px]">
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CALL INSPECTOR DRAWER */}
      <Drawer
        open={Boolean(selectedCall)}
        onClose={() => setSelectedCall(null)}
        title={selectedCall ? `Call with ${selectedCall.caller}` : "Call Details"}
        subtitle={selectedCall ? `${selectedCall.phone} • ${selectedCall.time}` : undefined}
        footer={
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedCall(null)}
              className="px-3.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-xs font-medium text-zinc-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        {selectedCall && (
          <div className="space-y-5 text-xs">
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Status</span>
                <span className="font-semibold text-zinc-900 mt-0.5 block">
                  {selectedCall.booked ? "Appointment Booked" : "General Inquiry"}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Call Duration</span>
                <span className="font-semibold font-mono text-zinc-900 mt-0.5 block">
                  {selectedCall.duration}
                </span>
              </div>
            </div>

            {/* AI Call Summary */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-zinc-900 block">AI Summary & Findings</span>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 leading-relaxed text-zinc-700">
                {selectedCall.summary}
              </div>
            </div>

            {/* Conversation Transcript */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900">Conversation Transcript</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {selectedCall.transcripts?.length || 0} Turns
                </span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {selectedCall.transcripts && selectedCall.transcripts.length > 0 ? (
                  selectedCall.transcripts.map((turn, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        turn.speaker === "bot"
                          ? "bg-blue-50/60 border border-blue-100 text-zinc-900"
                          : "bg-zinc-50 border border-zinc-200/80 text-zinc-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-semibold uppercase text-zinc-500">
                          {turn.speaker === "bot" ? "AI Receptionist" : "Caller"}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-400">{turn.timestamp}</span>
                      </div>
                      <p>{turn.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center text-zinc-400 text-xs">
                    No transcript turns recorded for this call.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
