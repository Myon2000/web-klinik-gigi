"use client";

import { Phone, MapPin, Clock, Send, Stethoscope, Check, FileText } from "lucide-react";
import { formatTanggal, formatRupiah } from "@/lib/formatters";

export default function AppointmentTable({
  appointments,
  loading,
  onOpenScheduleModal,
  onOpenTreatmentModal,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "MENUNGGU_JADWAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Menunggu Jadwal
          </span>
        );
      case "MENUNGGU_KONFIRMASI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Menunggu Konfirmasi Pasien
          </span>
        );
      case "TERKONFIRMASI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Terkonfirmasi
          </span>
        );
      case "SELESAI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" />
            Selesai Ditangani
          </span>
        );
      case "BATAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Batal
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Pasien</th>
              <th className="py-3 px-4">Keluhan & Alamat</th>
              <th className="py-3 px-4">Jadwal Janji</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tindakan & Biaya</th>
              <th className="py-3 px-4 text-right">Aksi Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>Memuat data antrean jadwal...</p>
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="font-medium text-slate-600">Tidak ada jadwal ditemukan.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Coba sesuaikan filter status atau kata kunci pencarian Anda.
                  </p>
                </td>
              </tr>
            ) : (
              appointments.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    !item.isRead ? "bg-rose-50/30" : ""
                  }`}
                >
                  {/* Pasien Column */}
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-start gap-2">
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" title="Belum dibuka" />
                      )}
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.nama}</p>
                        <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{item.nomorHp}</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          TTL: {item.tempatLahir}, {formatTanggal(item.tanggalLahir)}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.sumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Keluhan & Alamat */}
                  <td className="py-3.5 px-4 align-top max-w-xs">
                    <p className="text-slate-800 font-medium line-clamp-2">"{item.keluhan}"</p>
                    <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item.alamat}</span>
                    </p>
                  </td>

                  {/* Jadwal Janji */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    {item.tanggalJanji ? (
                      <div>
                        <p className="font-semibold text-slate-900">{formatTanggal(item.tanggalJanji)}</p>
                        <p className="text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>{item.jamJanji || "-"} WIB</span>
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-rose-500 font-medium italic">Belum ditentukan</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Tindakan & Biaya */}
                  <td className="py-3.5 px-4 align-top max-w-xs">
                    {item.tindakan ? (
                      <div>
                        <p className="font-medium text-slate-800 line-clamp-2">{item.tindakan}</p>
                        <p className="font-bold text-emerald-700 mt-0.5">{formatRupiah(item.biaya)}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">-</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenScheduleModal(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer text-xs shadow-xs"
                        title="Atur Jadwal & Kirim Pesan WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                        <span>Atur & WA</span>
                      </button>

                      <button
                        onClick={() => onOpenTreatmentModal(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition-colors cursor-pointer text-xs"
                        title="Input Tindakan & Tarif Biaya"
                      >
                        <Stethoscope className="w-3 h-3" />
                        <span>Tindakan</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
