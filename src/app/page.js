"use client";

import { useState, useEffect } from "react";

// Komponen Modular Landing Page
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ServicesSection from "@/components/landing/ServicesSection";
import WhyUsSection from "@/components/landing/WhyUsSection";
import ScheduleSection from "@/components/landing/ScheduleSection";
import LocationSection from "@/components/landing/LocationSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FooterSection from "@/components/landing/FooterSection";

// Komponen Formulir & Pop-up Pasien
import StepGuide from "@/components/patient/StepGuide";
import PatientForm from "@/components/patient/PatientForm";
import SuccessModal from "@/components/patient/SuccessModal";

export default function Home() {
  const [clinicInfo, setClinicInfo] = useState({ isOpen: true, announcement: "" });
  const [formData, setFormData] = useState({
    nama: "",
    nomor_hp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    keluhan: "",
  });
  const [status, setStatus] = useState({ loading: false, message: "", type: "", token: null });
  const [cooldown, setCooldown] = useState(0);
  const [successModal, setSuccessModal] = useState({ open: false, data: null });

  // Cooldown timer untuk tombol submit anti-spam
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Memuat data status buka/tutup klinik & banner libur dari database
  useEffect(() => {
    fetch("/api/clinic-settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setClinicInfo(res.data);
        }
      })
      .catch((err) => console.error("Gagal load info klinik:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", type: "", token: null });

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const submittedData = { nama: formData.nama, nomor_hp: formData.nomor_hp };
        setStatus({ loading: false, message: "", type: "", token: null });
        setFormData({ nama: "", nomor_hp: "", tempat_lahir: "", tanggal_lahir: "", alamat: "", keluhan: "" });
        setCooldown(30); // Cooldown 30 detik untuk cegah spam
        setSuccessModal({ open: true, data: submittedData });
      } else {
        if (response.status === 429 && result.retryAfter) {
          setCooldown(Math.min(result.retryAfter, 120));
        }
        setStatus({ 
          loading: false, 
          message: result.error || "Terjadi kesalahan. Silakan coba lagi.", 
          type: "error",
          token: null 
        });
      }
    } catch (error) {
      console.error("Gagal submit pendaftaran:", error);
      setStatus({ 
        loading: false, 
        message: "Gagal terhubung ke server. Periksa koneksi internet Anda.", 
        type: "error",
        token: null 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* 1. Navbar dengan Indikator Status Praktik */}
      <Navbar clinicInfo={clinicInfo} />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Layanan Perawatan Gigi (Scaling, Tambal, Whitening, Cabut, dll.) */}
      <ServicesSection />

      {/* 4. Tentang Kami & Mengapa Memilih Klinik drg. Hetty */}
      <WhyUsSection />

      {/* 5. Jadwal Buka & Status Operasional Real-time */}
      <ScheduleSection clinicInfo={clinicInfo} />

      {/* 6. Lokasi & Peta Klinik di Kaliwates Jember */}
      <LocationSection />

      {/* 7. Testimoni Pasien */}
      <TestimonialsSection />

      {/* 8. Formulir Pendaftaran & Buat Janji Konsultasi Online */}
      <section id="buat-janji" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <StepGuide />
          <PatientForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            status={status}
            cooldown={cooldown}
          />
        </div>
      </section>

      {/* 9. Footer Lengkap Kontak & Alamat Jember */}
      <FooterSection />

      {/* 10. Pop-up Modal Notifikasi Berhasil */}
      <SuccessModal
        open={successModal.open}
        data={successModal.data}
        onClose={() => setSuccessModal({ open: false, data: null })}
      />
    </div>
  );
}
