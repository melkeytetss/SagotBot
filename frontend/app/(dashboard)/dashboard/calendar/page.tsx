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
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CandyButton } from "@/components/ui/candy-button";
import { PageHeader } from "@/components/dashboard/page-header";
import { ConfirmModal } from "@/components/dashboard/confirm-modal";
import { useIndustry } from "@/context/industry-context";
import { AppointmentRecord } from "@/lib/industry-presets";

export function CalendarPage() {
  const {
    businessName,
    appointments,
    services,
    addAppointment,
    rescheduleAppointment,
    cancelAppointment,
  } = useIndustry();

  const [modalOpen, setModalOpen] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<AppointmentRecord | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AppointmentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for manual booking
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [service, setService] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 10:45 AM");
  const [dateSlot, setDateSlot] = useState("Today");

  // Reschedule state
  const [newRescheduleTime, setNewRescheduleTime] = useState("3:00 PM - 3:45 PM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    setIsSubmitting(true);
    const selectedServiceName = service.trim() || (services[0]?.name ?? "Consultation");

    await addAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      service: selectedServiceName,
      date: dateSlot,
      time: timeSlot,
    });

    setIsSubmitting(false);
    setModalOpen(false);
    setClientName("");
    setClientPhone("");
    setService("");
    showToast(`Appointment confirmed and saved for ${clientName}!`);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleApt) return;
    setIsSubmitting(true);
    await rescheduleAppointment(rescheduleApt.id, newRescheduleTime);
    setIsSubmitting(false);
    showToast(`Rescheduled ${rescheduleApt.clientName} to ${newRescheduleTime}`);
    setRescheduleApt(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setIsSubmitting(true);
    await cancelAppointment(cancelTarget.id);
    setIsSubmitting(false);
    showToast(`Booking cancelled for ${cancelTarget.clientName}`);
    setCancelTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Calendar & Bookings"
        description="Live appointments synchronized with your business database. Automated calls lock slots directly."
        action={
          <CandyButton
            onClick={() => setModalOpen(true)}
            variant="black"
            className="py-2.5 px-4 text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Manual Booking</span>
          </CandyButton>
        }
      />

      {/* Notification Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Date Navigation Strip */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast("Navigated to Previous Week")}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast("Navigated to Next Week")}
              className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-semibold text-zinc-950 font-mono">
            {businessName} • {appointments.length} Total Bookings
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Calendar Sync: Active</span>
        </div>
      </div>

      {/* Appointments List / Grid */}
      {appointments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-zinc-200/80 shadow-2xs space-y-3">
          <CalendarIcon className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-950">No Bookings Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Inbound calls handled by your receptionist or manual bookings will appear here in real time.
          </p>
          <div className="pt-2">
            <CandyButton variant="black" onClick={() => setModalOpen(true)} className="py-2 px-3.5 text-xs font-semibold">
              Create Booking
            </CandyButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((apt) => (
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
                    apt.status === "confirmed"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : apt.status === "rescheduled"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                  }`}
                >
                  {apt.origin || "Booking"}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex items-center gap-2 font-medium text-zinc-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  <span className="truncate">{apt.service}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{apt.time} ({apt.date})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(apt)}
                  className="text-zinc-600 hover:text-zinc-950 font-medium text-[11px] interactive-press cursor-pointer"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setCancelTarget(apt)}
                  className="text-rose-600 hover:text-rose-700 text-[11px] interactive-press cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
                    <option>10:00 AM - 10:45 AM</option>
                    <option>11:30 AM - 12:15 PM</option>
                    <option>1:30 PM - 2:15 PM</option>
                    <option>3:00 PM - 3:45 PM</option>
                    <option>4:30 PM - 5:15 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700"
                >
                  Cancel
                </button>
                <CandyButton
                  type="button"
                  variant="black"
                  onClick={handleConfirmReschedule}
                  disabled={isSubmitting}
                  className="py-1.5 px-4 text-xs font-semibold"
                >
                  Save Reschedule
                </CandyButton>
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
                <h3 className="font-bold text-sm text-zinc-950">Add Manual Booking</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAppointment} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-700 mb-1 font-medium">Customer Full Name</label>
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
                  <label className="block text-zinc-700 mb-1 font-medium">Phone Number</label>
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
                    <label className="block text-zinc-700 mb-1 font-medium">Service</label>
                    {services.length > 0 ? (
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        placeholder="e.g. Consultation"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                      />
                    )}
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
                      <option>1:30 PM - 2:15 PM</option>
                      <option>2:00 PM - 2:45 PM</option>
                      <option>4:00 PM - 4:45 PM</option>
                    </select>
                  </div>
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
                    disabled={isSubmitting}
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

      {/* CANCELLATION CONFIRM MODAL */}
      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel Appointment"
        description={`Are you sure you want to cancel the booking for ${cancelTarget?.clientName}?`}
        confirmLabel="Cancel Appointment"
        destructive={true}
        loading={isSubmitting}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}

export default CalendarPage;
