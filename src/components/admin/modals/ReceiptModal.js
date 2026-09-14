"use client";

import { Printer, X, Stethoscope, CheckCircle2 } from "lucide-react";
import { formatTanggal, formatRupiah } from "@/lib/formatters";

export default function ReceiptModal({ open, appointment, onClose }) {
  if (!open || !appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${new Date().getFullYear()}-${appointment.id.toString().padStart(4, "0")}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-150 print:border-none print:shadow-none print:max-w-none print:w-full">
        {/* Header Bar (Hidden when printed) */}
        <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs">Bukti Kunjungan & Pembayaran Pasien</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 overflow-y-auto grow text-slate-800 text-xs font-sans space-y-6 print:p-0">
          {/* Clinic Letterhead */}
          <div className="text-center pb-5 border-b-2 border-slate-900/80">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 print:border">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight uppercase">
              Klinik Gigi Dokter Gigi
            </h1>
            <p className="text-[11px] text-slate-500">
              Pelayanan Perawatan Gigi & Mulut Ramah, Higienis, dan Terpercaya
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              WhatsApp: {appointment.nomorHp} • Dokumen Rekam Medis & Pembayaran Resmi
            </p>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 print:bg-transparent">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Nomor Bukti</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{invoiceNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Tanggal Kunjungan</span>
              <span className="font-semibold text-slate-900 text-xs">
                {formatTanggal(appointment.tanggalJanji || appointment.createdAt, true)}
              </span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Identitas Pasien
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-slate-500">Nama Pasien</div>
              <div className="col-span-2 font-bold text-slate-900">{appointment.nama}</div>

              <div className="text-slate-500">No. WhatsApp</div>
              <div className="col-span-2 font-semibold text-slate-900">{appointment.nomorHp}</div>

              <div className="text-slate-500">Tempat, Tgl Lahir</div>
              <div className="col-span-2 text-slate-700">
                {appointment.tempatLahir}, {formatTanggal(appointment.tanggalLahir)}
              </div>

              <div className="text-slate-500">Alamat</div>
              <div className="col-span-2 text-slate-700">{appointment.alamat}</div>
            </div>
          </div>

          {/* Treatment & Diagnosis Summary */}
          <div className="space-y-2.5">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rincian Tindakan & Diagnosa
            </h3>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 space-y-2 print:bg-transparent">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block">Keluhan Awal Pasien:</span>
                <p className="italic text-slate-700 text-xs mt-0.5">&ldquo;{appointment.keluhan}&rdquo;</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-[10px] text-slate-500 font-semibold block">Tindakan Medis yang Diberikan:</span>
                <p className="font-bold text-slate-900 text-xs mt-0.5">{appointment.tindakan || "-"}</p>
              </div>

              {appointment.catatanDokter && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] text-blue-700 font-semibold block">
                    Instruksi Khusus / Anjuran Dokter:
                  </span>
                  <p className="text-slate-700 text-xs mt-0.5 whitespace-pre-line">
                    {appointment.catatanDokter}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Total */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200 print:bg-transparent">
            <div>
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Total Biaya Pelayanan
              </span>
              <span className="text-[10px] text-emerald-600">Status Pembayaran: LUNAS</span>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-emerald-800">
                {formatRupiah(appointment.biaya)}
              </span>
            </div>
          </div>

          {/* Doctor Signature Block */}
          <div className="pt-4 flex justify-between items-end text-center text-xs">
            <div className="text-[11px] text-slate-400">
              <p>Terima kasih atas kunjungan Anda.</p>
              <p>Jaga selalu kesehatan gigi & mulut.</p>
            </div>
            <div className="space-y-12">
              <span className="text-[11px] text-slate-500 block">Dokter Gigi Pemeriksa,</span>
              <div className="border-t border-slate-400 pt-1 font-bold text-slate-900 w-36 mx-auto">
                ( Dokter Gigi )
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden when printed) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold cursor-pointer text-xs"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
