"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Search,
  Plus,
  Download,
  Settings,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Send,
  DollarSign,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Building,
  Bell,
  Wifi,
  WifiOff
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  // State Data
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [clinicSettings, setClinicSettings] = useState({ isOpen: true, announcement: "" });

  // Modals state
  const [scheduleModal, setScheduleModal] = useState({ open: false, appointment: null });
  const [scheduleData, setScheduleData] = useState({ tanggalJanji: "", jamJanji: "" });

  const [treatmentModal, setTreatmentModal] = useState({ open: false, appointment: null });
  const [treatmentData, setTreatmentData] = useState({ tindakan: "", biaya: "" });

  const [manualModal, setManualModal] = useState(false);
  const [manualData, setManualData] = useState({
    nama: "",
    nomor_hp: "",
    tempat_lahir: "-",
    tanggal_lahir: new Date().toISOString().split("T")[0],
    alamat: "",
    keluhan: "",
    tanggal_janji: new Date().toISOString().split("T")[0],
    jam_janji: "16:00",
  });

  const [exportModal, setExportModal] = useState(false);
  const [exportFilter, setExportFilter] = useState({
    type: "MONTH", // "MONTH" | "YEAR"
    month: (new Date().getMonth() + 1).toString(),
    year: new Date().getFullYear().toString(),
  });

  const [settingsModal, setSettingsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  // Real-time SSE State
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeToast, setRealtimeToast] = useState(null);

  // Audio Chime untuk notifikasi pendaftaran baru
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {}
  };

  // 1. Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (json.success) {
        setAppointments(json.data);
      }
    } catch (err) {
      console.error("Gagal load appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 2. Fetch unread count for Red Dot Notification
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/unread-count");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUnreadCount(json.unreadCount);
        }
      }
    } catch (err) {
      console.error("Gagal fetch unread count:", err);
    }
  }, []);

  // 3. Fetch Clinic Settings
  const fetchClinicSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/clinic-settings");
      const json = await res.json();
      if (json.success && json.data) {
        setClinicSettings(json.data);
      }
    } catch (err) {
      console.error("Gagal fetch clinic settings:", err);
    }
  }, []);

  // Real-time EventSource (SSE) Listener
  useEffect(() => {
    let eventSource;
    let reconnectTimeout;

    const connectSSE = () => {
      eventSource = new EventSource("/api/admin/events");

      eventSource.addEventListener("connected", () => {
        setIsConnected(true);
      });

      eventSource.addEventListener("new-appointment", (event) => {
        try {
          const newAppt = JSON.parse(event.data);
          playNotificationSound();

          setRealtimeToast({
            nama: newAppt.nama,
            keluhan: newAppt.keluhan,
            waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          });

          // Otomatis tambahkan ke daftar antrean tanpa reload halaman
          setAppointments((prev) => {
            if (prev.some((item) => item.id === newAppt.id)) return prev;
            return [newAppt, ...prev];
          });

          setUnreadCount((count) => count + 1);
        } catch (err) {
          console.error("Error saat menerima event realtime:", err);
          fetchAppointments();
          fetchUnreadCount();
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
        reconnectTimeout = setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [fetchAppointments, fetchUnreadCount]);

  // Auto-dismiss realtime toast setelah 8 detik
  useEffect(() => {
    if (realtimeToast) {
      const timer = setTimeout(() => setRealtimeToast(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [realtimeToast]);

  // Background auto-sync (setiap 8 detik) sebagai fallback handal
  useEffect(() => {
    fetchAppointments();
    fetchUnreadCount();
    fetchClinicSettings();

    const interval = setInterval(() => {
      fetchAppointments();
      fetchUnreadCount();
    }, 8000);

    return () => clearInterval(interval);
  }, [fetchAppointments, fetchUnreadCount, fetchClinicSettings]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Open Schedule & WA Modal
  const handleOpenScheduleModal = (item) => {
    const today = new Date().toISOString().split("T")[0];
    const initialDate = item.tanggalJanji
      ? new Date(item.tanggalJanji).toISOString().split("T")[0]
      : today;
    setScheduleData({
      tanggalJanji: initialDate,
      jamJanji: item.jamJanji || "16:00",
    });
    setScheduleModal({ open: true, appointment: item });
  };

  // Submit Schedule & Open WhatsApp Broadcast
  const handleSaveScheduleAndSendWA = async (e) => {
    e.preventDefault();
    if (!scheduleModal.appointment) return;
    setActionLoading(true);

    try {
      const { id, token, nama, nomorHp } = scheduleModal.appointment;

      // 1. Update in Database
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggalJanji: scheduleData.tanggalJanji,
          jamJanji: scheduleData.jamJanji,
          status: "MENUNGGU_KONFIRMASI",
          isRead: true,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // Format clean phone number: replace leading 08 with 628
        let cleanPhone = nomorHp.replace(/\D/g, "");
        if (cleanPhone.startsWith("0")) {
          cleanPhone = "62" + cleanPhone.slice(1);
        } else if (!cleanPhone.startsWith("62")) {
          cleanPhone = "62" + cleanPhone;
        }

        // Format Date for text message
        const dateObj = new Date(scheduleData.tanggalJanji);
        const dateFormatted = dateObj.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Origin for confirmation link
        const baseUrl = window.location.origin;
        const confirmUrl = `${baseUrl}/konfirmasi/${token}`;

        // WhatsApp template
        const textMessage = `Halo Bapak/Ibu ${nama},\n\nKami dari Klinik Gigi Dokter Gigi ingin mengonfirmasi jadwal konsultasi Anda:\n📅 *Hari/Tanggal:* ${dateFormatted}\n⏰ *Pukul:* ${scheduleData.jamJanji} WIB\n\nSilakan klik tautan berikut untuk *konfirmasi kehadiran* Anda:\n👉 ${confirmUrl}\n\nJika Anda berhalangan hadir atau ingin menjadwalkan ulang di jam lain, silakan langsung balas pesan WhatsApp ini.\n\nTerima kasih! 🙏`;

        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMessage)}`;

        // Open WhatsApp in new tab
        window.open(waUrl, "_blank");

        setScheduleModal({ open: false, appointment: null });
        fetchAppointments();
        fetchUnreadCount();
        setFeedback({ message: "Jadwal disimpan & pesan WhatsApp dibuka!", type: "success" });
      } else {
        setFeedback({ message: json.error || "Gagal menyimpan jadwal.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Terjadi kesalahan saat memproses jadwal.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Open Treatment Modal
  const handleOpenTreatmentModal = (item) => {
    setTreatmentData({
      tindakan: item.tindakan || "",
      biaya: item.biaya ? item.biaya.toString() : "",
    });
    setTreatmentModal({ open: true, appointment: item });
  };

  // Submit Treatment & Payment
  const handleSaveTreatment = async (e) => {
    e.preventDefault();
    if (!treatmentModal.appointment) return;
    setActionLoading(true);

    try {
      const { id } = treatmentModal.appointment;
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tindakan: treatmentData.tindakan,
          biaya: treatmentData.biaya,
          status: "SELESAI",
          isRead: true,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setTreatmentModal({ open: false, appointment: null });
        fetchAppointments();
        setFeedback({ message: "Data penanganan & pembayaran berhasil disimpan!", type: "success" });
      } else {
        setFeedback({ message: json.error || "Gagal menyimpan penanganan.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Gagal menyimpan data tindakan.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Manual Patient Registration
  const handleSaveManualPatient = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setManualModal(false);
        setManualData({
          nama: "",
          nomor_hp: "",
          tempat_lahir: "-",
          tanggal_lahir: new Date().toISOString().split("T")[0],
          alamat: "",
          keluhan: "",
          tanggal_janji: new Date().toISOString().split("T")[0],
          jam_janji: "16:00",
        });
        fetchAppointments();
        setFeedback({ message: "Pasien manual berhasil didaftarkan.", type: "success" });
      } else {
        setFeedback({ message: json.error || "Gagal mendaftarkan pasien.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Terjadi kesalahan pada sistem.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Save Clinic Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await fetch("/api/clinic-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clinicSettings),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSettingsModal(false);
        setFeedback({ message: "Pengaturan klinik berhasil diperbarui.", type: "success" });
      } else {
        setFeedback({ message: json.error || "Gagal memperbarui pengaturan.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Terjadi kesalahan pada jaringan.", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Download Excel
  const handleDownloadExcel = () => {
    const params = new URLSearchParams();
    params.set("year", exportFilter.year);
    if (exportFilter.type === "MONTH") {
      params.set("month", exportFilter.month);
    } else {
      params.set("month", "ALL");
    }

    const downloadUrl = `/api/admin/export?${params.toString()}`;
    window.open(downloadUrl, "_blank");
    setExportModal(false);
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter((item) => {
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorHp.includes(searchQuery) ||
      item.keluhan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Calculate quick stats
  const stats = {
    menungguJadwal: appointments.filter((a) => a.status === "MENUNGGU_JADWAL").length,
    menungguKonfirmasi: appointments.filter((a) => a.status === "MENUNGGU_KONFIRMASI").length,
    terkonfirmasi: appointments.filter((a) => a.status === "TERKONFIRMASI").length,
    selesai: appointments.filter((a) => a.status === "SELESAI").length,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "MENUNGGU_JADWAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Menunggu Jadwal
          </span>
        );
      case "MENUNGGU_KONFIRMASI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Menunggu Konfirmasi Pasien
          </span>
        );
      case "TERKONFIRMASI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Terkonfirmasi
          </span>
        );
      case "SELESAI":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Check className="w-3 h-3 text-blue-600" />
            Selesai Ditangani
          </span>
        );
      case "BATAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Batal
          </span>
        );
      default:
        return status;
    }
  };

  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRupiah = (number) => {
    if (!number) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">Panel Admin Klinik</h1>
                {/* Real-time Red Dot Indicator in Header */}
                {unreadCount > 0 && (
                  <span className="relative flex h-2.5 w-2.5" title={`${unreadCount} pendaftaran baru`}>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                  </span>
                )}
                {/* Real-time Connection Status Badge */}
                <div 
                  className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-slate-50"
                  title={isConnected ? "Terhubung ke stream realtime (SSE)" : "Sedang menyambungkan stream..."}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                  <span className={isConnected ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                    {isConnected ? "Realtime Aktif" : "Menghubungkan..."}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Manajemen Antrean, Tindakan & Laporan</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setManualModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pasien Manual</span>
            </button>

            <button
              onClick={() => setExportModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              title="Ekspor Laporan Excel"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ekspor Excel</span>
            </button>

            <button
              onClick={() => setSettingsModal(true)}
              className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Pengaturan Status Klinik & Pengumuman"
            >
              <Settings className="w-4 h-4 text-slate-600" />
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full grow space-y-6">
        {/* Feedback Alert */}
        {feedback.message && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback({ message: "", type: "" })}>
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setStatusFilter("MENUNGGU_JADWAL")}
            className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "MENUNGGU_JADWAL"
                ? "border-rose-500 ring-2 ring-rose-200"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">Menunggu Jadwal</span>
              {stats.menungguJadwal > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                </span>
              )}
            </div>
            <div className="text-2xl font-extrabold text-rose-600">{stats.menungguJadwal}</div>
            <p className="text-[11px] text-slate-400 mt-1">Pasien baru belum diatur</p>
          </div>

          <div
            onClick={() => setStatusFilter("MENUNGGU_KONFIRMASI")}
            className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "MENUNGGU_KONFIRMASI"
                ? "border-amber-500 ring-2 ring-amber-200"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">Menunggu Konfirmasi</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-600">{stats.menungguKonfirmasi}</div>
            <p className="text-[11px] text-slate-400 mt-1">Link WA sudah terkirim</p>
          </div>

          <div
            onClick={() => setStatusFilter("TERKONFIRMASI")}
            className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "TERKONFIRMASI"
                ? "border-emerald-500 ring-2 ring-emerald-200"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">Terkonfirmasi</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">{stats.terkonfirmasi}</div>
            <p className="text-[11px] text-slate-400 mt-1">Pasien siap diperiksa</p>
          </div>

          <div
            onClick={() => setStatusFilter("SELESAI")}
            className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "SELESAI"
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500">Selesai Ditangani</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-600">{stats.selesai}</div>
            <p className="text-[11px] text-slate-400 mt-1">Sudah diberi tindakan</p>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Semua ({appointments.length})
            </button>
            <button
              onClick={() => setStatusFilter("MENUNGGU_JADWAL")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                statusFilter === "MENUNGGU_JADWAL"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              <span>Jadwal Baru</span>
              {stats.menungguJadwal > 0 && (
                <span className="bg-white text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {stats.menungguJadwal}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter("MENUNGGU_KONFIRMASI")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "MENUNGGU_KONFIRMASI"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
            >
              Menunggu Konfirmasi
            </button>
            <button
              onClick={() => setStatusFilter("TERKONFIRMASI")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "TERKONFIRMASI"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Terkonfirmasi
            </button>
            <button
              onClick={() => setStatusFilter("SELESAI")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "SELESAI"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Selesai
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari pasien / no. WA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Pasien</th>
                  <th className="py-3 px-4">Keluhan & Alamat</th>
                  <th className="py-3 px-4">Jadwal Janji</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tindakan & Biaya</th>
                  <th className="py-3 px-4 text-right">Aksi Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p>Memuat data antrean jadwal...</p>
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-medium text-slate-600">Tidak ada jadwal ditemukan.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Coba sesuaikan filter status atau kata kunci pencarian Anda.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        !item.isRead ? "bg-rose-50/30" : ""
                      }`}
                    >
                      {/* Pasien Column */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-start gap-2">
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" title="Belum dibuka" />
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.nama}</p>
                            <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{item.nomorHp}</span>
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              TTL: {item.tempatLahir}, {formatTanggal(item.tanggalLahir)}
                            </p>
                            <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.sumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Keluhan & Alamat */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <p className="text-slate-800 font-medium line-clamp-2">"{item.keluhan}"</p>
                        <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{item.alamat}</span>
                        </p>
                      </td>

                      {/* Jadwal Janji */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        {item.tanggalJanji ? (
                          <div>
                            <p className="font-semibold text-slate-900">{formatTanggal(item.tanggalJanji)}</p>
                            <p className="text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-blue-600" />
                              <span>{item.jamJanji || "-"} WIB</span>
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-rose-500 font-medium italic">Belum ditentukan</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Tindakan & Biaya */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        {item.tindakan ? (
                          <div>
                            <p className="font-medium text-slate-800 line-clamp-2">{item.tindakan}</p>
                            <p className="font-bold text-emerald-700 mt-0.5">{formatRupiah(item.biaya)}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Button 1: Atur Jadwal & Kirim WA */}
                          <button
                            onClick={() => handleOpenScheduleModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors cursor-pointer text-xs shadow-xs"
                            title="Atur Jadwal & Kirim Pesan WhatsApp"
                          >
                            <Send className="w-3 h-3" />
                            <span>Atur & WA</span>
                          </button>

                          {/* Button 2: Input Tindakan & Biaya (Pasca penanganan) */}
                          <button
                            onClick={() => handleOpenTreatmentModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition-colors cursor-pointer text-xs"
                            title="Input Tindakan & Tarif Biaya"
                          >
                            <Stethoscope className="w-3 h-3" />
                            <span>Tindakan</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL 1: ATUR JADWAL & BROADCAST WA */}
      {scheduleModal.open && scheduleModal.appointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                <h3 className="font-bold text-sm">Atur Jadwal & Kirim Link WA</h3>
              </div>
              <button
                onClick={() => setScheduleModal({ open: false, appointment: null })}
                className="text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScheduleAndSendWA} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-800 text-sm">
                  {scheduleModal.appointment.nama}
                </p>
                <p className="text-slate-500 mt-0.5">WhatsApp: {scheduleModal.appointment.nomorHp}</p>
                <p className="text-slate-600 italic mt-1">"{scheduleModal.appointment.keluhan}"</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Tanggal Konsultasi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={scheduleData.tanggalJanji}
                  onChange={(e) => setScheduleData({ ...scheduleData, tanggalJanji: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Jam Janji Temu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={scheduleData.jamJanji}
                  onChange={(e) => setScheduleData({ ...scheduleData, jamJanji: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800 text-[11px]">
                <p className="font-semibold">Mekanisme Pengiriman:</p>
                <p className="mt-0.5">
                  Menekan tombol di bawah akan otomatis menyimpan jadwal ke sistem, mengubah status menjadi <strong>Menunggu Konfirmasi</strong>, dan membuka WhatsApp Web/Aplikasi dengan teks konfirmasi & link unik kehadiran pasien.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModal({ open: false, appointment: null })}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{actionLoading ? "Memproses..." : "Simpan & Buka WhatsApp"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INPUT TINDAKAN & BIAYA */}
      {treatmentModal.open && treatmentModal.appointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                <h3 className="font-bold text-sm">Catatan Penanganan & Pembayaran</h3>
              </div>
              <button
                onClick={() => setTreatmentModal({ open: false, appointment: null })}
                className="text-blue-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-800 text-sm">
                  {treatmentModal.appointment.nama}
                </p>
                <p className="text-slate-500 mt-0.5">Keluhan awal: "{treatmentModal.appointment.keluhan}"</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tindakan Penanganan Dokter Gigi <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Pembersihan karang gigi (scaling rahang atas & bawah), penambalan komposit gigi premolar."
                  value={treatmentData.tindakan}
                  onChange={(e) => setTreatmentData({ ...treatmentData, tindakan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Total Biaya yang Harus Dibayar (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-semibold">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    placeholder="250000"
                    value={treatmentData.biaya}
                    onChange={(e) => setTreatmentData({ ...treatmentData, biaya: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTreatmentModal({ open: false, appointment: null })}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {actionLoading ? "Menyimpan..." : "Selesaikan Kunjungan Pasien"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH PASIEN MANUAL (WALK-IN / TELP) */}
      {manualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <h3 className="font-bold text-sm">Pendaftaran Pasien Manual (Walk-in / Telepon)</h3>
              </div>
              <button onClick={() => setManualModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualPatient} className="p-6 space-y-4 text-xs overflow-y-auto grow">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Pasien <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama pasien"
                  value={manualData.nama}
                  onChange={(e) => setManualData({ ...manualData, nama: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08..."
                  value={manualData.nomor_hp}
                  onChange={(e) => setManualData({ ...manualData, nomor_hp: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    value={manualData.tempat_lahir}
                    onChange={(e) => setManualData({ ...manualData, tempat_lahir: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={manualData.tanggal_lahir}
                    onChange={(e) => setManualData({ ...manualData, tanggal_lahir: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Alamat Pasien <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Alamat lengkap"
                  value={manualData.alamat}
                  onChange={(e) => setManualData({ ...manualData, alamat: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Keluhan Pasien <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Deskripsi keluhan pasien"
                  value={manualData.keluhan}
                  onChange={(e) => setManualData({ ...manualData, keluhan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Tanggal Janji Konsultasi
                  </label>
                  <input
                    type="date"
                    value={manualData.tanggal_janji}
                    onChange={(e) => setManualData({ ...manualData, tanggal_janji: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Jam Janji
                  </label>
                  <input
                    type="time"
                    value={manualData.jam_janji}
                    onChange={(e) => setManualData({ ...manualData, jam_janji: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setManualModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {actionLoading ? "Menyimpan..." : "Simpan Pasien Manual"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EKSPOR LAPORAN EXCEL */}
      {exportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Ekspor Laporan Excel (.xlsx)</h3>
              </div>
              <button onClick={() => setExportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Rentang Waktu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportFilter({ ...exportFilter, type: "MONTH" })}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer transition-colors ${
                      exportFilter.type === "MONTH"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Per Bulan
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFilter({ ...exportFilter, type: "YEAR" })}
                    className={`py-2 px-3 rounded-lg border font-semibold text-center cursor-pointer transition-colors ${
                      exportFilter.type === "YEAR"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Per 1 Tahun Penuh
                  </button>
                </div>
              </div>

              {exportFilter.type === "MONTH" && (
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Bulan
                  </label>
                  <select
                    value={exportFilter.month}
                    onChange={(e) => setExportFilter({ ...exportFilter, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none"
                  >
                    <option value="1">Januari</option>
                    <option value="2">Februari</option>
                    <option value="3">Maret</option>
                    <option value="4">April</option>
                    <option value="5">Mei</option>
                    <option value="6">Juni</option>
                    <option value="7">Juli</option>
                    <option value="8">Agustus</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Tahun
                </label>
                <select
                  value={exportFilter.year}
                  onChange={(e) => setExportFilter({ ...exportFilter, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none"
                >
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                File Excel yang diunduh mencakup nama pasien, keluhan, tanggal daftar, jadwal janji, status, riwayat tindakan dokter gigi, dan biaya pembayaran.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setExportModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File Excel (.xlsx)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PENGATURAN KLINIK & PENGUMUMAN LIBUR */}
      {settingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm">Pengaturan Status & Info Klinik</h3>
              </div>
              <button onClick={() => setSettingsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Status Operasional Klinik</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ditampilkan sebagai indikator buka/tutup di web pasien.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setClinicSettings({ ...clinicSettings, isOpen: !clinicSettings.isOpen })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    clinicSettings.isOpen
                      ? "bg-emerald-600 text-white"
                      : "bg-rose-600 text-white"
                  }`}
                >
                  {clinicSettings.isOpen ? "BUKA" : "TUTUP"}
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pengumuman Jadwal Libur / Informasi Penting
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Klinik libur pada tanggal 15 - 17 September 2026. Buka kembali hari Senin 18 September."
                  value={clinicSettings.announcement || ""}
                  onChange={(e) => setClinicSettings({ ...clinicSettings, announcement: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Teks ini akan muncul sebagai banner oranye di bagian paling atas website pasien. Kosongkan jika tidak ada pengumuman libur.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSettingsModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {actionLoading ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Real-time Notification Toast */}
      {realtimeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="grow text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">🔔 Pendaftaran Pasien Baru!</span>
              <span className="text-[10px] text-slate-400">{realtimeToast.waktu} WIB</span>
            </div>
            <p className="font-semibold text-white mt-1 text-sm">{realtimeToast.nama}</p>
            <p className="text-slate-300 line-clamp-1 italic mt-0.5">"{realtimeToast.keluhan}"</p>
          </div>
          <button 
            onClick={() => setRealtimeToast(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
