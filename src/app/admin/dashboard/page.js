"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

// Komponen Modular Admin
import HeaderNav from "@/components/admin/HeaderNav";
import StatsGrid from "@/components/admin/StatsGrid";
import TodayAgendaCard from "@/components/admin/TodayAgendaCard";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import FilterBar from "@/components/admin/FilterBar";
import AppointmentTable from "@/components/admin/AppointmentTable";
import RealtimeToast from "@/components/admin/RealtimeToast";

// Modal Dialogs
import ScheduleModal from "@/components/admin/modals/ScheduleModal";
import TreatmentModal from "@/components/admin/modals/TreatmentModal";
import ManualPatientModal from "@/components/admin/modals/ManualPatientModal";
import ExportModal from "@/components/admin/modals/ExportModal";
import SettingsModal from "@/components/admin/modals/SettingsModal";
import ReceiptModal from "@/components/admin/modals/ReceiptModal";
import PatientDetailModal from "@/components/admin/modals/PatientDetailModal";
import DeleteConfirmationModal from "@/components/admin/modals/DeleteConfirmationModal";

export default function AdminDashboard() {
  const router = useRouter();

  // State Data
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [clinicSettings, setClinicSettings] = useState({ isOpen: true, announcement: "" });

  // State Modals
  const [scheduleModal, setScheduleModal] = useState({ open: false, appointment: null });
  const [treatmentModal, setTreatmentModal] = useState({ open: false, appointment: null });
  const [manualModal, setManualModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [receiptModal, setReceiptModal] = useState({ open: false, appointment: null });
  const [patientDetailModal, setPatientDetailModal] = useState({ open: false, appointment: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, appointment: null, loading: false });

  // Inactivity Auto-Logout (15 Menit)
  useEffect(() => {
    let timeoutId;
    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 menit

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await fetch("/api/admin/auth/logout", { method: "POST" });
        } catch {}
        router.push("/admin/login?reason=inactivity");
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer));

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [router]);

  // Status & Notifikasi Realtime
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isConnected, setIsConnected] = useState(false);
  const [realtimeToast, setRealtimeToast] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Audio Chime untuk notifikasi pendaftaran baru
  const playNotificationSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
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
  }, []);

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
      console.error("Gagal memuat jadwal pasien:", err);
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
      console.error("Gagal memuat status belum dibaca:", err);
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
      console.error("Gagal memuat pengaturan klinik:", err);
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

          // Otomatis masukkan ke daftar antrean tanpa reload halaman
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
  }, [fetchAppointments, fetchUnreadCount, playNotificationSound]);

  // Auto-dismiss realtime toast setelah 8 detik
  useEffect(() => {
    if (realtimeToast) {
      const timer = setTimeout(() => setRealtimeToast(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [realtimeToast]);

  // Background auto-sync sebagai fallback berkala
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) {
        await Promise.all([fetchAppointments(), fetchUnreadCount(), fetchClinicSettings()]);
      }
    };
    loadData();

    const interval = setInterval(() => {
      if (isMounted) {
        fetchAppointments();
        fetchUnreadCount();
      }
    }, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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

  // Handler Hapus Pasien Permanen
  const handleDeleteAppointment = (item) => {
    setDeleteModal({ open: true, appointment: item, loading: false });
  };

  const handleConfirmDelete = async (id) => {
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        fetchUnreadCount();
        setDeleteModal({ open: false, appointment: null, loading: false });
        setFeedback({ message: "Data pendaftaran pasien berhasil dihapus.", type: "success" });
      } else {
        setFeedback({ message: json.error || "Gagal menghapus data pasien.", type: "error" });
        setDeleteModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("Gagal hapus pasien:", err);
      setFeedback({ message: "Terjadi kesalahan jaringan saat menghapus.", type: "error" });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };
  const handleCancelAppointment = async (item) => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menandai antrean pasien "${item.nama}" sebagai BATAL?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/appointments/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "BATAL", isRead: true }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        fetchAppointments();
        fetchUnreadCount();
        setFeedback({ message: `Jadwal pasien ${item.nama} telah ditandai batal.`, type: "success" });
      } else {
        setFeedback({ message: json.error || "Gagal membatalkan jadwal.", type: "error" });
      }
    } catch (err) {
      console.error("Gagal membatalkan jadwal:", err);
      setFeedback({ message: "Terjadi kesalahan saat membatalkan jadwal.", type: "error" });
    }
  };

  // Filtered appointments berdasarkan status dan kata kunci pencarian
  const filteredAppointments = appointments.filter((item) => {
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorHp.includes(searchQuery) ||
      item.keluhan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Perhitungan statistik cepat
  const stats = {
    menungguJadwal: appointments.filter((a) => a.status === "MENUNGGU_JADWAL").length,
    menungguKonfirmasi: appointments.filter((a) => a.status === "MENUNGGU_KONFIRMASI").length,
    terkonfirmasi: appointments.filter((a) => a.status === "TERKONFIRMASI").length,
    selesai: appointments.filter((a) => a.status === "SELESAI").length,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* 1. Top Navbar */}
      <HeaderNav
        unreadCount={unreadCount}
        isConnected={isConnected}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenManualModal={() => setManualModal(true)}
        onOpenExportModal={() => setExportModal(true)}
        onOpenSettingsModal={() => setSettingsModal(true)}
        onLogout={handleLogout}
      />

      {/* 2. Main Dashboard Content */}
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
            <button onClick={() => setFeedback({ message: "", type: "" })} className="cursor-pointer">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        )}

        {/* 3. Agenda Pasien Hari Ini */}
        <TodayAgendaCard
          appointments={appointments}
          onOpenScheduleModal={(item) => setScheduleModal({ open: true, appointment: item })}
          onOpenTreatmentModal={(item) => setTreatmentModal({ open: true, appointment: item })}
          onOpenPatientDetail={(item) => setPatientDetailModal({ open: true, appointment: item })}
        />

        {/* 4. Kartu Ringkasan Statistik */}
        <StatsGrid
          stats={stats}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* 5. Analitik & Grafik Tren Keluhan Pasien serta Tindakan Medis */}
        <AnalyticsSection appointments={appointments} />

        {/* 6. Filter Status & Kolom Pencarian */}
        <FilterBar
          totalCount={appointments.length}
          menungguJadwalCount={stats.menungguJadwal}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 7. Tabel Daftar Jadwal & Tindakan */}
        <AppointmentTable
          appointments={filteredAppointments}
          loading={loading}
          onOpenScheduleModal={(item) => setScheduleModal({ open: true, appointment: item })}
          onOpenTreatmentModal={(item) => setTreatmentModal({ open: true, appointment: item })}
          onOpenReceiptModal={(item) => setReceiptModal({ open: true, appointment: item })}
          onOpenPatientDetail={(item) => setPatientDetailModal({ open: true, appointment: item })}
          onCancelAppointment={handleCancelAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          onResetFilter={() => {
            setStatusFilter("ALL");
            setSearchQuery("");
          }}
        />
      </main>

      {/* 7. Modal Dialogs */}
      <ScheduleModal
        open={scheduleModal.open}
        appointment={scheduleModal.appointment}
        onClose={() => setScheduleModal({ open: false, appointment: null })}
        onSuccess={() => {
          fetchAppointments();
          fetchUnreadCount();
        }}
        setFeedback={setFeedback}
      />

      <TreatmentModal
        open={treatmentModal.open}
        appointment={treatmentModal.appointment}
        onClose={() => setTreatmentModal({ open: false, appointment: null })}
        onSuccess={fetchAppointments}
        setFeedback={setFeedback}
      />

      <ManualPatientModal
        open={manualModal}
        onClose={() => setManualModal(false)}
        onSuccess={fetchAppointments}
        setFeedback={setFeedback}
      />

      <ExportModal
        open={exportModal}
        onClose={() => setExportModal(false)}
      />

      <SettingsModal
        open={settingsModal}
        clinicSettings={clinicSettings}
        setClinicSettings={setClinicSettings}
        onClose={() => setSettingsModal(false)}
        setFeedback={setFeedback}
        onDataReset={() => {
          fetchAppointments();
          fetchUnreadCount();
        }}
      />

      <ReceiptModal
        open={receiptModal.open}
        appointment={receiptModal.appointment}
        onClose={() => setReceiptModal({ open: false, appointment: null })}
      />

      <PatientDetailModal
        open={patientDetailModal.open}
        appointment={patientDetailModal.appointment}
        onClose={() => setPatientDetailModal({ open: false, appointment: null })}
        onOpenSchedule={(item) => setScheduleModal({ open: true, appointment: item })}
        onOpenTreatment={(item) => setTreatmentModal({ open: true, appointment: item })}
      />

      <DeleteConfirmationModal
        open={deleteModal.open}
        appointment={deleteModal.appointment}
        loading={deleteModal.loading}
        onClose={() => setDeleteModal({ open: false, appointment: null, loading: false })}
        onConfirm={handleConfirmDelete}
      />

      {/* 7. Floating Realtime Notification Toast */}
      <RealtimeToast
        toast={realtimeToast}
        onClose={() => setRealtimeToast(null)}
      />
    </div>
  );
}
