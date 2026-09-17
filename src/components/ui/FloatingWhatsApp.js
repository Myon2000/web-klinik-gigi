"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const waUrl =
    "https://wa.me/6285157049112?text=Halo%20Admin%20Klinik%20drg%20Hetty,%20saya%20ingin%20konsultasi%20mengenai%20jadwal%20perawatan";

  return (
    <aside aria-label="Kontak Cepat WhatsApp" className="fixed bottom-5 right-5 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi Cepat via WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="hidden sm:inline">Tanya drg. Hetty</span>
      </a>
    </aside>
  );
}
