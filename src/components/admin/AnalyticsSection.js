"use client";

import { useState } from "react";
import { BarChart3, Stethoscope, Activity, TrendingUp, DollarSign } from "lucide-react";
import { getComplaintStats, getTreatmentStats } from "@/lib/analytics";
import { formatRupiah } from "@/lib/formatters";

export default function AnalyticsSection({ appointments }) {
  const [activeTab, setActiveTab] = useState("complaints"); // "complaints" | "treatments"

  const complaintStats = getComplaintStats(appointments);
  const treatmentStats = getTreatmentStats(appointments);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Tab Selector */}
      <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Analitik & Tren Klinik</h2>
            <p className="text-[11px] text-slate-500">Statistik keluhan pasien dan tindakan medis dokter</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("complaints")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "complaints"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>Keluhan Pasien</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("treatments")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "treatments"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>Tindakan Medis</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Keluhan Pasien Terbanyak */}
      {activeTab === "complaints" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Distribusi Keluhan Pasien
              </h3>
              <p className="text-[11px] text-slate-400">
                Otomatis dikelompokkan berdasarkan kata kunci keluhan yang diajukan pasien
              </p>
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              Total {appointments.length} Pasien
            </span>
          </div>

          {complaintStats.length === 0 || appointments.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">Belum ada data pendaftaran.</p>
          ) : (
            <div className="space-y-3.5">
              {complaintStats.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-[11px]">{item.count} pasien</span>
                      <span className={`font-bold ${item.textColor} w-10 text-right`}>{item.percentage}%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tindakan Medis Terbanyak & Pendapatan */}
      {activeTab === "treatments" && (
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tindakan Medis Pasien Selesai
              </h3>
              <p className="text-[11px] text-slate-400">
                Peringkat tindakan klinis yang telah ditangani oleh dokter
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs">
                <span className="text-slate-500 text-[11px] block">Total Pendapatan:</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {formatRupiah(treatmentStats.totalPendapatan)}
                </span>
              </div>
            </div>
          </div>

          {treatmentStats.items.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">
              Belum ada data pasien dengan status selesai pemeriksaan.
            </p>
          ) : (
            <div className="space-y-3.5">
              {treatmentStats.items.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-slate-400 text-[11px] ml-2">
                        ({formatRupiah(item.totalBiaya)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-[11px]">{item.count} tindakan</span>
                      <span className="font-bold text-blue-600 w-10 text-right">{item.percentage}%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
