"use client";

import { Stethoscope, MapPin, Phone, Clock, Mail, ShieldCheck } from "lucide-react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Klinik drg. Hetty</h3>
                <p className="text-xs text-slate-400">Dokter Gigi Profesional Jember</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Klinik gigi terpercaya yang berkomitmen memberikan pelayanan kesehatan gigi dan mulut terbaik sejak tahun 2015 di Kabupaten Jember.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Protokol Higienis & Peralatan Medis Terstandar</span>
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi Halaman</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Beranda Utama
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-white transition-colors">
                  Layanan Perawatan Gigi
                </a>
              </li>
              <li>
                <a href="#jadwal" className="hover:text-white transition-colors">
                  Jadwal Praktik Dokter
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-white transition-colors">
                  Lokasi & Peta Klinik
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-white transition-colors">
                  Tentang Klinik Kami
                </a>
              </li>
              <li>
                <a href="#buat-janji" className="text-blue-400 font-bold hover:underline">
                  Formulir Buat Janji Online
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak & Lokasi */}
          <div className="lg:col-span-4 space-y-3 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kontak & Alamat</h4>
            <div className="space-y-2.5 text-slate-400">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Jl. P. Mangkubumi No.I, Kaliwates Kidul, Kaliwates, Kec. Kaliwates, Kabupaten Jember, Jawa Timur 68131
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/6285157049112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: 0851-5704-9112
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Senin - Jumat: 16:00 - 21:00 WIB</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {currentYear} Klinik drg. Hetty Jember. Seluruh hak cipta dilindungi.</p>
          <p className="text-[11px] text-slate-500">
            Sistem Informasi & Pendaftaran Janji Temu Konsultasi Pasien
          </p>
        </div>
      </div>
    </footer>
  );
}
