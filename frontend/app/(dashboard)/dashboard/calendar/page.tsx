"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CandyButton } from "@/components/ui/candy-button";
import { FlipText } from "@/components/ui/flip-text";
import { useIndustry } from "@/context/industry-context";
import { AppointmentRecord } from "@/lib/industry-presets";

export function CalendarPage() {
  const { preset, businessName, appointments, setAppointments } = useIndustry();

  const [modalOpen, setModalOpen] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<AppointmentRecord | null>(null);
  const [selectedStaffFilter, setSelectedStaffFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for manual booking
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [service, setService] = useState("");
  const [staffOrLocation, setStaffOrLocation] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 10:45 AM");

  // Reschedule state
  const [newRescheduleTime, setNewRescheduleTime] = useState("3:00 PM - 3:45 PM");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    const newApt: AppointmentRecord = {
      id: `apt-${Date.now()}`,
      clientName,
      clientPhone,
      service: service || `${preset.bookingType} Session`,
      staffOrLocation: staffOrLocation || preset.staffLabel,
      time: timeSlot,
      date: "Tomorrow, Friday",
      status: "confirmed",
      origin: "Manual Entry",
    };

    setAppointments([newApt, ...appointments]);
    setModalOpen(false);
    setClientName("");
    setClientPhone("");
    setService("");
    showToast(`Confirmed for ${clientName} on Google Calendar!`);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleApt) return;
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === rescheduleApt.id
          ? { ...a, time: newRescheduleTime, status: "rescheduled" }
          : a
      )
    );
    showToast(`Rescheduled ${rescheduleApt.clientName} to ${newRescheduleTime}`);
    setRescheduleApt(null);
  };

  const handleCancelAppointment = (id: string, name: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast(`Cancelled booking for ${name}`);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedStaffFilter !== "All" && !apt.staffOrLocation.includes(selectedStaffFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <FlipText
            className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950"
            duration={1.8}
          >
            Calendar & Bookings
          </FlipText>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time synchronization with Google Calendar. Every automated call booking locks the schedule directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CandyButton
            onClick={() => setModalOpen(true)}
            variant="black"
            className="py-2.5 px-4 text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Manual Booking</span>
          </CandyButton>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Date Navigation & Staff Filter */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast("Showing schedule for Previous Week")}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast("Showing schedule for Next Week")}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-semibold text-zinc-950 font-mono">
            October 2026 • {businessName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Filter:</span>
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-2xs"
          >
            <option value="All">All {preset.staffLabel}s</option>
            <option value={preset.adminName}>{preset.adminName}</option>
          </select>
        </div>
      </div>

      {/* Schedule Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all shadow-2xs space-y-4 group hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-950 group-hover:text-blue-600 transition-colors">
                    {apt.clientName}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400">{apt.clientPhone}</p>
                </div>
              </div>

              <span
                className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full ${
                  apt.origin === "AI Phone Call"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                }`}
              >
                {apt.origin}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-zinc-600">
              <div className="flex items-center gap-2 font-medium text-zinc-900">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                <span className="truncate">{apt.service}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>{apt.staffOrLocation}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{apt.time} ({apt.date})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setRescheduleApt(apt)}
                className="text-zinc-600 hover:text-zinc-950 font-medium text-[11px] interactive-press cursor-pointer"
              >
                Reschedule
              </button>
              <button
                onClick={() => handleCancelAppointment(apt.id, apt.clientName)}
                className="text-rose-600 hover:text-rose-700 text-[11px] interactive-press cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RESCHEDULE MODAL */}
      <AnimatePresence>
        {rescheduleApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRescheduleApt(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm p-6 rounded-2xl bg-white border border-zinc-200 shadow-xl space-y-4 z-10"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-sm text-zinc-950">Reschedule Booking</h3>
                <button
                  onClick={() => setRescheduleApt(null)}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-zinc-600">
                  Rescheduling <span className="font-semibold text-zinc-950">{rescheduleApt.clientName}</span> ({rescheduleApt.service})
                </p>

                <div>
                  <label className="block text-zinc-700 mb-1 font-medium">Select New Time Slot</label>
                  <select
                    value={newRescheduleTime}
                    onChange={(e) => setNewRescheduleTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                  >
                    <option>11:00 AM - 11:45 AM</option>
                    <option>1:30 PM - 2:15 PM</option>
                    <option>3:00 PM - 3:45 PM</option>
                    <option>4:30 PM - 5:15 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  onClick={() => setRescheduleApt(null)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmReschedule}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800"
                >
                  Save Reschedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANUAL BOOKING MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-2xl bg-white border border-zinc-200 shadow-xl space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="font-bold text-sm text-zinc-950">
                  Manual {preset.bookingType} Entry
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-700 mb-1 font-medium">
                    {preset.clientLabel} Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1 font-medium">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+63 917 123 4567"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-700 mb-1 font-medium">Service / Request</label>
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      placeholder="e.g. Consultation"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-medium">Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                    >
                      <option>10:00 AM - 10:45 AM</option>
                      <option>11:30 AM - 12:15 PM</option>
                      <option>2:00 PM - 2:45 PM</option>
                      <option>4:00 PM - 4:45 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-700 mb-1 font-medium">{preset.staffLabel}</label>
                  <input
                    type="text"
                    value={staffOrLocation}
                    onChange={(e) => setStaffOrLocation(e.target.value)}
                    placeholder={`e.g. ${preset.adminName}`}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700"
                  >
                    Cancel
                  </button>
                  <CandyButton
                    type="submit"
                    variant="black"
                    className="py-1.5 px-4 text-xs font-semibold"
                  >
                    Confirm Booking
                  </CandyButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CalendarPage;
