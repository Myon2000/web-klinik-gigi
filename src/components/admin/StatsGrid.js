"use client";

export default function StatsGrid({ stats, statusFilter, setStatusFilter }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        onClick={() => setStatusFilter("MENUNGGU_JADWAL")}
        className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
          statusFilter === "MENUNGGU_JADWAL"
            ? "border-rose-500 ring-2 ring-rose-200"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">Menunggu Jadwal</span>
          {stats.menungguJadwal > 0 && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
            </span>
          )}
        </div>
        <div className="text-2xl font-extrabold text-rose-600">{stats.menungguJadwal}</div>
        <p className="text-[11px] text-slate-400 mt-1">Pasien baru belum diatur</p>
      </div>

      <div
        onClick={() => setStatusFilter("MENUNGGU_KONFIRMASI")}
        className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
          statusFilter === "MENUNGGU_KONFIRMASI"
            ? "border-amber-500 ring-2 ring-amber-200"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">Menunggu Konfirmasi</span>
        </div>
        <div className="text-2xl font-extrabold text-amber-600">{stats.menungguKonfirmasi}</div>
        <p className="text-[11px] text-slate-400 mt-1">Link WA sudah terkirim</p>
      </div>

      <div
        onClick={() => setStatusFilter("TERKONFIRMASI")}
        className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
          statusFilter === "TERKONFIRMASI"
            ? "border-emerald-500 ring-2 ring-emerald-200"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">Terkonfirmasi</span>
        </div>
        <div className="text-2xl font-extrabold text-emerald-600">{stats.terkonfirmasi}</div>
        <p className="text-[11px] text-slate-400 mt-1">Pasien siap diperiksa</p>
      </div>

      <div
        onClick={() => setStatusFilter("SELESAI")}
        className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
          statusFilter === "SELESAI"
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-500">Selesai Ditangani</span>
        </div>
        <div className="text-2xl font-extrabold text-blue-600">{stats.selesai}</div>
        <p className="text-[11px] text-slate-400 mt-1">Sudah diberi tindakan</p>
      </div>
    </div>
  );
}
