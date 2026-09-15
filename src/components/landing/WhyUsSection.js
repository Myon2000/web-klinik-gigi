"use client";

import { Award, Users, HeartHandshake, Sparkles, CheckCircle2 } from "lucide-react";

export default function WhyUsSection() {
  const stats = [
    { number: "10+", label: "Tahun Pengalaman", desc: "Melayani masyarakat Jember sejak tahun 2015" },
    { number: "5.000+", label: "Pasien Puas", desc: "Telah mempercayakan kesehatan senyum mereka" },
    { number: "100%", label: "Dedikasi Pelayanan", desc: "Standar sterilisasi dan penanganan higienis" },
  ];

  return (
    <section id="tentang" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Tentang Klinik Kami</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Mengapa Memilih Klinik drg. Hetty?
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Sejak tahun 2015, Klinik drg. Hetty telah melayani ribuan pasien dengan perawatan gigi berkualitas tinggi di Kabupaten Jember. Dengan dokter gigi berpengalaman dan peralatan modern yang steril, kami berkomitmen memberikan pelayanan terbaik untuk kesehatan gigi dan senyum indah Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Peralatan higienis dengan protokol sterilisasi berlapis.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Konsultasi komunikatif, ramah, dan solutif.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Prosedur perawatan yang minim rasa sakit.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Pendaftaran online mudah dan kepastian jadwal via WhatsApp.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Statistics Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {stats.map((s, idx) => (
              <div
                key={s.label}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-5 hover:bg-blue-50/40 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                  {s.number}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">{s.label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
