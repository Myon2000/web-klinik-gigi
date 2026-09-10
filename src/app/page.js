"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    nama: "",
    nomor_hp: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    keluhan: "",
  });
  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", type: "" });

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          loading: false,
          message: "Pendaftaran berhasil! Silakan tunggu pesan WhatsApp dari Admin kami untuk jadwal kedatangan.",
          type: "success"
        });
        setFormData({ nama: "", nomor_hp: "", tempat_lahir: "", tanggal_lahir: "", alamat: "", keluhan: "" });
      } else {
        setStatus({ loading: false, message: "Terjadi kesalahan. Silakan coba lagi.", type: "error" });
      }
    } catch (error) {
      setStatus({ loading: false, message: "Gagal terhubung ke server.", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Klinik Gigi</h2>
        <p className="text-center text-gray-600 mb-6 text-sm">Formulir Pendaftaran Konsultasi Pasien</p>

        {status.message && (
          <div className={`p-4 mb-4 rounded-md text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
            <input type="tel" name="nomor_hp" value={formData.nomor_hp} onChange={handleChange} required placeholder="08..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
              <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
              <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Alamat</label>
            <textarea name="alamat" rows="2" value={formData.alamat} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Keluhan</label>
            <textarea name="keluhan" rows="3" value={formData.keluhan} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <button type="submit" disabled={status.loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {status.loading ? "Mengirim..." : "Kirim Pendaftaran"}
          </button>
        </form>
      </div>
    </div>
  );
}