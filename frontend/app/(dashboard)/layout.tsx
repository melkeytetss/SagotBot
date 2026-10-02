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
  Sparkles,
  Radio,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

interface ClinicBranch {
  id: string;
  name: string;
  location: string;
}

const BRANCHES: ClinicBranch[] = [
  { id: "bgc", name: "Smiles Dental - BGC", location: "Taguig City" },
  { id: "makati", name: "Smiles Dental - Legazpi", location: "Makati City" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigation = [
    { name: "Overview",           href: "/dashboard",          icon: LayoutDashboard },
    { name: "Live Call Logs",     href: "/dashboard/calls",    icon: PhoneCall, badge: "3 New" },
    { name: "Calendar & Bookings", href: "/dashboard/calendar", icon: Calendar },
    { name: "Clinic Persona & FAQs", href: "/dashboard/settings", icon: Settings },
  ];

  // Sidebar nav stagger config
  const sidebarNavContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.055, delayChildren: 0.1 },
    },
  };
  const sidebarNavItem = {
    hidden: { opacity: 0, transform: "translateX(-8px)" },
    show:   { opacity: 1, transform: "translateX(0px)",
              transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] } },
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 76 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="h-screen bg-[#0c0e17] border-r border-white/5 flex flex-col justify-between shrink-0 relative z-30 select-none"
      >
        {/* Top: Brand & Branch Switcher */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                <Bot className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white tracking-tight">SagotBot</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">Clinic Ops</span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/5 interactive-press"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Branch Picker (Multi-Tenancy) */}
          {!sidebarCollapsed ? (
            <div className="relative">
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-white/20 flex items-center justify-between text-left text-xs interactive-press cursor-pointer"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{selectedBranch.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{selectedBranch.location}</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              <AnimatePresence>
                {branchDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute top-full left-0 right-0 mt-1.5 p-1 rounded-xl bg-slate-900 border border-white/15 shadow-2xl z-50 space-y-1"
                  >
                    {BRANCHES.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBranch(b);
                          setBranchDropdownOpen(false);
                        }}
                        className={`w-full p-2 rounded-lg text-left text-xs flex flex-col ${
                          selectedBranch.id === b.id
                            ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <span>{b.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{b.location}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-emerald-400 border border-white/10">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Center: Navigation Links */}
        <motion.nav
          className="p-3 space-y-1 flex-1 overflow-y-auto"
          variants={sidebarNavContainer}
          initial="hidden"
          animate="show"
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div key={item.name} variants={sidebarNavItem}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 interactive-press ${
                    isActive
                      ? "text-slate-950 bg-emerald-400 font-bold shadow-md shadow-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                  {!sidebarCollapsed && item.badge && !isActive && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Bottom: Profile & Logout */}
        <div className="p-4 border-t border-white/5">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
                  DR
                </div>
                <div className="truncate text-xs">
                  <p className="font-semibold text-white truncate">Dr. Reyes, DMD</p>
                  <p className="text-[10px] text-slate-500 truncate">Clinic Owner</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors interactive-press cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex justify-center text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 interactive-press cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.aside>

      {/* MAIN VIEWPORT CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Real-time Inbound Call Banner */}
        <div className="px-6 py-2 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-black border-b border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AnimatedTooltip
              variant="cora"
              shapeColor="#0e121e"
              textColor="#f1f5f9"
              accentColor="#34d399"
              content="SagotBot AI Telephony Engine is online. Answering Taglish calls in 1 ring with zero dropped calls."
            >
              <div className="flex items-center gap-2 cursor-pointer py-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-emerald-400 font-semibold text-[11px]">
                  AI Telephony Status: Online
                </span>
              </div>
            </AnimatedTooltip>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              • Answering calls for {selectedBranch.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <AnimatedTooltip
              variant="smaug"
              shapeColor="#0e121e"
              textColor="#f1f5f9"
              accentColor="#38bdf8"
              content="Clinic scheduling is locked to Philippine Standard Time (UTC+8) across all doctor calendars."
            >
              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 cursor-pointer">
                PST (UTC+8)
              </span>
            </AnimatedTooltip>
            <span className="hidden md:inline">Forwarding active: +63 917 123 4567</span>
          </div>
        </div>

        {/* View Contents */}
        <motion.main
          className="flex-1 overflow-y-auto p-6 sm:p-8"
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          key={pathname}
        >
          <div className="max-w-6xl mx-auto">{children}</div>
        </motion.main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-sm rounded-2xl bg-[#0e111a] border border-white/10 p-6 shadow-2xl text-left space-y-4 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Sign out of SagotBot?</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Smiles Dental Clinic - BGC</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                You will be signed out of your clinic receptionist console. Your active AI phone receptionists will continue taking patient calls 24/7.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold interactive-press transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    router.push("/login");
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/25 interactive-press transition-colors cursor-pointer"
                >
                  Yes, Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
