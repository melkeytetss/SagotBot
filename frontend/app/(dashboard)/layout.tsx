"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PhoneCall,
  Calendar,
  Settings,
  Bot,
  ChevronDown,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { IndustryProvider, useIndustry } from "@/context/industry-context";
import { INDUSTRY_PRESETS, IndustryPreset } from "@/lib/industry-presets";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { preset, switchIndustry, businessName, forwardingPhone } = useIndustry();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Live Call Logs", href: "/dashboard/calls", icon: PhoneCall, badge: `${preset.calls.length} Logs` },
    { name: "Calendar & Bookings", href: "/dashboard/calendar", icon: Calendar },
    { name: "AI Persona & Knowledge", href: "/dashboard/settings", icon: Settings },
  ];

  const presetsList = Object.values(INDUSTRY_PRESETS);

  // Compute admin initials
  const initials = preset.adminName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8f8f9] text-zinc-900 flex overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 68 : 240 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="h-screen bg-white border-r border-zinc-200/80 flex flex-col justify-between shrink-0 relative z-30 select-none shadow-2xs"
      >
        {/* Top: Brand & Workspace Switcher */}
        <div className={`border-b border-zinc-200/80 ${sidebarCollapsed ? "p-2.5" : "p-4"}`}>
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-zinc-950 tracking-tight">SagotBot</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">{preset.categoryName}</span>
                </div>
              </Link>

              <button
                onClick={() => setSidebarCollapsed(true)}
                className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 interactive-press cursor-pointer"
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 mb-2">
              <Link href="/" className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-xs" title="SagotBot">
                <Bot className="w-4 h-4 stroke-[2.2]" />
              </Link>
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="text-zinc-400 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-100 interactive-press cursor-pointer"
                title="Expand sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Workspace Switcher (1-Click Industry Preset) */}
          {!sidebarCollapsed ? (
            <div className="relative">
              <button
                onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                className="w-full p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 flex items-center justify-between text-left text-xs interactive-press cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Building2 className="w-4 h-4 text-zinc-700 shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-zinc-900 truncate">{businessName}</p>
                    <p className="text-[10px] text-zinc-500 truncate">{preset.name}</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              <AnimatePresence>
                {workspaceDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute top-full left-0 right-0 mt-1.5 p-1 rounded-xl bg-white border border-zinc-200 shadow-lg z-50 space-y-1"
                  >
                    <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                      Industry Presets
                    </div>
                    {presetsList.map((p) => {
                      const isSelected = preset.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchIndustry(p.id);
                            setWorkspaceDropdownOpen(false);
                          }}
                          className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between ${
                            isSelected
                              ? "bg-zinc-100 text-zinc-950 font-semibold"
                              : "text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate">{p.businessName}</p>
                            <p className="text-[10px] text-zinc-400 font-normal truncate">{p.name}</p>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div
                className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 border border-zinc-200/80 cursor-pointer"
                title={`${businessName} (${preset.name})`}
                onClick={() => setSidebarCollapsed(false)}
              >
                <Building2 className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Center: Navigation Links */}
        <nav className={`space-y-1.5 flex-1 overflow-y-auto ${sidebarCollapsed ? "p-2" : "p-3"}`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`relative flex items-center rounded-xl text-xs font-medium transition-colors duration-150 interactive-press ${
                    sidebarCollapsed
                      ? "justify-center w-10 h-10 mx-auto"
                      : "gap-3 px-3 py-2.5"
                  } ${
                    isActive
                      ? "text-zinc-950 bg-zinc-100 font-semibold border border-zinc-200/70 shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-zinc-600" />
                  {!sidebarCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                  {!sidebarCollapsed && item.badge && !isActive && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                      {item.badge}
                    </span>
                  )}
                  {sidebarCollapsed && item.badge && !isActive && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom: Profile & Logout */}
        <div className={`border-t border-zinc-200/80 ${sidebarCollapsed ? "p-2" : "p-4"}`}>
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="truncate text-xs">
                  <p className="font-semibold text-zinc-950 truncate">{preset.adminName}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{preset.adminRole}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors interactive-press cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-2xs" title={preset.adminName}>
                {initials}
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 interactive-press cursor-pointer transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* MAIN VIEWPORT CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Real-time Status Banner */}
        <div className="px-6 py-2 bg-white border-b border-zinc-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AnimatedTooltip
              variant="cora"
              shapeColor="#ffffff"
              textColor="#09090b"
              accentColor="#2563eb"
              content="SagotBot AI Telephony Engine is online. Answering Taglish calls in 1 ring with zero dropped calls."
            >
              <div className="flex items-center gap-2 cursor-pointer py-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-zinc-900 font-semibold text-[11px]">
                  AI Telephony Status: Online
                </span>
              </div>
            </AnimatedTooltip>
            <span className="text-zinc-500 text-[11px] hidden sm:inline">
              • Answering calls for {businessName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
            <AnimatedTooltip
              variant="smaug"
              shapeColor="#ffffff"
              textColor="#09090b"
              accentColor="#2563eb"
              content="Calendar and appointment scheduling locked to Philippine Standard Time (UTC+8)."
            >
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 hover:border-zinc-300 text-zinc-700 cursor-pointer">
                PST (UTC+8)
              </span>
            </AnimatedTooltip>
            <span className="hidden md:inline">Forwarding: {forwardingPhone}</span>
          </div>
        </div>

        {/* View Contents */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#f8f8f9]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-xs rounded-2xl bg-white border border-zinc-200 p-5 shadow-lg text-left space-y-3.5 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">Sign out?</h3>
                  <p className="text-xs text-zinc-500">Are you sure you want to exit?</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium interactive-press transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    router.push("/login");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium shadow-2xs interactive-press transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <IndustryProvider>
      <DashboardShell>{children}</DashboardShell>
    </IndustryProvider>
  );
}
