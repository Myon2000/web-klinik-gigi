"use client";

import { useState, useEffect } from "react";
import { Settings, X, Lock, Database, Clock, ShieldCheck, AlertTriangle, Trash2, KeyRound, Shield, RefreshCw } from "lucide-react";

export default function SettingsModal({
  open,
  clinicSettings,
  setClinicSettings,
  onClose,
  setFeedback,
  onDataReset,
}) {
  const [activeTab, setActiveTab] = useState("operational"); // operational | security | data

  // 1. Tab Operasional
  const [localSettings, setLocalSettings] = useState(() => clinicSettings || { isOpen: true, announcement: "" });
  const [loadingOps, setLoadingOps] = useState(false);

  // Sync if clinicSettings changes
  const [prevSettings, setPrevSettings] = useState(clinicSettings);
  if (clinicSettings && clinicSettings !== prevSettings) {
    setPrevSettings(clinicSettings);
    setLocalSettings(clinicSettings);
  }

  // 2. Tab Keamanan (Ganti Password)
  const [passwordForm, setPasswordForm] = useState({
    newUsername: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // 3. Tab Manajemen Data (Reset Uji)
  const [resetForm, setResetForm] = useState({
    password: "",
    mode: "ALL",
  });
  const [loadingReset, setLoadingReset] = useState(false);
  const [resetError, setResetError] = useState("");

  // 4. Tab Audit Log Keamanan
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const fetchAuditLogs = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      const json = await res.json();
      if (res.ok && json.success) {
        setAuditLogs(json.data || []);
      }
    } catch (err) {
      console.error("Error fetch audit logs:", err);
    } finally {
      setLoadingAudit(false);
    }
  };

  useEffect(() => {
    if (open && activeTab === "audit") {
      fetchAuditLogs();
    }
  }, [open, activeTab]);

  if (!open) return null;

  // Handler Simpan Operasional
  const handleSaveOperational = async (e) => {
    e.preventDefault();
    setLoadingOps(true);

    try {
      const res = await fetch("/api/clinic-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localSettings),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setClinicSettings(localSettings);
        onClose();
        setFeedback?.({ message: "Pengaturan operasional klinik berhasil diperbarui.", type: "success" });
      } else {
        setFeedback?.({ message: json.error || "Gagal memperbarui pengaturan.", type: "error" });
      }
    } catch (err) {
      console.error("Error simpan pengaturan klinik:", err);
      setFeedback?.({ message: "Terjadi kesalahan pada jaringan.", type: "error" });
    } finally {
      setLoadingOps(false);
    }
  };

  // Handler Ganti Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (passwordForm.newPassword.length < 6) {
      setPassError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPassError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setLoadingPass(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setPassSuccess(json.message);
        setPasswordForm({
          newUsername: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setFeedback?.({ message: "Kata sandi admin berhasil diperbarui.", type: "success" });
      } else {
        setPassError(json.error || "Gagal memperbarui kata sandi.");
      }
    } catch (err) {
      console.error("Error ganti password:", err);
      setPassError("Gagal menghubungi server.");
    } finally {
      setLoadingPass(false);
    }
  };

  // Handler Reset Data Testing
  const handleResetData = async (e) => {
    e.preventDefault();
    setResetError("");

    if (!resetForm.password) {
      setResetError("Masukkan kata sandi admin untuk konfirmasi.");
      return;
    }

    if (!confirm("Peringatan: Apakah Anda benar-benar yakin ingin membersihkan data antrean uji ini?")) {
      return;
    }

    setLoadingReset(true);
    try {
      const res = await fetch("/api/admin/appointments/reset-test-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetForm),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        onDataReset?.();
        onClose();
        setFeedback?.({ message: json.message, type: "success" });
      } else {
        setResetError(json.error || "Gagal membersihkan data uji.");
      }
    } catch (err) {
      console.error("Error reset data uji:", err);
      setResetError("Terjadi kesalahan pada jaringan.");
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Pengaturan Sistem & Operasional</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2 gap-1 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("operational")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "operational"
                ? "bg-white border-blue-600 text-blue-700 shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Jam Praktik & Libur</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "security"
                ? "bg-white border-blue-600 text-blue-700 shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Keamanan Akun</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("data")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "data"
                ? "bg-white border-rose-600 text-rose-700 shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Manajemen Data Uji</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "audit"
                ? "bg-white border-blue-600 text-blue-700 shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Log Audit</span>
          </button>
        </div>

        {/* TAB 1: OPERASIONAL */}
        {activeTab === "operational" && (
          <form onSubmit={handleSaveOperational} className="p-6 space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <p className="font-bold text-slate-900 text-sm">Mode Operasional Praktik</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pilih apakah klinik beroperasi otomatis sesuai jadwal reguler (Senin - Jumat 16:00 - 21:00 WIB) atau dipaksa tutup karena cuti/libur khusus.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, isOpen: true })}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 ${
                    localSettings.isOpen
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs ring-2 ring-emerald-400/20"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-extrabold text-sm">Otomatis Aktif</span>
                  <span className="text-[10px] font-medium text-emerald-700">Ikuti jam praktik 16:00-21:00</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, isOpen: false })}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-1 ${
                    !localSettings.isOpen
                      ? "bg-rose-50 border-rose-500 text-rose-800 shadow-2xs ring-2 ring-rose-400/20"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-extrabold text-sm">Paksa Tutup</span>
                  <span className="text-[10px] font-medium text-rose-700">Tutup darurat / cuti libur</span>
                </button>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-600">
                {localSettings.isOpen ? (
                  <p>
                    ✅ <strong>Sistem Otomatis Aktif:</strong> Website akan menampilkan status <em>&quot;Buka Sekarang&quot;</em> hanya pada hari Senin–Jumat pukul 16:00–21:00 WIB. Di luar jam tersebut atau akhir pekan, website otomatis menampilkan status <em>&quot;Tutup&quot;</em>.
                  </p>
                ) : (
                  <p>
                    🛑 <strong>Paksa Tutup Aktif:</strong> Website akan selalu menampilkan status <em>&quot;Klinik Tutup&quot;</em> setiap saat sampai Anda mengaktifkannya kembali.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Pengumuman Jadwal Libur / Informasi Penting
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Klinik libur pada tanggal 15 - 17 September 2026. Buka kembali hari Senin 18 September."
                value={localSettings.announcement || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, announcement: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Teks ini akan muncul sebagai banner oranye di bagian paling atas website pasien. Kosongkan jika tidak ada pengumuman libur.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loadingOps}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loadingOps ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: KEAMANAN AKUN */}
        {activeTab === "security" && (
          <form onSubmit={handleChangePassword} className="p-6 space-y-4 text-xs">
            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-blue-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Single Active Session Aktif</span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Mengganti kata sandi akan langsung mengeluarkan sesi aktif di perangkat atau laptop lain demi keamanan.
              </p>
            </div>

            {passError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Username Baru (Opsional, kosongkan jika tetap)
              </label>
              <input
                type="text"
                placeholder="Biarkan kosong jika tidak ingin mengubah username"
                value={passwordForm.newUsername}
                onChange={(e) => setPasswordForm({ ...passwordForm, newUsername: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kata Sandi Saat Ini (Lama) <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Masukkan kata sandi lama Anda"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Kata Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Konfirmasi Sandi Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ulangi kata sandi baru"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={loadingPass}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loadingPass ? "Memperbarui..." : "Perbarui Kata Sandi"}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: MANAJEMEN DATA UJI */}
        {activeTab === "data" && (
          <form onSubmit={handleResetData} className="p-6 space-y-4 text-xs">
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Pembersih Data Antrean Testing</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-relaxed">
                Fitur ini disediakan khusus agar Anda dapat mengosongkan antrean percobaan/testing dari teman-teman tanpa perlu membuka database manual.
              </p>
            </div>

            {resetError && (
              <div className="p-3 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cakupan Pembersihan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResetForm({ ...resetForm, mode: "ALL" })}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    resetForm.mode === "ALL"
                      ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-300/30 text-rose-900 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-xs">Bersih Total</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">
                    Hapus semua antrean & reset nomor ID ke 1.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setResetForm({ ...resetForm, mode: "COMPLETED_ONLY" })}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    resetForm.mode === "COMPLETED_ONLY"
                      ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-300/30 text-rose-900 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-xs">Hanya Selesai & Batal</p>
                  <p className="text-[10px] font-normal text-slate-500 mt-0.5">
                    Hanya hapus riwayat pasien selesai atau batal.
                  </p>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Konfirmasi Kata Sandi Admin <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Masukkan kata sandi admin Anda"
                value={resetForm.password}
                onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ketikkan kata sandi login admin Anda saat ini untuk mencegah penghapusan yang tidak sengaja.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loadingReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-semibold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{loadingReset ? "Membersihkan..." : "Kosongkan Data Uji Sekarang"}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: LOG AUDIT KEAMANAN */}
        {activeTab === "audit" && (
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">Riwayat Aktivitas Keamanan</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mencatat 50 peristiwa keamanan terakhir (login, perubahan sandi, reset data, penghapusan pasien).
                </p>
              </div>
              <button
                type="button"
                onClick={fetchAuditLogs}
                disabled={loadingAudit}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold cursor-pointer shadow-2xs transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${loadingAudit ? "animate-spin" : ""}`} />
                <span>Segarkan</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
              {loadingAudit ? (
                <div className="py-8 text-center text-slate-400">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>Memuat log audit...</p>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <p>Belum ada catatan aktivitas keamanan.</p>
                </div>
              ) : (
                auditLogs.map((log) => {
                  const isSuccess = log.action === "LOGIN_SUCCESS" || log.action === "PASSWORD_CHANGED";
                  const isDanger = log.action === "RESET_TEST_DATA" || log.action === "DELETE_APPOINTMENT";
                  const isFailed = log.action.includes("FAILED");

                  return (
                    <div key={log.id} className="p-3 bg-white hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isSuccess
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isDanger
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : isFailed
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {log.action}
                          </span>
                          <span className="font-semibold text-slate-800">{log.actor}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.createdAt).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{log.details || "-"}</p>
                      {log.ip && (
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">IP: {log.ip}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
