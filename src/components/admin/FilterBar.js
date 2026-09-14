"use client";

import { Search } from "lucide-react";

export default function FilterBar({
  totalCount,
  menungguJadwalCount,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
            statusFilter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Semua ({totalCount})
        </button>

        <button
          onClick={() => setStatusFilter("MENUNGGU_JADWAL")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            statusFilter === "MENUNGGU_JADWAL"
              ? "bg-rose-600 text-white"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
          }`}
        >
          <span>Jadwal Baru</span>
          {menungguJadwalCount > 0 && (
            <span className="bg-white text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {menungguJadwalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setStatusFilter("MENUNGGU_KONFIRMASI")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
            statusFilter === "MENUNGGU_KONFIRMASI"
              ? "bg-amber-600 text-white"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
          }`}
        >
          Menunggu Konfirmasi
        </button>

        <button
          onClick={() => setStatusFilter("TERKONFIRMASI")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
            statusFilter === "TERKONFIRMASI"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          Terkonfirmasi
        </button>

        <button
          onClick={() => setStatusFilter("SELESAI")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
            statusFilter === "SELESAI"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
          }`}
        >
          Selesai
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-64">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari pasien / no. WA..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
        />
      </div>
    </div>
  );
}
