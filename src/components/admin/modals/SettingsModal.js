"use client";

import { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";

export default function SettingsModal({ open, clinicSettings, setClinicSettings, onClose, setFeedback }) {
  const [localSettings, setLocalSettings] = useState({ isOpen: true, announcement: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clinicSettings) {
      setLocalSettings(clinicSettings);
    }
  }, [clinicSettings]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/clinic-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localSettings),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setClinicSettings(localSettings);
        onClose();
        setFeedback?.({ message: "Pengaturan klinik berhasil diperbarui.", type: "success" });
      } else {
        setFeedback?.({ message: json.error || "Gagal memperbarui pengaturan.", type: "error" });
      }
    } catch (err) {
      console.error("Error simpan pengaturan klinik:", err);
      setFeedback?.({ message: "Terjadi kesalahan pada jaringan.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Pengaturan Status & Info Klinik</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <p className="font-semibold text-slate-900">Status Operasional Klinik</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ditampilkan sebagai indikator buka/tutup di web pasien.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLocalSettings({ ...localSettings, isOpen: !localSettings.isOpen })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                localSettings.isOpen
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
            >
              {localSettings.isOpen ? "BUKA" : "TUTUP"}
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pengumuman Jadwal Libur / Informasi Penting
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Klinik libur pada tanggal 15 - 17 September 2026. Buka kembali hari Senin 18 September."
              value={localSettings.announcement || ""}
              onChange={(e) => setLocalSettings({ ...localSettings, announcement: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Teks ini akan muncul sebagai banner oranye di bagian paling atas website pasien. Kosongkan jika tidak ada pengumuman libur.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Pengaturan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
