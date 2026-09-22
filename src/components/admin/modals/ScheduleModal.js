"use client";

import { useState } from "react";
import { Send, X, MessageSquare, Sparkles } from "lucide-react";
import { buildWhatsAppLink, getWhatsAppTemplates, formatTanggal } from "@/lib/formatters";

export default function ScheduleModal({ open, appointment, onClose, onSuccess, setFeedback }) {
  const today = new Date().toISOString().split("T")[0];
  const [scheduleData, setScheduleData] = useState({
    tanggalJanji: appointment?.tanggalJanji
      ? new Date(appointment.tanggalJanji).toISOString().split("T")[0]
      : today,
    jamJanji: appointment?.jamJanji || "16:00",
  });

  const [selectedTemplate, setSelectedTemplate] = useState("konfirmasi");
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Update scheduleData saat id appointment berubah
  const [prevId, setPrevId] = useState(appointment?.id);
  if (appointment && appointment.id !== prevId) {
    const initialDate = appointment.tanggalJanji
      ? new Date(appointment.tanggalJanji).toISOString().split("T")[0]
      : appointment.rencanaKunjungan
      ? appointment.rencanaKunjungan
      : today;
    const initialTime = appointment.jamJanji || "16:00";

    setPrevId(appointment.id);
    setSelectedTemplate("konfirmasi");
    setScheduleData({
      tanggalJanji: initialDate,
      jamJanji: initialTime,
    });

    const initialTemplates = getWhatsAppTemplates({
      nama: appointment.nama,
      tanggalJanji: initialDate,
      jamJanji: initialTime,
      token: appointment.token,
      origin: typeof window !== "undefined" ? window.location.origin : "",
    });
    setCustomMessage(initialTemplates[0]?.text || "");
  }

  if (!open || !appointment) return null;

  // Daftar template yang selalu terbarui dengan tanggal & jam terkini
  const templates = getWhatsAppTemplates({
    nama: appointment.nama,
    tanggalJanji: scheduleData.tanggalJanji,
    jamJanji: scheduleData.jamJanji,
    token: appointment.token,
    origin: typeof window !== "undefined" ? window.location.origin : "",
  });

  const handleTemplateChange = (e) => {
    const tId = e.target.value;
    setSelectedTemplate(tId);
    const chosen = templates.find((t) => t.id === tId);
    if (chosen) {
      setCustomMessage(chosen.text);
    }
  };

  const handleDateOrTimeChange = (field, value) => {
    const updated = { ...scheduleData, [field]: value };
    setScheduleData(updated);

    // Refresh template message dengan tanggal/jam baru
    const refreshedTemplates = getWhatsAppTemplates({
      nama: appointment.nama,
      tanggalJanji: updated.tanggalJanji,
      jamJanji: updated.jamJanji,
      token: appointment.token,
      origin: window.location.origin,
    });
    const chosen = refreshedTemplates.find((t) => t.id === selectedTemplate);
    if (chosen) {
      setCustomMessage(chosen.text);
    }
  };

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
        // Buat link WA dengan teks pesan yang sudah disesuaikan
        const waUrl = buildWhatsAppLink({
          nama,
          nomorHp,
          tanggalJanji: scheduleData.tanggalJanji,
          jamJanji: scheduleData.jamJanji,
          token,
          origin: window.location.origin,
          customMessage: customMessage || undefined,
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
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            <h3 className="font-bold text-sm">Atur Jadwal & Kirim Pesan WhatsApp</h3>
          </div>
          <button onClick={onClose} className="text-emerald-100 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto grow">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-800 text-sm">{appointment.nama}</p>
            <p className="text-slate-500 mt-0.5">WhatsApp: {appointment.nomorHp}</p>
            <p className="text-slate-600 italic mt-1">&ldquo;{appointment.keluhan}&rdquo;</p>
            <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Rencana Kunjungan Pasien:</span>
              <span
                className={`font-semibold ${
                  appointment.rencanaKunjungan
                    ? "text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                    : "text-slate-500 italic"
                }`}
              >
                {appointment.rencanaKunjungan
                  ? formatTanggal(appointment.rencanaKunjungan)
                  : "Bisa kapan saja (Fleksibel)"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Konsultasi <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={scheduleData.tanggalJanji}
                onChange={(e) => handleDateOrTimeChange("tanggalJanji", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Jam Konsultasi <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={scheduleData.jamJanji}
                onChange={(e) => handleDateOrTimeChange("jamJanji", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Pilihan Template WhatsApp */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pilihan Template Pesan WA</span>
              <span className="text-[10px] text-emerald-700 font-normal flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Siap Kirim
              </span>
            </label>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50 font-medium"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Pratinjau & Edit Pesan Teks WhatsApp */}
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>Pratinjau Isi Pesan (Dapat Diedit Bebas)</span>
            </label>
            <textarea
              rows={6}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-mono text-[11px] leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none bg-emerald-50/20"
            />
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
