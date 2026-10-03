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
              className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950"
              duration={1.8}
            >
              Clinic Calendar & Schedule
            </FlipText>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time synchronization with Google Calendar. Every AI call booking automatically locks the doctor&apos;s slot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CandyButton
            onClick={() => setModalOpen(true)}
            variant="black"
            className="py-2.5 px-4 text-xs font-semibold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
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
          className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2 shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Date Navigation & Doctor Filter */}
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
            October 2026 • Smiles Dental Clinic BGC
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Doctor Filter:</span>
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-2xs"
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
            className="p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-all shadow-2xs space-y-4 group hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-950 group-hover:text-blue-600 transition-colors">
                    {apt.patientName}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400">{apt.patientPhone}</p>
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

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-zinc-700">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-mono text-[11px] font-semibold text-zinc-900">{apt.time}</span>
                <span className="text-zinc-400 text-[10px]">({apt.date})</span>
              </div>
              <p className="text-xs text-blue-700 font-medium pl-5">{apt.service}</p>
              <p className="text-[11px] text-zinc-500 pl-5">Attending: {apt.doctor}</p>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1 text-blue-600 font-mono text-[10px] font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Synced to Google Calendar
              </span>
              <button
                onClick={() => setRescheduleApt(apt)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
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
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-3xl bg-white border border-zinc-200 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div>
                    <h3 className="font-bold text-base text-zinc-950">Reschedule Appointment</h3>
                    <p className="text-xs text-zinc-500">{rescheduleApt.patientName} • {rescheduleApt.service}</p>
                  </div>
                  <button
                    onClick={() => setRescheduleApt(null)}
                    className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                    <span className="text-[10px] text-zinc-400 font-mono">Current Slot:</span>
                    <p className="text-zinc-800 font-mono font-medium">{rescheduleApt.time} ({rescheduleApt.date})</p>
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-medium">Select New Time Slot</label>
                    <select
                      value={newRescheduleTime}
                      onChange={(e) => setNewRescheduleTime(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:outline-none focus:border-zinc-900 cursor-pointer"
                    >
                      <option value="11:30 AM - 12:15 PM">11:30 AM - 12:15 PM (Available)</option>
                      <option value="2:00 PM - 2:45 PM">2:00 PM - 2:45 PM (Available)</option>
                      <option value="3:00 PM - 3:45 PM">3:00 PM - 3:45 PM (Available)</option>
                      <option value="4:30 PM - 5:15 PM">4:30 PM - 5:15 PM (Available)</option>
                    </select>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Chair buffer verified: No calendar overlaps detected.</span>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCancelAppointment(rescheduleApt.id, rescheduleApt.patientName)}
                      className="px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                    <CandyButton
                      onClick={handleConfirmReschedule}
                      variant="black"
                      className="flex-1 py-2.5 text-xs font-semibold justify-center"
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
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-3xl bg-white border border-zinc-200 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <h3 className="font-bold text-base text-zinc-950">Manual Patient Booking</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddAppointment} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-zinc-700 mb-1 font-medium">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Liza Soberano"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-700 mb-1 font-medium">Contact Number (PH Mobile)</label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+63 917 123 4567"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-700 mb-1 font-medium">Procedure</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                      >
                        <option>Oral Prophylaxis (Cleaning)</option>
                        <option>Tooth Extraction</option>
                        <option>Laser Teeth Whitening</option>
                        <option>Braces Consultation</option>
                        <option>Root Canal Assessment</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-700 mb-1 font-medium">HMO Coverage</label>
                      <select
                        value={hmoProvider}
                        onChange={(e) => setHmoProvider(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
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
                      <label className="block text-zinc-700 mb-1 font-medium">Attending Doctor</label>
                      <select
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                      >
                        <option>Dr. Reyes, DMD</option>
                        <option>Dr. Santos, Cosmetic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-700 mb-1 font-medium">Time Slot</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:outline-none"
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
                      className="flex-1 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-medium interactive-press cursor-pointer"
                    >
                      Cancel
                    </button>
                    <CandyButton
                      type="submit"
                      variant="black"
                      className="flex-1 py-2.5 text-xs font-semibold justify-center"
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
