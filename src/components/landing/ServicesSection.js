"use client";

import { Sparkles, ShieldCheck, HeartPulse, Stethoscope, Smile, Activity, ArrowUpRight } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      id: "scaling",
      title: "Pembersihan Karang Gigi (Scaling)",
      desc: "Scaling ultrasonik profesional untuk membersihkan plak, karang gigi, dan noda membandel serta mencegah radang gusi dan bau mulut.",
      icon: Sparkles,
      tag: "Populer",
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    },
    {
      id: "tambal",
      title: "Tambal Gigi Komposit",
      desc: "Restorasi gigi berlubang menggunakan material komposit sinar sewarna gigi alami yang kuat, estetis, dan tahan lama.",
      icon: ShieldCheck,
      tag: "Esensial",
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "bleaching",
      title: "Pemutihan Gigi (Whitening)",
      desc: "Treatment bleaching klinis untuk mencerahkan warna gigi yang kusam atau kuning agar senyum Anda tampak lebih cerah dan percaya diri.",
      icon: Smile,
      tag: "Estetika",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: "cabut",
      title: "Cabut Gigi & Gigi Bungsu",
      desc: "Prosedur ekstraksi gigi bermasalah atau pencabutan gigi bungsu (odontektomi) dengan anestesi lokal yang aman dan minim rasa sakit.",
      icon: HeartPulse,
      tag: "Bedah Minor",
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      id: "konsultasi",
      title: "Konsultasi & Pemeriksaan Gigi",
      desc: "Pemeriksaan menyeluruh kondisi rongga mulut dan gigi dengan evaluasi dokter gigi profesional untuk menemukan solusi perawatan terbaik.",
      icon: Stethoscope,
      tag: "Diagnostik",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "gusi",
      title: "Perawatan Gusi & Jaringan Mulut",
      desc: "Penanganan gusi berdarah, bengkak, sariawan, dan penyakit periodontal guna menjaga gigi tetap tertanam kuat dan sehat.",
      icon: Activity,
      tag: "Periodontal",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <section id="layanan" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-700 border border-blue-200 mb-3">
            Layanan Perawatan Gigi Terlengkap
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Layanan Klinik drg. Hetty
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Berbagai perawatan gigi profesional untuk kesehatan, kenyamanan, dan keindahan senyum keluarga Anda di Kaliwates, Jember.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#buat-janji"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group/link"
                  >
                    <span>Daftar Janji Konsultasi</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
