"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function ManualPatientModal({ open, onClose, onSuccess, setFeedback }) {
  const [manualData, setManualData] = useState({
    nama: "",
    nomor_hp: "",
    tempat_lahir: "-",
    tanggal_lahir: new Date().toISOString().split("T")[0],
    alamat: "",
    keluhan: "",
    tanggal_janji: new Date().toISOString().split("T")[0],
    jam_janji: "16:00",
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onClose();
        setManualData({
          nama: "",
          nomor_hp: "",
          tempat_lahir: "-",
          tanggal_lahir: new Date().toISOString().split("T")[0],
          alamat: "",
          keluhan: "",
          tanggal_janji: new Date().toISOString().split("T")[0],
          jam_janji: "16:00",
        });
        onSuccess?.();
        setFeedback?.({ message: "Pasien manual berhasil didaftarkan.", type: "success" });
      } else {
        setFeedback?.({ message: json.error || "Gagal mendaftarkan pasien.", type: "error" });
      }
    } catch (err) {
      console.error("Error pendaftaran manual:", err);
      setFeedback?.({ message: "Terjadi kesalahan pada sistem.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <h3 className="font-bold text-sm">Pendaftaran Pasien Manual (Walk-in / Telepon)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto grow">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap Pasien <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nama pasien"
              value={manualData.nama}
              onChange={(e) => setManualData({ ...manualData, nama: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nomor WhatsApp / HP <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="08..."
              value={manualData.nomor_hp}
              onChange={(e) => setManualData({ ...manualData, nomor_hp: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={manualData.tempat_lahir}
                onChange={(e) => setManualData({ ...manualData, tempat_lahir: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={manualData.tanggal_lahir}
                onChange={(e) => setManualData({ ...manualData, tanggal_lahir: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Pasien <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Alamat lengkap"
              value={manualData.alamat}
              onChange={(e) => setManualData({ ...manualData, alamat: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Keluhan Pasien <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Deskripsi keluhan pasien"
              value={manualData.keluhan}
              onChange={(e) => setManualData({ ...manualData, keluhan: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Janji Konsultasi
              </label>
              <input
                type="date"
                value={manualData.tanggal_janji}
                onChange={(e) => setManualData({ ...manualData, tanggal_janji: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Jam Janji
              </label>
              <input
                type="time"
                value={manualData.jam_janji}
                onChange={(e) => setManualData({ ...manualData, jam_janji: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
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
              {loading ? "Menyimpan..." : "Simpan Pasien Manual"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
