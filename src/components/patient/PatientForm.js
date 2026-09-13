"use client";

import { Calendar, Clock, MapPin, Phone, AlertCircle, ShieldCheck } from "lucide-react";

export default function PatientForm({
  formData,
  onChange,
  onSubmit,
  status,
  cooldown,
}) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Formulir Pendaftaran Pasien</h3>
        </div>

        {status.type === "error" && status.message && (
          <div className="p-4 mb-6 rounded-xl text-sm flex items-start gap-3 bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-medium text-xs sm:text-sm">{status.message}</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={onChange}
              required
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                name="nomor_hp"
                value={formData.nomor_hp}
                onChange={onChange}
                required
                placeholder="08123456789"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Pemberitahuan tanggal dan jam konsultasi akan dikirimkan ke WhatsApp ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tempat Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={onChange}
                required
                placeholder="Contoh: Jakarta"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tanggal Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={onChange}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Alamat Domisili <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <textarea
                name="alamat"
                rows={2}
                value={formData.alamat}
                onChange={onChange}
                required
                placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Keluhan Sakit / Kondisi Gigi <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="keluhan"
              rows={3}
              value={formData.keluhan}
              onChange={onChange}
              required
              placeholder="Ceritakan keluhan Anda (misal: gigi geraham belakang berlubang dan ngilu saat minum dingin sejak 3 hari lalu)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={status.loading || cooldown > 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {status.loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Mengirim Data Pendaftaran...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Mohon tunggu ({cooldown} detik)...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Ajukan Jadwal Konsultasi</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 justify-center text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Data pribadi Anda aman dan hanya digunakan untuk keperluan medis klinik.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
