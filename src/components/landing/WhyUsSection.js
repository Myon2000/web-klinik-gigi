"use client";

import { Award, Users, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function WhyUsSection() {
  const stats = [
    {
      number: "10+",
      suffix: "Tahun",
      label: "Pengalaman Praktik",
      desc: "Melayani kesehatan gigi masyarakat Jember sejak tahun 2015 dengan standar medis terpercaya.",
      icon: Award,
    },
    {
      number: "5.000+",
      suffix: "Pasien",
      label: "Pasien Puas & Tersenyum",
      desc: "Telah mempercayakan perawatan pencegahan hingga penanganan masalah gigi keluarga.",
      icon: Users,
    },
    {
      number: "100%",
      suffix: "Higienis",
      label: "Dedikasi & Sterilisasi",
      desc: "Standar sterilisasi autoklaf berlapis untuk keselamatan dan kenyamanan setiap pasien.",
      icon: HeartHandshake,
    },
  ];

  const benefits = [
    "Peralatan higienis dengan protokol sterilisasi autoklaf berlapis.",
    "Konsultasi komunikatif, ramah, edukatif, dan solutif.",
    "Prosedur perawatan modern yang minim rasa sakit.",
    "Pendaftaran online mudah tanpa antre panjang via WhatsApp.",
  ];

  return (
    <section id="tentang" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Tentang Klinik Kami</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Mengapa Memilih Klinik drg. Hetty?
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Sejak tahun 2015, Klinik drg. Hetty telah melayani ribuan pasien dengan perawatan gigi berkualitas tinggi di Kabupaten Jember. Dengan dokter gigi berpengalaman dan peralatan modern yang steril, kami berkomitmen memberikan pelayanan terbaik untuk kesehatan gigi dan senyum indah Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-blue-50/40 hover:border-blue-100 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed font-medium text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Statistics Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4 sm:gap-5"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                  <s.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                      {s.number}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                      {s.suffix}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 leading-snug">
                    {s.label}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
