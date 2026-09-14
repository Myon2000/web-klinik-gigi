"use client";

import { useState } from "react";
import { Stethoscope, X, FileText, Sparkles } from "lucide-react";
import { MASTER_TREATMENTS } from "@/lib/analytics";

export default function TreatmentModal({ open, appointment, onClose, onSuccess, setFeedback }) {
  const [selectedMaster, setSelectedMaster] = useState("");
  const [treatmentData, setTreatmentData] = useState({
    tindakan: appointment?.tindakan || "",
    catatanDokter: appointment?.catatanDokter || "",
    biaya: appointment?.biaya ? appointment.biaya.toString() : "",
  });
  const [loading, setLoading] = useState(false);

  // Update treatmentData saat id appointment berubah
  const [prevId, setPrevId] = useState(appointment?.id);
  if (appointment && appointment.id !== prevId) {
    setPrevId(appointment.id);
    setSelectedMaster("");
    setTreatmentData({
      tindakan: appointment.tindakan || "",
      catatanDokter: appointment.catatanDokter || "",
      biaya: appointment.biaya ? appointment.biaya.toString() : "",
    });
  }

  if (!open || !appointment) return null;

  // Handler saat dokter memilih salah satu master tindakan medis dari preset
  const handleSelectMasterTreatment = (e) => {
    const value = e.target.value;
    setSelectedMaster(value);

    if (!value) return;

    const matched = MASTER_TREATMENTS.find((m) => m.name === value);
    if (matched) {
      setTreatmentData((prev) => ({
        ...prev,
        tindakan: matched.name,
        biaya: matched.defaultBiaya.toString(),
      }));
    }
  };

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
          catatanDokter: treatmentData.catatanDokter,
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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            <h3 className="font-bold text-sm">Catatan Penanganan & Pembayaran</h3>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto grow">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-800 text-sm">{appointment.nama}</p>
            <p className="text-slate-500 mt-0.5">Keluhan awal: &ldquo;{appointment.keluhan}&rdquo;</p>
          </div>

          {/* Preset Dropdown Tindakan Medis */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pilihan Tindakan Medis</span>
              <span className="text-[10px] text-blue-600 font-normal flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Rekomendasi Tarif
              </span>
            </label>
            <select
              value={selectedMaster}
              onChange={handleSelectMasterTreatment}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
            >
              <option value="">-- Pilih preset tindakan atau ketik manual di bawah --</option>
              {MASTER_TREATMENTS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} — Rp {m.defaultBiaya.toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          {/* Textarea Tindakan Medis */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Rincian Tindakan Penanganan Dokter <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="Contoh: Pembersihan karang gigi (scaling rahang atas & bawah), penambalan komposit gigi premolar."
              value={treatmentData.tindakan}
              onChange={(e) => setTreatmentData({ ...treatmentData, tindakan: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Textarea Catatan / Instruksi Khusus Dokter */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Catatan / Instruksi Perawatan Khusus Dokter (Opsional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Hindari minum air dingin selama 24 jam. Resep: Amoxicillin 500mg 3x1, Asam Mefenamat 500mg bila nyeri. Jadwal kontrol 1 minggu lagi."
              value={treatmentData.catatanDokter}
              onChange={(e) => setTreatmentData({ ...treatmentData, catatanDokter: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Total Biaya */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Total Biaya Pembayaran (Rp) <span className="text-rose-500">*</span>
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

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
