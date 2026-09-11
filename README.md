# 🦷 Sistem Informasi & Pendaftaran Konsultasi Klinik Gigi

Aplikasi web modern untuk manajemen jadwal konsultasi pasien klinik gigi. Dibangun untuk memfasilitasi pasien agar dapat mendaftar janji temu secara online tanpa perlu login akun, serta memberikan kemudahan bagi admin/dokter dalam mengelola antrean pasien secara *real-time*, mengonfirmasi kedatangan via pesan WhatsApp dengan tautan unik, mencatat tindakan medis dan rincian biaya, serta mengekspor laporan ke format Excel.

---

## 🌟 Fitur Utama

### 1. Sisi Pasien (Publik / Tanpa Login)
- **Formulir Pendaftaran Sederhana:** Pasien cukup mengisi Nama, No. WhatsApp, Tempat/Tanggal Lahir, Alamat, dan Keluhan gigi.
- **Proteksi Anti-Spam & Rate Limiting:** Pembatasan frekuensi pengiriman formulir per alamat IP dan jeda *cooldown* nomor HP untuk mencegah spam antrean.
- **Pop-up Notifikasi Sukses:** Pemberitahuan pop-up instan setelah pendaftaran berhasil dikirim.
- **Halaman Konfirmasi Kehadiran (`/konfirmasi/[token]`):** Pasien dapat membuka tautan unik yang dikirimkan via WhatsApp untuk menyatakan *"Ya, Saya Bersedia Hadir"* tanpa perlu login akun.
- **Informasi Status & Jadwal Libur:** Menampilkan indikator klinik Buka/Tutup serta pengumuman jika dokter sedang cuti/libur.

### 2. Sisi Admin & Dokter Gigi (`/admin`)
- **Autentikasi Aman:** Sistem masuk admin tunggal dengan otentikasi session cookie HTTP-only berbasis JWT (`jose`) dan kata sandi terenkripsi (`bcrypt`).
- **Pembaruan Antrean Real-time (Server-Sent Events / SSE):** Data pasien baru otomatis muncul di baris paling atas tabel antrean secara langsung tanpa admin perlu menekan tombol refresh (F5).
- **Notifikasi Suara (*Audio Chime*) & Floating Toast:** Bunyi lonceng halus dan kartu notifikasi mengambang otomatis muncul saat ada pasien baru mendaftar.
- **Indikator Status & Titik Merah (*Red Dot*):** Notifikasi titik merah berkedip untuk membedakan pasien baru yang belum diproses jadwalnya.
- **Direct WhatsApp Broadcast:** Tombol **"Atur & WA"** yang otomatis membuka WhatsApp Web/Aplikasi dengan format pesan konfirmasi jadwal dan link persetujuan pasien.
- **Pendaftaran Pasien Manual:** Memfasilitasi pendaftaran pasien yang datang langsung (*walk-in*) atau mendaftar via telepon.
- **Catatan Rekam Tindakan & Pembayaran:** Input tindakan medis dokter gigi serta nominal total biaya setelah pasien selesai ditangani (status otomatis menjadi *Selesai*).
- **Ekspor Laporan Excel (.xlsx):** Unduh rekapitulasi data pendaftaran, keluhan, tindakan medis, dan biaya dengan filter periode **Per Bulan** atau **Per 1 Tahun Penuh**.
- **Pengaturan Operasional Klinik:** Mengubah status operasional klinik (Buka/Tutup) dan membuat pengumuman libur.

---

## 🛠️ Arsitektur & Spesifikasi Teknologi

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework Fullstack** | [Next.js](https://nextjs.org/) (App Router, React 19) | Server Components, Streaming SSR & Route Handlers |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) | Tampilan antarmuka modern, bersih, dan responsif |
| **Database** | [PostgreSQL](https://www.postgresql.org/) ([Neon Serverless](https://neon.tech/)) | Cloud Database dengan connection pooling bawaan |
| **ORM Database** | [Prisma ORM v6](https://www.prisma.io/) | Skema basis data terstruktur & migrasi otomatis |
| **Realtime Stream** | HTTP Server-Sent Events (SSE) | Kompatibel serverless Vercel tanpa dependensi socket eksternal |
| **Keamanan & Auth** | Jose (JWT), Bcryptjs | Enkripsi kata sandi & validasi sesi cookie aman |
| **Laporan Spreadsheet**| [SheetJS (XLSX)](https://sheetjs.com/) | Generator file Excel (.xlsx) di sisi server |
| **Pengujian (Testing)**| [Playwright](https://playwright.dev/) | End-to-End (E2E) Test Suite otomatis |
| **Platform Hosting** | [Vercel](https://vercel.com/) | Serverless Deployment |

---

## 🚀 Panduan Instalasi & Menjalankan Proyek Lokal

Bagi rekan tim yang baru saja melakukan *clone* / *pull* repositori ini, ikuti langkah-langkah berikut:

### 1. Kloning Repositori
```bash
git clone https://github.com/myon2000/web-klinik-gigi.git
cd web-klinik-gigi
```

### 2. Instalasi Dependensi
Pastikan kamu telah menginstal **Node.js (versi 20.x atau 24.x)**:
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin template environment variable `.env.example` menjadi file `.env.local` atau `.env`:
```bash
# Windows PowerShell:
Copy-Item .env.example .env.local

# Linux / macOS:
cp .env.example .env.local
```

Buka file `.env.local` dan sesuaikan koneksi database PostgreSQL Anda:
```env
# Contoh menggunakan PostgreSQL Cloud (Neon.tech):
DATABASE_URL="postgresql://neondb_owner:password_kalian@ep-holy-frog-ax8px6dl-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"

# ATAU contoh menggunakan PostgreSQL Lokal (pgAdmin / localhost):
# DATABASE_URL="postgresql://postgres:password_kamu@localhost:5432/klinik_gigi"

# Kunci JWT untuk sesi admin:
JWT_SECRET="klinik-gigi-super-secret-key-pkl-2026"
```

### 4. Sinkronisasi Basis Data & Seeding Awal
Jalankan perintah Prisma untuk membuat tabel-tabel di database:
```bash
npx prisma db push
```

Jalankan script seeder untuk membuat akun admin default dan data klinik awal:
```bash
npx prisma db seed
```

> **Kredensial Default Masuk Admin:**
> - **URL Login:** `http://localhost:3000/admin/login`
> - **Username:** `admin`
> - **Password:** `admin123`

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban (*browser*) dan akses:
- **Halaman Pasien (Publik):** `http://localhost:3000`
- **Halaman Konfirmasi Pasien:** `http://localhost:3000/konfirmasi/[token]`
- **Dashboard Admin:** `http://localhost:3000/admin`

---

## 📊 Manajemen Data & Testing

### Melihat Data via Prisma Studio (Database GUI)
Kamu bisa melihat dan mengelola isi tabel database secara visual lewat browser tanpa perlu membuka pgAdmin:
```bash
npx prisma studio
```
Buka alamat `http://localhost:5555` di browser.

### Menjalankan Pengujian Otomatis (E2E Playwright)
Untuk memastikan seluruh alur (pendaftaran pasien, validasi login admin, dan dashboard) berfungsi tanpa error:
```bash
npm run test:e2e
```
Atau buka mode visual interaktif Playwright:
```bash
npm run test:e2e:ui
```

### Uji Build Produksi
Sebelum melakukan deployment atau membuat Pull Request, pastikan aplikasi terbebas dari kesalahan kompilasi:
```bash
npm run build
```

---

## 📁 Struktur Direktori Utama

```text
web-klinik-gigi/
├── e2e/                           # Skenario pengujian End-to-End (Playwright)
│   └── klinik.spec.js
├── prisma/                        # Konfigurasi basis data & skema ORM
│   ├── schema.prisma              # Definisi model: Admin, Appointment, ClinicSetting, RateLimit
│   └── seed.js                    # Seeder data awal akun admin & klinik
├── public/                        # Aset statis & ikon
├── src/
│   ├── app/
│   │   ├── admin/                 # Halaman panel admin (Dashboard & Login)
│   │   ├── api/                   # REST API Endpoint Next.js
│   │   │   ├── admin/             # Endpoint khusus manajemen admin & SSE Stream (/events)
│   │   │   ├── appointments/      # Endpoint pendaftaran pasien & konfirmasi link WA
│   │   │   └── clinic-settings/   # Endpoint status operasional klinik
│   │   ├── konfirmasi/[token]/    # Halaman persetujuan jadwal kehadiran pasien
│   │   ├── globals.css            # Styling global Tailwind CSS
│   │   ├── layout.js              # Root layout Next.js
│   │   └── page.js                # Halaman utama (Formulir Pendaftaran Pasien)
│   └── lib/                       # Utility & library helper
│       ├── auth.js                # Helper otentikasi JWT & Cookie session
│       ├── events.js              # Event Bus untuk notifikasi real-time
│       ├── prisma.js              # Prisma Client singleton
│       └── rate-limiter.js        # Utilitas Anti-Spam (Limit IP & No. HP)
├── .env.example                   # Template konfigurasi environment
├── .gitignore                     # Berkas yang diabaikan oleh Git
├── package.json                   # Konfigurasi paket dependensi & script
├── playwright.config.js           # Konfigurasi Playwright Test Runner
└── README.md                      # Dokumentasi utama proyek
```

---

## 🤝 Aturan Berkolaborasi untuk Tim
1. **Selalu Pull Sebelum Mulai Bekerja:**
   ```bash
   git pull origin main
   ```
2. **Gunakan Branch Baru untuk Fitur Baru:**
   ```bash
   git checkout -b fitur/nama-fitur-kalian
   ```
3. **Jangan Melakukan Commit pada Berkas Sensitif:**
   File `.env`, `.env.local`, atau kredensial database pribadi **tidak boleh di-push** ke repositori publik.
4. **Jalankan `npm run build`** sebelum melakukan *merge* atau *push* untuk memastikan tidak ada kesalahan sintaks.

---

*Proyek Praktik Kerja Lapangan (PKL) - Sistem Pendaftaran dan Konsultasi Pasien Klinik Gigi.*
