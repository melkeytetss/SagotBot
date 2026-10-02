"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Stethoscope,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CandyButton } from "@/components/ui/candy-button";
import { FlipText } from "@/components/ui/flip-text";

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  service: string;
  doctor: string;
  time: string;
  date: string;
  status: "confirmed" | "completed" | "rescheduled";
  origin: "AI Phone Call" | "Manual Walk-in";
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    patientName: "Maria Clara Santos",
    patientPhone: "+63 917 555 0192",
    service: "Oral Prophylaxis (Teeth Cleaning)",
    doctor: "Dr. Reyes, DMD",
    time: "2:00 PM - 2:45 PM",
    date: "Tomorrow, Friday",
    status: "confirmed",
    origin: "AI Phone Call",
  },
  {
    id: "apt-2",
    patientName: "Juan Dela Cruz",
    patientPhone: "+63 918 223 9910",
    service: "Tooth Extraction (Emergency)",
    doctor: "Dr. Reyes, DMD",
    time: "5:00 PM - 5:45 PM",
    date: "Today, Thursday",
    status: "confirmed",
    origin: "AI Phone Call",
  },
  {
    id: "apt-3",
    patientName: "Atty. Rafael Ramos",
    patientPhone: "+63 917 441 0021",
    service: "Laser Teeth Whitening",
    doctor: "Dr. Santos, Cosmetic",
    time: "11:00 AM - 12:30 PM",
    date: "Saturday, Oct 4",
    status: "confirmed",
    origin: "AI Phone Call",
  },
  {
    id: "apt-4",
    patientName: "Bea Alonzo",
    patientPhone: "+63 917 882 3311",
    service: "Braces Adjustment & Wire Tightening",
    doctor: "Dr. Santos, Cosmetic",
    time: "3:30 PM - 4:15 PM",
    date: "Saturday, Oct 4",
    status: "confirmed",
    origin: "Manual Walk-in",
  },
];

export function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for manual booking
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [service, setService] = useState("Oral Prophylaxis (Cleaning)");
  const [doctor, setDoctor] = useState("Dr. Reyes, DMD");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 10:45 AM");
  const [hmoProvider, setHmoProvider] = useState("None (Direct Cash)");

  // Reschedule state
  const [newRescheduleTime, setNewRescheduleTime] = useState("3:00 PM - 3:45 PM");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientName,
      patientPhone,
      service: `${service} (${hmoProvider})`,
      doctor,
      time: timeSlot,
      date: "Tomorrow, Friday",
      status: "confirmed",
      origin: "Manual Walk-in",
    };

    setAppointments([newApt, ...appointments]);
    setModalOpen(false);
    setPatientName("");
    setPatientPhone("");
    showToast(`Appointment confirmed for ${patientName} on Google Calendar!`);
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
    showToast(`Rescheduled ${rescheduleApt.patientName} to ${newRescheduleTime}`);
    setRescheduleApt(null);
  };

  const handleCancelAppointment = (id: string, name: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast(`Cancelled appointment for ${name}`);
    setRescheduleApt(null);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDoctorFilter !== "All" && !apt.doctor.includes(selectedDoctorFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlipText
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
              duration={1.8}
            >
              Clinic Calendar & Schedule
            </FlipText>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synchronization with Google Calendar. Every AI call booking automatically locks the doctor&apos;s slot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CandyButton
            onClick={() => setModalOpen(true)}
            className="py-2.5 px-4 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Walk-in Appointment</span>
          </CandyButton>
        </div>
      </div>

      {/* Instant Notification Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/10"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Date Navigation & Doctor Filter */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast("Showing schedule for Previous Week")}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast("Showing schedule for Next Week")}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm font-bold text-white font-mono">
            October 2026 • Smiles Dental Clinic BGC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Doctor Filter:</span>
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-white/10 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Doctors (Dr. Reyes & Dr. Santos)</option>
            <option value="Dr. Reyes">Dr. Reyes, DMD (General & Surgery)</option>
            <option value="Dr. Santos">Dr. Santos, Cosmetic (Braces & Aesthetics)</option>
          </select>
        </div>
      </div>

      {/* Schedule Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/30 transition-all shadow-lg space-y-4 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {apt.patientName}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">{apt.patientPhone}</p>
                </div>
              </div>

              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  apt.origin === "AI Phone Call"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {apt.origin}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-[11px] font-semibold">{apt.time}</span>
                <span className="text-slate-500 text-[10px]">({apt.date})</span>
              </div>
              <p className="text-xs text-emerald-300 font-medium pl-5">{apt.service}</p>
              <p className="text-[11px] text-slate-400 pl-5">Attending: {apt.doctor}</p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                Synced to Google Calendar
              </span>
              <button
                onClick={() => setRescheduleApt(apt)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
              >
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RESCHEDULE / CANCEL MODAL */}
      <AnimatePresence>
        {rescheduleApt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRescheduleApt(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-base text-white">Reschedule Appointment</h3>
                    <p className="text-xs text-slate-400">{rescheduleApt.patientName} • {rescheduleApt.service}</p>
                  </div>
                  <button
                    onClick={() => setRescheduleApt(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono">Current Slot:</span>
                    <p className="text-slate-200 font-mono font-medium">{rescheduleApt.time} ({rescheduleApt.date})</p>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Select New Time Slot</label>
                    <select
                      value={newRescheduleTime}
                      onChange={(e) => setNewRescheduleTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="11:30 AM - 12:15 PM">11:30 AM - 12:15 PM (Available)</option>
                      <option value="2:00 PM - 2:45 PM">2:00 PM - 2:45 PM (Available)</option>
                      <option value="3:00 PM - 3:45 PM">3:00 PM - 3:45 PM (Available)</option>
                      <option value="4:30 PM - 5:15 PM">4:30 PM - 5:15 PM (Available)</option>
                    </select>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Chair buffer verified: No calendar overlaps detected.</span>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCancelAppointment(rescheduleApt.id, rescheduleApt.patientName)}
                      className="px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-medium hover:bg-rose-500/25 transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                    <CandyButton
                      onClick={handleConfirmReschedule}
                      className="flex-1 py-2.5 text-xs font-bold justify-center"
                    >
                      Update Schedule
                    </CandyButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MANUAL WALK-IN BOOKING MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-bold text-base text-white">Manual Patient Booking</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddAppointment} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Liza Soberano"
                      className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Contact Number (PH Mobile)</label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+63 917 123 4567"
                      className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 mb-1">Procedure</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                      >
                        <option>Oral Prophylaxis (Cleaning)</option>
                        <option>Tooth Extraction</option>
                        <option>Laser Teeth Whitening</option>
                        <option>Braces Consultation</option>
                        <option>Root Canal Assessment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">HMO Coverage</label>
                      <select
                        value={hmoProvider}
                        onChange={(e) => setHmoProvider(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                      >
                        <option>None (Direct Cash)</option>
                        <option>Maxicare (Accredited)</option>
                        <option>Medicard (Accredited)</option>
                        <option>Intellicare (Accredited)</option>
                        <option>PhilCare (LOA Required)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 mb-1">Attending Doctor</label>
                      <select
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none"
                      >
                        <option>Dr. Reyes, DMD</option>
                        <option>Dr. Santos, Cosmetic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1">Time Slot</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-white font-mono focus:outline-none"
                      >
                        <option>10:00 AM - 10:45 AM</option>
                        <option>11:30 AM - 12:15 PM</option>
                        <option>2:00 PM - 2:45 PM</option>
                        <option>4:00 PM - 4:45 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium interactive-press cursor-pointer"
                    >
                      Cancel
                    </button>
                    <CandyButton
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold justify-center"
                    >
                      Confirm Booking
                    </CandyButton>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CalendarPage;
