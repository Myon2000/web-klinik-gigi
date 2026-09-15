"use client";

import { Calendar, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3845653/pexels-photo-3845653.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/70 backdrop-blur-[2px]" />

      {/* Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-white w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Praktik Dokter Gigi Terpercaya di Kaliwates, Jember</span>
          </div>

          {/* Heading 1 (SEO Keyword Rich) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none mb-6">
            Klinik drg. Hetty
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mt-2">
              Perawatan Gigi Profesional & Nyaman
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-8">
            Solusi kesehatan gigi dan mulut terbaik untuk senyum sehat dan percaya diri Anda. Melayani pembersihan karang gigi (scaling), tambal gigi, cabut gigi, behel, hingga estetika gigi dengan peralatan higienis modern di Jember.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-12">
            <a
              href="#buat-janji"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all cursor-pointer group"
            >
              <Calendar className="w-5 h-5" />
              <span>Buat Janji Temu Online</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#layanan"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <span>Lihat Layanan Kami</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sterilisasi Alat Medis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Minim Rasa Sakit</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Daftar Tanpa Antre</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
