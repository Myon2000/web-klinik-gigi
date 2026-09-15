"use client";

import { useState, useEffect } from "react";
import { Clock, AlertCircle, Phone, CalendarCheck2 } from "lucide-react";
import { computeClinicStatus, REGULAR_SCHEDULE, getWIBDate } from "@/lib/clinicSchedule";

export default function ScheduleSection({ clinicInfo }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const status = computeClinicStatus(clinicInfo);
  const currentDayIndex = getWIBDate().getDay();

  return (
    <section id="jadwal" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3 shadow-2xs">
            <Clock className="w-3.5 h-3.5" /> Jadwal Praktik Dokter
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Waktu Operasional Klinik
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Kami siap melayani kebutuhan perawatan gigi Anda setiap hari kerja di Jember.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Status Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-5 transition-all">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Status Klinik Saat Ini
              </span>
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-3 h-3 rounded-full ${status.dotColor} ${
                    status.isOpen ? "animate-pulse" : ""
                  }`}
                />
                <span
                  className={`text-xl font-extrabold ${
                    status.isOpen ? "text-emerald-700" : "text-slate-800"
                  }`}
                >
                  {status.detailLabel}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                {status.explanation}
              </p>
            </div>

            {clinicInfo?.announcement && (
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 space-y-1 shadow-2xs">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Pengumuman Khusus:</span>
                </div>
                <p className="leading-relaxed">{clinicInfo.announcement}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-2.5">
              <p className="font-medium text-slate-600">
                Ingin datang di luar jadwal reguler? Silakan hubungi admin terlebih dahulu melalui WhatsApp.
              </p>
              <a
                href="https://wa.me/6285157049112?text=Halo%20Admin%20Klinik%20drg%20Hetty,%20saya%20ingin%20bertanya%20jadwal%20konsultasi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-50 active:bg-emerald-100 transition-colors shadow-2xs cursor-pointer w-full justify-center"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp: 0851-5704-9112</span>
              </a>
            </div>
          </div>

          {/* Table Hours */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Hari</span>
              <span>Jam Buka Praktik</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {REGULAR_SCHEDULE.map((item) => {
                const isToday = item.dayIndex === currentDayIndex;
                return (
                  <div
                    key={item.day}
                    className={`px-6 py-3.5 flex items-center justify-between transition-colors ${
                      isToday ? "bg-blue-50/70 font-semibold" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isToday ? "text-blue-900 font-extrabold" : "text-slate-800 font-medium"}>
                        {item.day}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
                          Hari Ini
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono text-xs ${
                        item.isOpenDay
                          ? isToday
                            ? "text-blue-700 font-extrabold"
                            : "text-slate-700"
                          : "text-slate-400 italic"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
