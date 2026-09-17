"use client";

import { useState } from "react";
import { Calendar, Clock, ChevronDown, ChevronUp, UserCheck, Send, Stethoscope, CheckCircle2 } from "lucide-react";
import { formatTanggal } from "@/lib/formatters";
import { getWIBDate } from "@/lib/clinicSchedule";

export default function TodayAgendaCard({
  appointments = [],
  onOpenScheduleModal,
  onOpenTreatmentModal,
  onOpenPatientDetail,
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Waktu hari ini dalam format YYYY-MM-DD WIB
  const wibToday = getWIBDate();
  const todayDateStr = wibToday.toISOString().split("T")[0];

  // Filter pasien yang memiliki tanggalJanji hari ini
  const todayPatients = appointments.filter((app) => {
    if (!app.tanggalJanji) return false;
    const appDateStr = new Date(app.tanggalJanji).toISOString().split("T")[0];
    return appDateStr === todayDateStr && app.status !== "BATAL";
  }).sort((a, b) => {
    const timeA = a.jamJanji || "99:99";
    const timeB = b.jamJanji || "99:99";
    return timeA.localeCompare(timeB);
  });

  const completedCount = todayPatients.filter((p) => p.status === "SELESAI").length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden mb-6 transition-all">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Agenda Pasien Hari Ini
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {todayPatients.length} Pasien
              </span>
              {completedCount > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 hidden sm:inline">
                  {completedCount} Selesai
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatTanggal(wibToday)} • Praktik Sore (16:00 - 21:00 WIB)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
        >
          <span>{collapsed ? "Tampilkan" : "Sembunyikan"}</span>
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-5">
          {todayPatients.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">
                Belum ada jadwal pasien yang terdaftar untuk praktik hari ini.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Gunakan tombol &quot;Atur & WA&quot; pada tabel antrean di bawah untuk menetapkan jam janji pasien.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {todayPatients.map((patient) => {
                const isFinished = patient.status === "SELESAI";
                return (
                  <div
                    key={patient.id}
                    className={`rounded-xl p-4 border transition-all ${
                      isFinished
                        ? "bg-slate-50/80 border-slate-200 text-slate-500"
                        : "bg-white border-blue-200 shadow-2xs hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onOpenPatientDetail?.(patient)}
                          className="font-bold text-xs text-slate-900 hover:text-blue-600 text-left truncate block cursor-pointer"
                        >
                          {patient.nama}
                        </button>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {patient.nomorHp}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          {patient.jamJanji || "16:00"} WIB
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 mb-3">
                      <span className="font-medium text-slate-700">Keluhan:</span> {patient.keluhan}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isFinished
                            ? "bg-emerald-100 text-emerald-800"
                            : patient.status === "TERKONFIRMASI"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isFinished ? "Selesai" : patient.status === "TERKONFIRMASI" ? "Terkonfirmasi" : "Menunggu"}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenScheduleModal?.(patient)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Hubungi via WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenTreatmentModal?.(patient)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Input Tindakan Medis"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
