"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";

export default function ExportModal({ open, onClose }) {
  const [exportFilter, setExportFilter] = useState({
    type: "MONTH", // "MONTH" | "YEAR"
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
  });

  if (!open) return null;

  const handleDownloadExcel = () => {
    const params = new URLSearchParams();
    params.set("year", exportFilter.year);
    if (exportFilter.type === "MONTH") {
      params.set("month", exportFilter.month);
    } else {
      params.set("month", "ALL");
    }

    const downloadUrl = `/api/admin/export?${params.toString()}`;
    window.open(downloadUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Ekspor Laporan Excel (.xlsx)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Rentang Waktu
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExportFilter({ ...exportFilter, type: "MONTH" })}
                className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer transition-colors ${
                  exportFilter.type === "MONTH"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Per Bulan
              </button>
              <button
                type="button"
                onClick={() => setExportFilter({ ...exportFilter, type: "YEAR" })}
                className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer transition-colors ${
                  exportFilter.type === "YEAR"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Per 1 Tahun Penuh
              </button>
            </div>
          </div>

          {exportFilter.type === "MONTH" && (
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bulan
              </label>
              <select
                value={exportFilter.month}
                onChange={(e) => setExportFilter({ ...exportFilter, month: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none"
              >
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tahun
            </label>
            <select
              value={exportFilter.year}
              onChange={(e) => setExportFilter({ ...exportFilter, year: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500">
            File Excel yang diunduh mencakup nama pasien, keluhan, tanggal daftar, jadwal janji, status, riwayat tindakan dokter gigi, dan biaya pembayaran.
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
              type="button"
              onClick={handleDownloadExcel}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh File Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
