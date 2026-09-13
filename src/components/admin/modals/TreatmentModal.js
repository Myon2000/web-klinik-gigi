"use client";

import { useState, useEffect } from "react";
import { Stethoscope, X } from "lucide-react";

export default function TreatmentModal({ open, appointment, onClose, onSuccess, setFeedback }) {
  const [treatmentData, setTreatmentData] = useState({ tindakan: "", biaya: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setTreatmentData({
        tindakan: appointment.tindakan || "",
        biaya: appointment.biaya ? appointment.biaya.toString() : "",
      });
    }
  }, [appointment]);

  if (!open || !appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = appointment;
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tindakan: treatmentData.tindakan,
          biaya: treatmentData.biaya,
          status: "SELESAI",
          isRead: true,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        onClose();
        onSuccess?.();
        setFeedback?.({ message: "Data penanganan & pembayaran berhasil disimpan!", type: "success" });
      } else {
        setFeedback?.({ message: json.error || "Gagal menyimpan penanganan.", type: "error" });
      }
    } catch (err) {
      console.error("Error simpan tindakan:", err);
      setFeedback?.({ message: "Gagal menyimpan data tindakan.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            <h3 className="font-bold text-sm">Catatan Penanganan & Pembayaran</h3>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-800 text-sm">{appointment.nama}</p>
            <p className="text-slate-500 mt-0.5">Keluhan awal: "{appointment.keluhan}"</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tindakan Penanganan Dokter Gigi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Contoh: Pembersihan karang gigi (scaling rahang atas & bawah), penambalan komposit gigi premolar."
              value={treatmentData.tindakan}
              onChange={(e) => setTreatmentData({ ...treatmentData, tindakan: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Total Biaya yang Harus Dibayar (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400 font-semibold">Rp</span>
              <input
                type="number"
                min="0"
                step="1000"
                required
                placeholder="250000"
                value={treatmentData.biaya}
                onChange={(e) => setTreatmentData({ ...treatmentData, biaya: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              {loading ? "Menyimpan..." : "Selesaikan Kunjungan Pasien"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
