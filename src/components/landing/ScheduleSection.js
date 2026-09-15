"use client";

import { Clock, Calendar, AlertCircle, CheckCircle2, Phone } from "lucide-react";

export default function ScheduleSection({ clinicInfo }) {
  const scheduleList = [
    { day: "Senin", hours: "16:00 - 21:00 WIB", open: true },
    { day: "Selasa", hours: "16:00 - 21:00 WIB", open: true },
    { day: "Rabu", hours: "16:00 - 21:00 WIB", open: true },
    { day: "Kamis", hours: "16:00 - 21:00 WIB", open: true },
    { day: "Jumat", hours: "16:00 - 21:00 WIB", open: true },
    { day: "Sabtu", hours: "Tutup (Kecuali Janji Khusus)", open: false },
    { day: "Minggu", hours: "Tutup", open: false },
  ];

  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
  // map 1->Senin, 2->Selasa, 3->Rabu, 4->Kamis, 5->Jumat, 6->Sabtu, 0->Minggu
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = dayNames[todayIndex];

  return (
    <section id="jadwal" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
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
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Status Klinik Saat Ini
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    clinicInfo?.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  }`}
                />
                <span
                  className={`text-xl font-extrabold ${
                    clinicInfo?.isOpen ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {clinicInfo?.isOpen ? "Buka Sekarang" : "Tutup Sekarang"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Praktik sore - malam: <strong>16:00 - 21:00 WIB</strong>
              </p>
            </div>

            {clinicInfo?.announcement && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Pengumuman Khusus:</span>
                </div>
                <p className="leading-relaxed">{clinicInfo.announcement}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-medium">
                Ingin datang di luar jadwal reguler? Silakan hubungi admin terlebih dahulu melalui WhatsApp.
              </p>
              <a
                href="https://wa.me/6285157049112?text=Halo%20Admin%20Klinik%20drg%20Hetty,%20saya%20ingin%20bertanya%20jadwal%20konsultasi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: 0851-5704-9112</span>
              </a>
            </div>
          </div>

          {/* Table Hours */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
              <span>Hari</span>
              <span>Jam Buka Praktik</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {scheduleList.map((item) => {
                const isToday = item.day === currentDayName;
                return (
                  <div
                    key={item.day}
                    className={`px-6 py-3.5 flex items-center justify-between transition-colors ${
                      isToday ? "bg-blue-50/60 font-semibold" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isToday ? "text-blue-900 font-bold" : "text-slate-800"}>
                        {item.day}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Hari Ini
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono text-xs ${
                        item.open
                          ? isToday
                            ? "text-blue-700 font-bold"
                            : "text-slate-700"
                          : "text-slate-400 italic"
                      }`}
                    >
                      {item.hours}
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
