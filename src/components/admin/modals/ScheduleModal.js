"use client";

import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/formatters";

export default function ScheduleModal({ open, appointment, onClose, onSuccess, setFeedback }) {
  const [scheduleData, setScheduleData] = useState({ tanggalJanji: "", jamJanji: "16:00" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      const today = new Date().toISOString().split("T")[0];
      const initialDate = appointment.tanggalJanji
        ? new Date(appointment.tanggalJanji).toISOString().split("T")[0]
        : today;

      setScheduleData({
        tanggalJanji: initialDate,
        jamJanji: appointment.jamJanji || "16:00",
      });
    }
  }, [appointment]);

  if (!open || !appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id, token, nama, nomorHp } = appointment;

      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggalJanji: scheduleData.tanggalJanji,
          jamJanji: scheduleData.jamJanji,
          status: "MENUNGGU_KONFIRMASI",
          isRead: true,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Buat link WA dan buka di tab baru
        const waUrl = buildWhatsAppLink({
          nama,
          nomorHp,
          tanggalJanji: scheduleData.tanggalJanji,
          jamJanji: scheduleData.jamJanji,
          token,
          origin: window.location.origin,
        });

        window.open(waUrl, "_blank");
        onClose();
        onSuccess?.();
        setFeedback?.({ message: "Jadwal disimpan & pesan WhatsApp dibuka!", type: "success" });
      } else {
        setFeedback?.({ message: json.error || "Gagal menyimpan jadwal.", type: "error" });
      }
    } catch (err) {
      console.error("Error atur jadwal:", err);
      setFeedback?.({ message: "Terjadi kesalahan saat memproses jadwal.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            <h3 className="font-bold text-sm">Atur Jadwal & Kirim Link WA</h3>
          </div>
          <button onClick={onClose} className="text-emerald-100 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-800 text-sm">{appointment.nama}</p>
            <p className="text-slate-500 mt-0.5">WhatsApp: {appointment.nomorHp}</p>
            <p className="text-slate-600 italic mt-1">"{appointment.keluhan}"</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pilih Tanggal Konsultasi <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={scheduleData.tanggalJanji}
              onChange={(e) => setScheduleData({ ...scheduleData, tanggalJanji: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Pilih Jam Janji Temu <span className="text-rose-500">*</span>
            </label>
            <input
              type="time"
              required
              value={scheduleData.jamJanji}
              onChange={(e) => setScheduleData({ ...scheduleData, jamJanji: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
            <p className="font-semibold">Mekanisme Pengiriman:</p>
            <p className="mt-0.5">
              Menekan tombol di bawah akan otomatis menyimpan jadwal ke sistem, mengubah status menjadi <strong>Menunggu Konfirmasi</strong>, dan membuka WhatsApp Web/Aplikasi dengan teks konfirmasi & link unik kehadiran pasien.
            </p>
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
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Memproses..." : "Simpan & Buka WhatsApp"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
