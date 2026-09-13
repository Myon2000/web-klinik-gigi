"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Komponen Modular Pasien
import ClinicHeader from "@/components/patient/ClinicHeader";
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

  // Cooldown timer untuk tombol submit
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Load informasi status klinik & pengumuman libur
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* 1. Header & Status Klinik */}
      <ClinicHeader clinicInfo={clinicInfo} />

      {/* 2. Konten Utama */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full grow">
        <StepGuide />
        <PatientForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          status={status}
          cooldown={cooldown}
        />
      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Klinik Gigi Dokter. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/login" 
              className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 font-medium"
            >
              <span>Akses Khusus Admin & Dokter</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* 4. Pop-up Modal Notifikasi Berhasil */}
      <SuccessModal
        open={successModal.open}
        data={successModal.data}
        onClose={() => setSuccessModal({ open: false, data: null })}
      />
    </div>
  );
}
