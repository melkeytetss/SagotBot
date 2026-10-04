"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PhoneCall,
  Calendar,
  Settings,
  Bot,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { IndustryProvider, useIndustry } from "@/context/industry-context";
import { ConfirmModal } from "@/components/dashboard/confirm-modal";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { businessName, forwardingPhone, user, userRole, calls, signOut } = useIndustry();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Live Call Logs",
      href: "/dashboard/calls",
      icon: PhoneCall,
      badge: calls.length > 0 ? `${calls.length}` : undefined,
    },
    { name: "Calendar & Bookings", href: "/dashboard/calendar", icon: Calendar },
    { name: "AI Persona & Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // User display name & initials
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account Owner";
  const userEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "SB";

  const handleConfirmSignOut = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f9] text-zinc-900 flex overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 68 : 240 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="h-screen bg-white border-r border-zinc-200/80 flex flex-col justify-between shrink-0 relative z-30 select-none shadow-2xs"
      >
        {/* Top: Brand & Business Details */}
        <div className={`border-b border-zinc-200/80 ${sidebarCollapsed ? "p-2.5" : "p-4"}`}>
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-zinc-950 tracking-tight">SagotBot</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">AI Receptionist</span>
                </div>
              </Link>

              <button
                onClick={() => setSidebarCollapsed(true)}
                className="text-zinc-400 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 interactive-press cursor-pointer transition-colors"
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
                className="text-zinc-400 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-100 interactive-press cursor-pointer transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Active Business Badge (Clean, No bulky dropdown) */}
          {!sidebarCollapsed ? (
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <div className="truncate">
                <p className="font-medium text-xs text-zinc-900 truncate">{businessName}</p>
                <p className="text-[10px] text-zinc-500 font-mono capitalize">{userRole || "Owner"}</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div
                className="w-9 h-9 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-700 border border-zinc-200/80 cursor-pointer"
                title={`${businessName} (${userRole || "Owner"})`}
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

        {/* Bottom: User Profile & Real Sign Out */}
        <div className={`border-t border-zinc-200/80 ${sidebarCollapsed ? "p-2" : "p-4"}`}>
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-zinc-950 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="truncate text-xs">
                  <p className="font-semibold text-zinc-950 truncate">{displayName}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{userEmail || "Connected"}</p>
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
              <div className="w-8 h-8 rounded-full bg-zinc-950 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-2xs" title={displayName}>
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
        {/* Status Bar */}
        <div className="px-6 py-2 bg-white border-b border-zinc-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-zinc-900 font-semibold text-[11px]">
              AI Telephony Engine: Online
            </span>
            <span className="text-zinc-500 text-[11px] hidden sm:inline">
              • Answering calls for {businessName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-600 font-mono">
            {forwardingPhone && (
              <span className="hidden md:inline">Forwarding: {forwardingPhone}</span>
            )}
          </div>
        </div>

        {/* View Contents */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#f8f8f9]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* REAL LOGOUT CONFIRM MODAL */}
      <ConfirmModal
        open={showLogoutConfirm}
        title="Sign Out of SagotBot"
        description="Are you sure you want to end your current session?"
        confirmLabel="Sign Out"
        destructive={true}
        loading={isLoggingOut}
        onConfirm={handleConfirmSignOut}
        onCancel={() => setShowLogoutConfirm(false)}
      />
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
