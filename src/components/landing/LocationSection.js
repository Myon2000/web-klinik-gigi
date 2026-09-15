"use client";

import { MapPin, Navigation, Phone, ExternalLink, ShieldCheck } from "lucide-react";

export default function LocationSection() {
  const address = "Jl. P. Mangkubumi No.I, Kaliwates Kidul, Kaliwates, Kec. Kaliwates, Kabupaten Jember, Jawa Timur 68131";
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Jl.+P.+Mangkubumi+No.I,+Kaliwates+Kidul,+Kaliwates,+Jember";

  return (
    <section id="lokasi" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 mb-3">
            <MapPin className="w-3.5 h-3.5" /> Lokasi Praktik
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Lokasi Klinik Gigi di Jember
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Kunjungi kami di lokasi yang strategis, nyaman, dan mudah dijangkau dari berbagai penjuru kota Jember.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Address & Direction Info Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Alamat Lengkap
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  Klinik drg. Hetty
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {address}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5 text-slate-700">
                  <Navigation className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Kecamatan Kaliwates, dekat pusat kota Jember, parkir aman dan nyaman.</span>
                </div>

                <div className="flex items-start gap-2.5 text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Layanan Konfirmasi WhatsApp: <strong>0851-5704-9112</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-200 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Buka Petunjuk Arah di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Maps Embed */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-h-[300px] sm:min-h-[380px] relative">
            <iframe
              title="Peta Lokasi Klinik drg. Hetty Kaliwates Jember"
              src="https://maps.google.com/maps?q=Jl.+P.+Mangkubumi+No.I,+Kaliwates+Kidul,+Kaliwates,+Kabupaten+Jember,+Jawa+Timur+68131&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[300px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
