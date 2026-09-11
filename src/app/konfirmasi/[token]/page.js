"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  User, 
  FileText, 
  ArrowLeft,
  Stethoscope,
  MessageCircle
} from "lucide-react";

export default function KonfirmasiJadwalPage() {
  const params = useParams();
  const token = params?.token;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    if (!token) return;

    fetch(`/api/appointments/confirm?token=${token}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setAppointment(res.data);
        } else {
          setFeedback({ message: res.error || "Jadwal tidak ditemukan.", type: "error" });
        }
      })
      .catch((err) => {
        console.error("Gagal load jadwal:", err);
        setFeedback({ message: "Gagal terhubung ke server.", type: "error" });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setSubmitting(true);
    setFeedback({ message: "", type: "" });

    try {
      const res = await fetch("/api/appointments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAppointment(data.data);
        setFeedback({
          message: "Terima kasih! Jadwal kunjungan Anda telah berhasil terkonfirmasi.",
          type: "success",
        });
      } else {
        setFeedback({
          message: data.error || "Gagal mengonfirmasi jadwal.",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Gagal konfirmasi:", err);
      setFeedback({ message: "Terjadi kesalahan pada jaringan.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm w-full">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700">Memuat rincian jadwal...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Tautan Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mb-6">
            {feedback.message || "Tautan konfirmasi ini tidak valid atau sudah kedaluwarsa."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    );
  }

  const isConfirmed = appointment.status === "TERKONFIRMASI";
  const isDone = appointment.status === "SELESAI";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white text-center">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xs rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold">Konfirmasi Jadwal Konsultasi</h1>
          <p className="text-xs text-blue-100 mt-1">Klinik Gigi Dokter Gigi</p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5">
          {feedback.message && (
            <div
              className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <p className="font-medium text-xs sm:text-sm">{feedback.message}</p>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Jadwal</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isConfirmed
                  ? "bg-emerald-100 text-emerald-700"
                  : isDone
                  ? "bg-blue-100 text-blue-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isConfirmed
                ? "Terkonfirmasi"
                : isDone
                ? "Selesai Pemeriksaan"
                : "Menunggu Konfirmasi Anda"}
            </span>
          </div>

          {/* Patient Details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70 text-sm">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Nama Pasien</p>
                <p className="font-semibold text-slate-900">{appointment.nama}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Hari & Tanggal</p>
                <p className="font-semibold text-slate-900">
                  {formatTanggal(appointment.tanggalJanji)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Jam Konsultasi</p>
                <p className="font-semibold text-slate-900">
                  {appointment.jamJanji ? `${appointment.jamJanji} WIB` : "Belum ditentukan"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Keluhan Anda</p>
                <p className="text-xs text-slate-700 mt-0.5 italic">"{appointment.keluhan}"</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!isConfirmed && !isDone ? (
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-md shadow-emerald-200 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Mengonfirmasi Kehadiran...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ya, Saya Bersedia Hadir</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center">
              <p className="text-xs font-semibold text-emerald-800">
                ✓ Jadwal Anda sudah tercatat oleh tim dokter klinik kami.
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5">
                Harap hadir 10 menit sebelum jam konsultasi.
              </p>
            </div>
          )}

          {/* Additional note for reschedule */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2.5">
            <MessageCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p>
              Jika Anda ingin mengganti jadwal atau berhalangan hadir pada waktu di atas, silakan langsung balas pesan WhatsApp yang dikirimkan Admin klinik.
            </p>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
