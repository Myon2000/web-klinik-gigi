"use client";

import { AlertCircle, Stethoscope } from "lucide-react";

export default function ClinicHeader({ clinicInfo }) {
  return (
    <>
      {/* Top Announcement Bar */}
      {clinicInfo.announcement && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-inner">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{clinicInfo.announcement}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Klinik Gigi Dokter
              </h1>
              <p className="text-xs text-slate-500">Pendaftaran Konsultasi Pasien</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  clinicInfo.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span className={clinicInfo.isOpen ? "text-emerald-700" : "text-rose-700"}>
                {clinicInfo.isOpen ? "Klinik Buka" : "Klinik Tutup"}
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
