"use client";

import { X, User, Phone, MapPin, FileText, Stethoscope, Send } from "lucide-react";
import { formatTanggal, formatRupiah, calculateAge } from "@/lib/formatters";

export default function PatientDetailModal({ open, appointment, onClose, onOpenSchedule, onOpenTreatment }) {
  if (!open || !appointment) return null;

  const age = calculateAge(appointment.tanggalLahir);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Detail Informasi Pasien</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer" title="Tutup">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto grow space-y-4 text-xs">
          {/* Patient Overview Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">{appointment.nama}</h4>
              <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                Daftar via {appointment.sumber}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-medium text-slate-700">{appointment.nomorHp}</span>
              </span>
              <span>
                TTL: {appointment.tempatLahir}, {formatTanggal(appointment.tanggalLahir)} {age !== null && `(${age} tahun)`}
              </span>
            </div>
          </div>

          {/* Alamat Domisili */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Alamat Domisili</span>
            </span>
            <p className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 text-slate-800 leading-relaxed">
              {appointment.alamat}
            </p>
          </div>

          {/* Keluhan Pasien */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Keluhan Gigi Pasien</span>
            </span>
            <p className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 text-slate-800 leading-relaxed italic">
              &ldquo;{appointment.keluhan}&rdquo;
            </p>
          </div>

          {/* Status & Waktu Janji */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Jadwal Janji Temu</span>
              {appointment.tanggalJanji ? (
                <div>
                  <p className="font-semibold text-slate-900">{formatTanggal(appointment.tanggalJanji, true)}</p>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">Pukul {appointment.jamJanji || "-"} WIB</p>
                </div>
              ) : (
                <span className="text-rose-600 font-bold italic">Belum ditentukan</span>
              )}
            </div>

            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Status Terkini</span>
              <span className="font-bold text-slate-800 text-xs block">{appointment.status}</span>
              <span className="text-[10px] text-slate-400 block">
                Didaftarkan: {formatTanggal(appointment.createdAt, true)}
              </span>
            </div>
          </div>

          {/* Tindakan & Catatan Dokter (Jika ada) */}
          {(appointment.tindakan || appointment.catatanDokter || appointment.biaya) && (
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2.5">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                <span>Hasil Tindakan Medis Dokter</span>
              </span>

              {appointment.tindakan && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Tindakan Medis:</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{appointment.tindakan}</p>
                </div>
              )}

              {appointment.catatanDokter && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Catatan / Resep:</span>
                  <p className="text-slate-700 mt-0.5 whitespace-pre-line">{appointment.catatanDokter}</p>
                </div>
              )}

              {appointment.biaya && (
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Total Biaya:</span>
                  <span className="text-sm font-extrabold text-emerald-700">{formatRupiah(appointment.biaya)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold cursor-pointer text-xs"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSchedule?.(appointment);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Atur Jadwal / WA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTreatment?.(appointment);
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Input Tindakan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
