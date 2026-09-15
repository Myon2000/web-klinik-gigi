"use client";

import { MapPin, Navigation, ExternalLink } from "lucide-react";

export default function LocationSection() {
  const address =
    "Jl. P. Mangkubumi No.I, Kaliwates Kidul, Kaliwates, Kec. Kaliwates, Kabupaten Jember, Jawa Timur 68131";
  const mapsUrl = "https://maps.app.goo.gl/sJpFjj1h8KxxoQ7E7";
  const embedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.1822435533163!2d113.68007917647029!3d-8.18438879184701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd696a79c61e211%3A0x1d2e2b1d9239514d!2sPraktek%20Drg.%20Hetty%20P.%2C%20MPH!5e0!3m2!1sid!2sid!4v1760022409646!5m2!1sid!2sid";

  return (
    <section id="lokasi" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 mb-3 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-rose-600" /> Lokasi Praktik
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Lokasi Klinik
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Kunjungi kami di lokasi yang mudah dijangkau di Kaliwates, Jember.
          </p>
        </div>

        {/* Map & Address Container (Mirip blog drg. Hetty) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-3 sm:p-4 transition-all duration-300 hover:shadow-md">
          {/* Interactive Google Maps Embed with Pin to Praktek Drg. Hetty P., MPH */}
          <div className="w-full rounded-2xl overflow-hidden border border-slate-200/70 h-[360px] sm:h-[440px] relative bg-slate-100">
            <iframe
              title="Lokasi Praktik Drg. Hetty P., MPH Jember"
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen=""
            />
          </div>

          {/* Address & Navigation Card Underneath */}
          <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 bg-slate-50/70 rounded-2xl mt-3 border border-slate-100">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Alamat Lengkap
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 leading-relaxed max-w-xl">
                  {address}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-sm shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Navigation className="w-4 h-4" />
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
