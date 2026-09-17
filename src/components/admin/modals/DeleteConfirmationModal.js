"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteConfirmationModal({
  open,
  appointment,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1">Hapus Data Pasien?</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Apakah Anda yakin ingin menghapus data antrean untuk pasien:
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-5 text-left text-xs space-y-1">
            <p className="font-bold text-slate-900 truncate">Nama: {appointment.nama}</p>
            <p className="text-slate-600 truncate">No. HP: {appointment.nomorHp}</p>
            <p className="text-slate-500 line-clamp-2">Keluhan: {appointment.keluhan}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => onConfirm(appointment.id)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                <span>Ya, Hapus</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
