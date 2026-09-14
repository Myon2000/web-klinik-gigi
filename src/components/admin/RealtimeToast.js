"use client";

import { Bell, X } from "lucide-react";

export default function RealtimeToast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
        <Bell className="w-5 h-5 animate-bounce" />
      </div>
      <div className="grow text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-amber-400">🔔 Pendaftaran Pasien Baru!</span>
          <span className="text-[10px] text-slate-400">{toast.waktu} WIB</span>
        </div>
        <p className="font-semibold text-white mt-1 text-sm">{toast.nama}</p>
        <p className="text-slate-300 line-clamp-1 italic mt-0.5">&ldquo;{toast.keluhan}&rdquo;</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 cursor-pointer"
        title="Tutup Notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
