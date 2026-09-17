"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Apakah Klinik drg. Hetty menerima BPJS Kesehatan?",
      a: "Klinik drg. Hetty adalah klinik praktik mandiri dokter gigi swasta, sehingga saat ini belum melayani fasilitas BPJS Kesehatan. Namun kami menerbitkan nota rincian tindakan medis resmi yang dapat Anda gunakan untuk klaim asuransi kesehatan swasta atau reimbursement instansi kantor.",
    },
    {
      q: "Metode pembayaran apa saja yang diterima?",
      a: "Kami menerima pembayaran tunai (cash), transfer bank, serta pembayaran non-tunai berbasis QRIS (BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay, dll) tanpa biaya tambahan.",
    },
    {
      q: "Apakah harus mendaftar janji temu online terlebih dahulu?",
      a: "Sangat dianjurkan untuk mendaftar online melalui formulir di website ini agar Anda mendapatkan kepastian jam kedatangan tanpa antre lama. Bagi pasien darurat sakit gigi atau datang langsung (walk-in), kami tetap melayani sesuai ketersediaan slot jam praktik sore.",
    },
    {
      q: "Kapan jam buka operasional praktik klinik?",
      a: "Praktik buka setiap hari kerja Senin sampai Jumat pukul 16:00 - 21:00 WIB. Hari Sabtu dan Minggu tutup untuk praktik reguler (hari Sabtu khusus bagi pasien dengan reservasi janji khusus yang telah disetujui sebelumnya via WhatsApp).",
    },
    {
      q: "Apakah melayani pemeriksaan dan perawatan gigi anak-anak?",
      a: "Ya, kami melayani perawatan gigi anak dengan pendekatan komunikatif dan ramah, seperti penambalan gigi berlubang, pencabutan gigi susu goyang, pembersihan karang gigi anak, serta edukasi cara menyikat gigi yang menyenangkan.",
    },
    {
      q: "Apa yang perlu dipersiapkan sebelum cabut gigi atau scaling?",
      a: "Pastikan Anda sudah makan sebelum datang ke klinik dan beristirahat cukup. Beritahukan kepada dokter jika memiliki riwayat alergi obat, riwayat tekanan darah tinggi (hipertensi), diabetes, atau sedang hamil agar penanganan anestesi berlangsung aman.",
    },
  ];

  const toggleFaq = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-700 shadow-2xs mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Tanya Jawab Pasien</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Informasi penting seputar metode pembayaran, jadwal kunjungan, dan persiapan perawatan di Klinik drg. Hetty.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50/80 border-blue-200 shadow-2xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
