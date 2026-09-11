"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Sparkles, 
  ShieldCheck,
  Stethoscope,
  X
} from "lucide-react";

export default function Home() {
  const [clinicInfo, setClinicInfo] = useState({ isOpen: true, announcement: "" });
  const [formData, setFormData] = useState({
    nama: "",
    nomor_hp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    keluhan: "",
  });
  const [status, setStatus] = useState({ loading: false, message: "", type: "", token: null });
  const [cooldown, setCooldown] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, data: null });

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    fetch("/api/clinic-settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setClinicInfo(res.data);
        }
      })
      .catch((err) => console.error("Gagal load info klinik:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", type: "", token: null });

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const submittedData = { nama: formData.nama, nomor_hp: formData.nomor_hp };
        setStatus({ loading: false, message: "", type: "", token: null });
        setFormData({ nama: "", nomor_hp: "", tempat_lahir: "", tanggal_lahir: "", alamat: "", keluhan: "" });
        setCooldown(30); // Beri jeda 30 detik sebelum submit berikutnya
        setSuccessModal({ open: true, data: submittedData });
      } else {
        if (response.status === 429 && result.retryAfter) {
          setCooldown(Math.min(result.retryAfter, 120));
        }
        setStatus({ 
          loading: false, 
          message: result.error || "Terjadi kesalahan. Silakan coba lagi.", 
          type: "error",
          token: null 
        });
      }
    } catch (error) {
      console.error("Gagal submit:", error);
      setStatus({ 
        loading: false, 
        message: "Gagal terhubung ke server. Periksa koneksi internet Anda.", 
        type: "error",
        token: null 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Announcement Bar */}
      {clinicInfo.announcement && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-inner">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{clinicInfo.announcement}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Klinik Gigi Dokter
              </h1>
              <p className="text-xs text-slate-500">Pendaftaran Konsultasi Pasien</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${clinicInfo.isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
              <span className={clinicInfo.isOpen ? "text-emerald-700" : "text-rose-700"}>
                {clinicInfo.isOpen ? "Klinik Buka" : "Klinik Tutup"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero & Process Explanation */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full grow">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Pelayanan Kesehatan Gigi Ramah & Profesional
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Buat Janji Konsultasi Gigi Tanpa Ribet
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Sampaikan keluhan gigi Anda melalui formulir di bawah ini. Admin kami akan menghubungi Anda via WhatsApp untuk memberikan kepastian jadwal pemeriksaan.
          </p>
        </div>

        {/* Step Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Isi Formulir</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tulis data diri dan jelaskan keluhan gigi yang dialami.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Terima Pesan WA</h3>
              <p className="text-xs text-slate-500 mt-0.5">Admin mengatur jadwal lalu mengirim pesan konfirmasi ke nomor WhatsApp Anda.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Konfirmasi & Datang</h3>
              <p className="text-xs text-slate-500 mt-0.5">Klik link konfirmasi dari WhatsApp dan datang sesuai jam yang ditentukan.</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  onChange={handleChange}
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
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Klinik Gigi Dokter. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/login" 
              className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Akses Khusus Admin & Dokter</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Pop-up Modal Notifikasi Berhasil */}
      {successModal.open && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSuccessModal({ open: false, data: null })}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 p-6 sm:p-8 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSuccessModal({ open: false, data: null })}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Pendaftaran Konsultasi Berhasil!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Terima kasih, <strong>{successModal.data?.nama}</strong>. Data pengajuan jadwal Anda telah berhasil dikirim ke sistem klinik kami.
            </p>

            {/* Info Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp: {successModal.data?.nomor_hp}</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Tim admin klinik akan segera meninjau keluhan Anda dan mengirimkan tanggal serta jam pemeriksaan melalui pesan WhatsApp.
              </p>
              <p className="text-emerald-700 font-medium text-[11px] flex items-center gap-1.5 pt-2 border-t border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Mohon pastikan nomor WhatsApp Anda aktif.</span>
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setSuccessModal({ open: false, data: null })}
              className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
