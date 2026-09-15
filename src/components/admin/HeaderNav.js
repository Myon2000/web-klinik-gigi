"use client";

import { Stethoscope, Plus, Download, Settings, LogOut, Volume2, VolumeX } from "lucide-react";

export default function HeaderNav({
  unreadCount,
  isConnected,
  soundEnabled = true,
  onToggleSound,
  onOpenManualModal,
  onOpenExportModal,
  onOpenSettingsModal,
  onLogout,
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 leading-tight">Panel Admin Klinik</h1>
              {unreadCount > 0 && (
                <span className="relative flex h-2.5 w-2.5" title={`${unreadCount} pendaftaran baru`}>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                </span>
              )}
              <div
                className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-slate-50"
                title={isConnected ? "Terhubung ke stream realtime (SSE)" : "Sedang menyambungkan stream..."}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                <span className={isConnected ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                  {isConnected ? "Realtime Aktif" : "Menghubungkan..."}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500">Manajemen Antrean, Tindakan & Laporan</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenManualModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pasien Manual</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            title="Ekspor Laporan Excel"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Ekspor Excel</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
            }`}
            title={soundEnabled ? "Suara Notifikasi: Aktif (Klik untuk membisukan)" : "Suara Notifikasi: Dibisukan / Mute (Klik untuk mengaktifkan)"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-slate-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-amber-600" />
            )}
          </button>

          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Pengaturan Status Klinik & Pengumuman"
          >
            <Settings className="w-4 h-4 text-slate-600" />
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Keluar / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
