"use client";

import { Star, ExternalLink, ThumbsUp } from "lucide-react";

export default function TestimonialsSection() {
  const googleMapsUrl = "https://maps.app.goo.gl/sJpFjj1h8KxxoQ7E7";

  const reviews = [
    {
      id: "handi",
      name: "Handi Wijaya",
      initial: "H",
      avatarBg: "bg-teal-700 text-white",
      badge: "Local Guide",
      stats: "11 ulasan • 16 foto",
      time: "2 tahun lalu",
      rating: 5,
      content: "Dokter gigi paling mantap, pelayanan ramah, buat konsultasi enak dan gak mahal",
      likes: 1,
    },
    {
      id: "dea",
      name: "Dea Ardhia",
      initial: "D",
      avatarBg: "bg-slate-700 text-white",
      badge: null,
      stats: "2 ulasan",
      time: "5 tahun lalu",
      rating: 5,
      content: "Dokter hetty sangat ramah, menyenangkan.",
      likes: 2,
    },
    {
      id: "faiq",
      name: "Faiq Rabbani",
      initial: "F",
      avatarBg: "bg-blue-800 text-white",
      badge: "Local Guide",
      stats: "27 ulasan • 11 foto",
      time: "4 tahun lalu",
      rating: 5,
      content: null, // Sesuai Google Maps: pengulas hanya memberi rating bintang 5 tanpa teks
      likes: 0,
    },
  ];

  return (
    <section id="testimoni" className="py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header with Google Rating Summary */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs mb-4">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">5.0</span>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-medium">Ulasan Google Maps</span>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ulasan Asli Pasien
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Pengalaman nyata pasien yang dipublikasikan secara terbuka di Google Maps Praktek Drg. Hetty P., MPH Jember.
          </p>
        </div>

        {/* Real Google Maps Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* User Header */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full ${r.avatarBg} font-bold text-sm flex items-center justify-center shrink-0 shadow-xs relative`}
                  >
                    {r.initial}
                    {r.badge && (
                      <span
                        title="Local Guide"
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 text-[9px] font-black text-slate-900 flex items-center justify-center border-2 border-white shadow-2xs"
                      >
                        ★
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm truncate leading-snug">
                      {r.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {r.badge && <span className="font-semibold text-amber-700 mr-1">{r.badge} •</span>}
                      <span>{r.stats}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Stars & Time */}
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{r.time}</span>
                </div>

                {/* Review Body (True to Google Maps) */}
                {r.content ? (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    &ldquo;{r.content}&rdquo;
                  </p>
                ) : (
                  <div className="py-5 px-4 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
                    <p className="text-xs text-slate-500 font-medium italic">
                      Memberikan penilaian 5 bintang di Google Maps tanpa ulasan tertulis.
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: Helpful likes count if available */}
              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google Review</span>
                </span>

                {r.likes > 0 && (
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    <span>{r.likes}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button to Open Google Maps */}
        <div className="text-center mt-12">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] shadow-2xs transition-all cursor-pointer"
          >
            <span>Lihat Semua Ulasan di Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
