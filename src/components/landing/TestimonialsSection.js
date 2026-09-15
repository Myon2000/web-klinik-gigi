"use client";

import { Star, MessageSquareQuote, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Budi Santoso",
      role: "Pasien Scaling & Tambal Gigi",
      content:
        "Pelayanan sangat memuaskan! Dokternya ramah dan sangat profesional. Ruang tindakan higienis dan ruang tunggu juga nyaman. Sangat direkomendasikan di Jember.",
      rating: 5,
    },
    {
      name: "Siti Rahmawati",
      role: "Pasien Pembersihan Karang Gigi",
      content:
        "Hasil scaling gigi saya sangat bersih dan rapi. Prosesnya cepat dan tidak sakit sama sekali. Dokternya sangat teliti dan edukatif menjelaskan cara merawat gigi yang benar.",
      rating: 5,
    },
    {
      name: "Ahmad Fauzi",
      role: "Pasien Whitening Treatment",
      content:
        "Dokternya sabar sekali menjelaskan kondisi gigi saya. Treatment pemutihan giginya memberikan hasil luar biasa cerah dan tetap natural. Pelayanan WhatsApp juga sangat responsif!",
      rating: 5,
    },
  ];

  return (
    <section id="testimoni" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-800 border border-amber-200 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Testimoni Pasien</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kepuasan Pasien Prioritas Kami
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Pengalaman nyata pasien yang telah mempercayakan senyum sehat mereka di Klinik drg. Hetty.
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{r.content}&rdquo;
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                  {r.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{r.name}</h4>
                  <p className="text-[11px] text-slate-400">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
