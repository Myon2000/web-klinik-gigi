"use client";

import {
  Droplets,
  ShieldCheck,
  Smile,
  HeartPulse,
  Stethoscope,
  Activity,
  ArrowRight,
} from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      id: "scaling",
      num: "01",
      title: "Pembersihan Karang Gigi (Scaling)",
      category: "Pencegahan & Kebersihan",
      desc: "Pembersihan ultrasonik mendalam untuk menghilangkan plak dan karang gigi yang mengeras, mencegah radang gusi, serta mengatasi bau mulut.",
      duration: "30 - 45 Menit",
      icon: Droplets,
    },
    {
      id: "tambal",
      num: "02",
      title: "Tambal Gigi Komposit Sinar",
      category: "Restorasi Estetis",
      desc: "Penambalan gigi berlubang menggunakan resin komposit sewarna enamel asli. Kuat untuk mengunyah, tahan lama, dan menyatu alami dengan gigi.",
      duration: "45 - 60 Menit",
      icon: ShieldCheck,
    },
    {
      id: "bleaching",
      num: "03",
      title: "Pemutihan Gigi (Bleaching)",
      category: "Estetika Senyum",
      desc: "Treatment pencerahan warna gigi klinis yang aman untuk enamel, efektif memudarkan noda kopi, teh, dan penuaan agar senyum lebih percaya diri.",
      duration: "60 Menit",
      icon: Smile,
    },
    {
      id: "cabut",
      num: "04",
      title: "Cabut Gigi & Gigi Bungsu",
      category: "Penanganan Bedah Minor",
      desc: "Pencabutan gigi bermasalah atau impaksi gigi bungsu dengan prosedur higienis dan anestesi lokal presisi untuk meminimalkan rasa nyeri.",
      duration: "30 - 60 Menit",
      icon: HeartPulse,
    },
    {
      id: "konsultasi",
      num: "05",
      title: "Pemeriksaan & Konsultasi Gigi",
      category: "Diagnostik Komprehensif",
      desc: "Evaluasi menyeluruh kondisi kesehatan gigi, rongga mulut, dan gusi bersama dokter untuk menemukan akar penyebab keluhan dan rencana terapi.",
      duration: "20 - 30 Menit",
      icon: Stethoscope,
    },
    {
      id: "gusi",
      num: "06",
      title: "Perawatan Gusi & Periodontal",
      category: "Kesehatan Jaringan Mulut",
      desc: "Perawatan khusus untuk gusi berdarah, pembengkakan, sariawan berulang, serta infeksi jaringan penyangga gigi agar gigi tetap kokoh.",
      duration: "30 - 45 Menit",
      icon: Activity,
    },
  ];

  return (
    <section id="layanan" className="py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header: Minimalist & Confident */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>Layanan Praktik Medis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Perawatan Gigi Berkualitas
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Penanganan klinis terstandar dengan peralatan modern dan higienis untuk menjaga kesehatan serta estetika senyum Anda di Kaliwates, Jember.
          </p>
        </div>

        {/* Services Cards Grid: Dribbble-inspired Minimalist Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href="#buat-janji"
                className="group relative bg-white rounded-2xl p-7 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  {/* Top Bar: Icon + Number index */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors duration-300 shadow-2xs">
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors duration-300">
                      {item.num}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <span className="inline-block text-[11px] font-semibold text-blue-700 mb-2 tracking-wide">
                    {item.category}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors duration-200 mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                {/* Card Footer: Metadata & Action Arrow */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-500 transition-colors" />
                    <span>Est. {item.duration}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 font-bold text-blue-600 group-hover:text-blue-700">
                    <span className="text-xs font-semibold">Jadwalkan</span>
                    <div className="w-6 h-6 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
