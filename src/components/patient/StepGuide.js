"use client";

import { Sparkles } from "lucide-react";

export default function StepGuide() {
  return (
    <>
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Pelayanan Kesehatan Gigi Ramah & Profesional
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Buat Janji Konsultasi Gigi Tanpa Ribet
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Sampaikan keluhan gigi Anda melalui formulir di bawah ini. Admin kami akan menghubungi Anda via WhatsApp untuk memberikan kepastian jadwal pemeriksaan.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
            1
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Isi Formulir</h3>
            <p className="text-xs text-slate-500 mt-0.5">Tulis data diri dan jelaskan keluhan gigi yang dialami.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
            2
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Terima Pesan WA</h3>
            <p className="text-xs text-slate-500 mt-0.5">Admin mengatur jadwal lalu mengirim pesan konfirmasi ke nomor WhatsApp Anda.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
            3
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">Konfirmasi & Datang</h3>
            <p className="text-xs text-slate-500 mt-0.5">Klik link konfirmasi dari WhatsApp dan datang sesuai jam yang ditentukan.</p>
          </div>
        </div>
      </div>
    </>
  );
}
