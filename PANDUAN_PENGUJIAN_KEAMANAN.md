# 🛡️ Panduan Pengujian Fitur Keamanan Sistem Klinik drg. Hetty

Dokumen ini disusun sebagai panduan praktis bagi pengembang, penguji (*QA*), maupun penilai PKL untuk menguji dan memverifikasi secara langsung seluruh lapisan keamanan (*Defense-in-Depth*) yang telah diimplementasikan pada sistem web Klinik drg. Hetty Jember.

---

## 📑 Daftar Pengujian Fitur Keamanan

1. [Uji 1: Single Active Session / SSO (Login Tunggal)](#uji-1-single-active-session--sso-login-tunggal)
2. [Uji 2: Proteksi Anti Brute-Force Password](#uji-2-proteksi-anti-brute-force-password)
3. [Uji 3: Kunci Otomatis Tidak Aktif (Inactivity Timeout 15 Menit)](#uji-3-kunci-otomatis-tidak-aktif-inactivity-timeout-15-menit)
4. [Uji 4: Edge Middleware Route Guard (Zero UI Flash)](#uji-4-edge-middleware-route-guard-zero-ui-flash)
5. [Uji 5: Jebakan Bot Spammer (Honeypot Silent Drop)](#uji-5-jebakan-bot-spammer-honeypot-silent-drop)
6. [Uji 6: Proteksi Formula / CSV Injection Excel (OWASP CWE-1236)](#uji-6-proteksi-formula--csv-injection-excel-owasp-cwe-1236)
7. [Uji 7: Sanitasi Input Pengguna (Stored XSS Defense)](#uji-7-sanitasi-input-pengguna-stored-xss-defense)
8. [Uji 8: Proteksi CSRF & Origin/Referer Verification Guard](#uji-8-proteksi-csrf--originreferer-verification-guard)
9. [Uji 9: Log Audit Keamanan (Security Audit Trail)](#uji-9-log-audit-keamanan-security-audit-trail)
10. [Uji 10: Verifikasi HTTP Security Headers (CSP, HSTS, COOP, dll)](#uji-10-verifikasi-http-security-headers-csp-hsts-coop-dll)

---

### Uji 1: Single Active Session / SSO (Login Tunggal)
* **Tujuan:** Memastikan satu akun admin hanya bisa aktif di 1 perangkat pada satu waktu. Jika ada login baru di perangkat lain, sesi di perangkat lama langsung ditendang (*revoked*).
* **Alat yang Dibutuhkan:** 2 Perangkat (misal: Laptop dan HP, atau 2 browser berbeda: Chrome & Brave/Edge).
* **Langkah Pengujian:**
  1. Login ke admin di **Laptop** (`/admin/login`). Buka dasbor admin.
  2. Buka **HP** (atau browser kedua), buka `/admin/login`, dan login dengan akun yang sama (`admin` / `admin123`).
  3. Kembali ke **Laptop**:
     * Cukup klik pada layar laptop, atau tekan **Refresh (F5)**, atau tunggu maksimal 10 detik.
* **Hasil yang Diharapkan:**
  * Sesi laptop otomatis keluar seketika.
  * Layar langsung berpindah ke halaman login `/admin/login?reason=single-session`.
  * Muncul kotak notifikasi kuning:
    > *"Akun Anda telah masuk di perangkat lain. Sesi pada perangkat ini telah dinonaktifkan demi keamanan."*
  * Cookie basi otomatis dihapus dan tidak terjadi perulangan (*looping*) kembali ke dasbor.

---

### Uji 2: Proteksi Anti Brute-Force Password
* **Tujuan:** Mencegah peretas membobol akun admin dengan metode tebak kata sandi (*dictionary / brute-force attack*).
* **Langkah Pengujian:**
  1. Buka halaman `/admin/login`.
  2. Masukkan username `admin`.
  3. Ketikkan kata sandi yang salah (misal: `salah123`), lalu klik tombol masuk.
  4. Perhatikan sisa percobaan yang muncul: *(Sisa percobaan: 4)*, *(Sisa percobaan: 3)*, dst.
  5. Ulangi kesalahan hingga 5 kali berturut-turut.
* **Hasil yang Diharapkan:**
  * Pada percobaan ke-5, sistem memblokir akses IP tersebut selama 15 menit.
  * Muncul pesan peringatan:
    > *"Terlalu banyak percobaan login yang gagal. Akses dibatasi selama 15 menit untuk keamanan."*
  * Upaya login selanjutnya dengan password benar sekalipun akan tetap ditolak hingga masa blokir berakhir.

---

### Uji 3: Kunci Otomatis Tidak Aktif (Inactivity Timeout 15 Menit)
* **Tujuan:** Mengamankan data rekam medis pasien jika laptop admin ditinggalkan terbuka di meja kerja tanpa pengawasan.
* **Langkah Pengujian:**
  1. Login ke panel admin di Laptop.
  2. Biarkan laptop terbuka tanpa menyentuh mouse, keyboard, touchpad, atau layar sentuh selama 15 menit.
* **Hasil yang Diharapkan:**
  * Tepat setelah 15 menit tanpa aktivitas, sistem otomatis menghapus cookie sesi dan mengarahkan ke halaman login.
  * Muncul kotak notifikasi peringatan:
    > *"Sesi Anda telah berakhir secara otomatis demi keamanan karena tidak ada aktivitas selama 15 menit."*

---

### Uji 4: Edge Middleware Route Guard (Zero UI Flash)
* **Tujuan:** Memastikan proteksi rute halaman admin bekerja di lapisan server terluar (*Edge*), bukan di sisi browser.
* **Langkah Pengujian:**
  1. Buka browser dalam mode **Incognito / Private Window** (kondisi belum login).
  2. Ketikkan langsung alamat:
     `https://klinikdrghetty.myon.my.id/admin/dashboard`
  3. Tekan Enter.
* **Hasil yang Diharapkan:**
  * Server langsung memberikan respons *HTTP 307 Temporary Redirect* ke `/admin/login`.
  * Tidak ada kedipan tampilan (*Zero UI Flash*) kerangka dasbor yang bocor ke pengunjung umum.

---

### Uji 5: Jebakan Bot Spammer (Honeypot Silent Drop)
* **Tujuan:** Menjebak robot perayap (*automated bot*) yang mengisi formulir pendaftaran terbuka tanpa mengotori database.
* **Langkah Pengujian (Simulasi Bot via DevTools):**
  1. Buka halaman utama website pasien (`/`).
  2. Tekan tombol **F12** pada keyboard untuk membuka Developer Tools > buka tab **Console**.
  3. Masukkan perintah JavaScript berikut untuk mengisi kolom jebakan rahasia yang tersembunyi dari manusia:
     ```javascript
     document.querySelector('input[name="user_website"]').value = "http://bot-spammer-link.com";
     ```
  4. Isi formulir nama, nomor WhatsApp, dan keluhan seperti biasa, lalu klik **"Ajukan Jadwal Konsultasi"**.
* **Hasil yang Diharapkan:**
  * Di layar pasien muncul pop-up berhasil biasa (agar bot mengira misinya sukses).
  * Namun buka panel Admin: **Data pendaftaran tersebut SAMA SEKALI TIDAK TERSIMPAN ke database dan tidak membunyikan notifikasi lonceng admin** (*Silent Drop*).

---

### Uji 6: Proteksi Formula / CSV Injection Excel (OWASP CWE-1236)
* **Tujuan:** Mencegah peretas mengeksekusi kode berbahaya pada komputer dokter saat dokter membuka file laporan Excel `.xlsx`.
* **Langkah Pengujian:**
  1. Buka formulir pasien di website publik.
  2. Daftarkan pasien dengan nama yang diawali karakter rumus Excel, misalnya:
     * Nama: `=SUM(1+2)` atau `+62812345` atau `-5000` atau `=CMD|' /C calc'!A0`
  3. Masuk ke panel Admin > klik tombol **"Ekspor Excel"**.
  4. Unduh dan buka file `.xlsx` tersebut di Microsoft Excel atau LibreOffice.
* **Hasil yang Diharapkan:**
  * Nilai sel di Excel otomatis diproteksi dengan tanda petik tunggal di depannya: `'=SUM(1+2)`.
  * Excel membacanya murni sebagai teks (*literal string*), sehingga tidak ada formula yang dieksekusi oleh aplikasi spreadsheet.

---

### Uji 7: Sanitasi Input Pengguna (Stored XSS Defense)
* **Tujuan:** Mencegah script jahat HTML/JavaScript tersimpan di database dan menyerang browser admin.
* **Langkah Pengujian:**
  1. Buka formulir pasien di website publik.
  2. Pada kolom **Keluhan Sakit**, ketikkan kode berikut:
     ```html
     Gigi ngilu <script>alert('Serangan XSS Berhasil!')</script><b>berlubang parah</b>
     ```
  3. Kirim formulir pendaftaran.
  4. Buka panel Admin dan periksa antrean pasien baru tersebut.
* **Hasil yang Diharapkan:**
  * Tag `<script>` dan tag HTML dibersihkan seluruhnya oleh modul `sanitizeText`.
  * Di layar admin hanya tampil teks bersih: `Gigi ngilu berlubang parah`.
  * Tidak ada pop-up alert JavaScript yang dieksekusi.

---

### Uji 8: Proteksi CSRF & Origin/Referer Verification Guard
* **Tujuan:** Mencegah situs web asing memicu aksi perubahan data klinik secara diam-diam.
* **Langkah Pengujian (Simulasi Cross-Origin via Tab Lain):**
  1. Pastikan Anda sedang login sebagai admin di satu tab.
  2. Buka tab baru di browser Anda, buka sembarang website lain (misal: `https://google.com`).
  3. Tekan **F12** > buka tab **Console** di halaman google.com tersebut.
  4. Jalankan perintah `fetch` berikut:
     ```javascript
     fetch('https://klinikdrghetty.myon.my.id/api/admin/appointments/1', {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ status: 'BATAL' })
     }).then(res => console.log('Status HTTP:', res.status));
     ```
* **Hasil yang Diharapkan:**
  * Konsol menampilkan status **`403 Forbidden`**.
  * Edge middleware memblokir permintaan karena header `Origin` berasal dari `google.com` (terdeteksi *Origin Mismatch*).

---

### Uji 9: Log Audit Keamanan (Security Audit Trail)
* **Tujuan:** Memverifikasi bahwa setiap aktivitas sensitif tercatat rapi ke tabel audit database.
* **Langkah Pengujian:**
  1. Lakukan salah satu aktivitas sensitif:
     * Sengaja salah ketik password saat login.
     * Mengubah kata sandi admin di menu Pengaturan.
     * Menghapus salah satu antrean pasien.
  2. Masuk ke panel admin > klik ikon **Pengaturan (Gear)** di pojok kanan atas > buka tab **"Log Audit"**.
* **Hasil yang Diharapkan:**
  * Setiap aksi langsung tercatat pada daftar:
    * Label Aksi: `LOGIN_FAILED`, `LOGIN_SUCCESS`, `PASSWORD_CHANGED`, `DELETE_APPOINTMENT`.
    * Aktor / Username yang melakukan.
    * Alamat IP pengakses.
    * Waktu kejadian (tanggal & jam).
    * Deskripsi rincian konteks.

---

### Uji 10: Verifikasi HTTP Security Headers (CSP, HSTS, COOP, dll)
* **Tujuan:** Memastikan peramban menerima header pertahanan web mutakhir dari server.
* **Langkah Pengujian:**
  * Buka terminal di laptop dan jalankan perintah PowerShell:
    ```powershell
    $res = Invoke-WebRequest -Uri "https://klinikdrghetty.myon.my.id" -UseBasicParsing
    $res.Headers | Format-List
    ```
* **Hasil yang Diharapkan:**
  Tercantum header keamanan:
  * `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`
  * `Content-Security-Policy`: Terkunci ke `default-src 'self'`
  * `X-Frame-Options`: `SAMEORIGIN`
  * `X-Content-Type-Options`: `nosniff`
  * `Referrer-Policy`: `strict-origin-when-cross-origin`
  * `Cross-Origin-Opener-Policy`: `same-origin-allow-popups`

---

## 🤖 Menjalankan Seluruh Pengujian Otomatis Sekaligus (Automated Test Suite)

Anda juga dapat menjalankan seluruh skenario pengujian di atas secara otomatis dalam waktu kurang dari 1 menit menggunakan Playwright:

```bash
# Jalankan seluruh test suite otomatis (11 pengujian)
npx playwright test

# ATAU jalankan dengan antarmuka visual interaktif
npx playwright test --ui
```

Semua 11 pengujian otomatis dirancang untuk memverifikasi fungsionalitas bisnis dan lapisan keamanan hingga menghasilkan status **11 passed**.
