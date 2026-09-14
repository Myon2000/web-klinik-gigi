"use client";

import { CheckCircle2, Phone, X } from "lucide-react";

export default function SuccessModal({ open, data, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 p-6 sm:p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Pendaftaran Konsultasi Berhasil!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Terima kasih, <strong>{data?.nama}</strong>. Data pengajuan jadwal Anda telah berhasil dikirim ke sistem klinik kami.
        </p>

        {/* Info Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-xs text-slate-700">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>WhatsApp: {data?.nomor_hp}</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Tim admin klinik akan segera meninjau keluhan Anda dan mengirimkan tanggal serta jam pemeriksaan melalui pesan WhatsApp.
          </p>
          <p className="text-emerald-700 font-medium text-[11px] flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Mohon pastikan nomor WhatsApp Anda aktif.</span>
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
        >
          Mengerti & Tutup
        </button>
      </div>
    </div>
  );
}
