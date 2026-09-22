# 🦷 Sistem Informasi, Profil Publik & Pendaftaran Janji Temu Klinik drg. Hetty Jember

Aplikasi web modern profil klinik dokter gigi dan sistem reservasi janji temu pasien online. Dirancang khusus untuk **Klinik drg. Hetty P., MPH** di Kaliwates, Kabupaten Jember, guna memfasilitasi pasien dalam berkonsultasi dan mendaftar jadwal kunjungan tanpa perlu login akun, meningkatkan visibilitas klinik di mesin pencari Google (*Local SEO Jember*), serta menyediakan panel kontrol operasional real-time lengkap bagi admin dan dokter.

🌐 **Website Produksi:** [https://klinikdrghetty.myon.my.id](https://klinikdrghetty.myon.my.id)  
📍 **Lokasi Praktik:** Jl. P. Mangkubumi No.I, Kaliwates Kidul, Kaliwates, Kec. Kaliwates, Kabupaten Jember, Jawa Timur 68131  

---

## 🌟 Fitur Utama Sistem

### 1. Sisi Pasien & Publik (Landing Page & Reservasi)
- **Showcase Profil & 6 Layanan Spesialis:** Penjelasan lengkap mengenai *Pembersihan Karang Gigi (Scaling)*, *Tambal Gigi Komposit Sinar*, *Pemutihan Gigi (Bleaching/Whitening)*, *Cabut Gigi & Gigi Bungsu*, *Konsultasi & Pemeriksaan Diagnostik*, serta *Perawatan Gusi & Periodontal*.
- **Kartu Statistik & Bukti Reputasi (*Why Us*):** Menampilkan rekam jejak praktik (10+ Tahun Pengalaman sejak 2015, 5.000+ Pasien Puas, dan 100% Standar Higienis Autoklaf Medis).
- **Logika Operasional Cerdas Real-time WIB (Asia/Jakarta):**
  - **Senin – Jumat (16:00 – 21:00 WIB):** Otomatis berstatus **Buka Sekarang** dengan indikator hijau berdenyut (*gentle pulse*).
  - **Senin – Jumat (di luar 16:00 – 21:00 WIB):** Otomatis berstatus **Tutup (Buka 16:00 WIB)** dengan estimasi sisa waktu hitungan mundur.
  - **Sabtu:** Otomatis berstatus **Tutup (Kecuali Janji Khusus)**.
  - **Minggu:** Otomatis berstatus **Tutup (Hari Libur)**.
- **Peta Google Maps Resmi Terintegrasi:** Embed resmi Google Maps Place dengan pin lokasi dan review rating 5.0 ★ *Praktek Drg. Hetty P., MPH*, dilengkapi tombol rute navigasi langsung.
- **Formulir Pendaftaran Pasien (Tanpa Login):** Form responsif (Nama, No. WhatsApp, Tempat/Tanggal Lahir, Alamat, Keluhan, dan Pilihan Estimasi Tanggal Kunjungan) dengan validasi nomor HP Indonesia.
- **Tanya Jawab Pasien (FAQ Accordion):** Informasi transparan mengenai layanan non-BPJS, metode pembayaran QRIS/Transfer/Tunai, pendaftaran online, perawatan gigi anak, dan persiapan tindakan medis.
- **Tombol Melayang WhatsApp (*Floating Quick-Action*):** Tombol WhatsApp mengambang di pojok kanan bawah dengan template pesan konsultasi instan.
- **Proteksi Anti-Spam & Rate Limiting:** Pembatasan frekuensi submit formulir berbasis alamat IP serta *cooldown timer* nomor WhatsApp untuk mencegah penumpukan data spam.
- **Halaman Konfirmasi Mandiri (`/konfirmasi/[token]`):** Pasien dapat membuka tautan unik yang dikirim admin via WhatsApp untuk menyatakan kesediaan hadir (*"Ya, Saya Bersedia Hadir"*) secara instan.
- **Animasi *Seamless* Ringan (60 FPS):** Implementasi *Scroll Reveal* berbasis browser `IntersectionObserver` dan akselerasi GPU (CSS/Tailwind) tanpa membebani performa perangkat ponsel.

### 2. Optimasi Mesin Pencari (Local SEO & Google Search Console)
- **Schema.org Structured Data (`Dentist` JSON-LD):** Metadata terstruktur kaya kata kunci dokter gigi Jember, koordinat geo Kaliwates, nomor telepon, dan jam operasional untuk peringkat teratas Google Search & Google Maps.
- **Sitemap Generator Otomatis (`/sitemap.xml`):** Peta situs XML berstandar resmi Google XML Sitemap Protocol.
- **Robots Configuration (`/robots.txt`):** Pengaturan perayapan otomatis untuk Googlebot, Bingbot, dan Applebot sekaligus memblokir akses bot ke rute internal `/admin` dan `/api/*`.
- **Verifikasi Terintegrasi:** Terpasang berkas verifikasi resmi Google Search Console (`googledfe8476829535dd7.html`) dan tag meta verifikasi.

### 3. Sisi Panel Admin & Dokter Gigi (`/admin`)
- **Single Active Session & Inactivity Auto-Logout:** Sesi admin otomatis ditendang keluar jika akun dibuka di perangkat/laptop lain, serta otomatis terkunci jika tidak ada aktivitas selama 15 menit.
- **Log Audit Keamanan Terintegrasi (*Security Audit Trail*):** Mencatat 50 riwayat aktivitas sensitif (login berhasil/gagal, ubah kata sandi, hapus pasien, reset antrean) lengkap dengan alamat IP, aktor, dan cap waktu ke tabel database PostgreSQL.
- **Ganti Kata Sandi & Username Mandiri:** Fitur pembaruan kredensial akun dokter/admin langsung dari dasbor dengan enkripsi Bcrypt.
- **Agenda Pasien Hari Ini (*Today's Schedule Card*):** Kartu ringkasan interaktif di atas dasbor yang merangkum jadwal janji temu pasien hari ini secara kronologis jam praktik (16:00 - 21:00 WIB).
- **Hapus Data Pasien & Reset Antrean Uji (*Data Management*):** Tombol hapus antrean individual dengan modal konfirmasi aman, serta opsi pembersihan data testing 1-klik yang dilindungi konfirmasi kata sandi admin.
- **Autentikasi Aman & Proteksi Brute-Force:** Otentikasi berbasis HTTP-only Session Cookie JWT (`jose`) dan kata sandi terenkripsi (`bcryptjs`). Dilengkapi proteksi penguncian otomatis setelah 5 kali salah password dalam 15 menit.
- **Penyembunyian Pintu Masuk Admin:** Tautan masuk admin sengaja ditiadakan dari tampilan publik depan untuk mencegah upaya intrusi.
- **Sinkronisasi Real-Time (Server-Sent Events / SSE):** Data pendaftaran pasien baru langsung masuk ke antrean admin secara otomatis tanpa perlu me-refresh halaman (F5).
- **Audio Chime & Floating Toast:** Bunyi notifikasi lonceng lembut dan kartu melayang saat pasien baru mendaftar (dilengkapi tombol *Mute/Unmute* suara).
- **Filter Status Antrean & Reset 1-Klik:** Tab status terorganisir (*Semua, Menunggu Konfirmasi, Terkonfirmasi, Selesai, Batal*) dengan indikator badge jumlah pasien belum diproses.
- **Direct WhatsApp Link Generator:** Tombol interaksi cepat yang membuka WhatsApp Web/Aplikasi dengan 3 preset template pesan resmi:
  - *Template Konfirmasi Jadwal Baru* (dengan link persetujuan kehadiran pasien).
  - *Template Pengingat Jadwal (H-1)*.
  - *Template Penundaan / Keadaan Darurat*.
- **Pendaftaran Pasien Manual:** Fitur input antrean pasien yang datang langsung (*walk-in*) atau mendaftar via telepon.
- **Modal Rekam Tindakan & Catatan Dokter:** Dokter dapat mencatat riwayat tindakan medis, catatan perawatan internal (`catatanDokter`), dan total biaya tagihan.
- **Cetak Nota Pembayaran / Invoice:** Generator kuitansi pembayaran pasien dengan format cetak profesional (*print-ready layout*).
- **Ekspor Laporan Spreadsheet (.xlsx):** Rekapitulasi data pasien, riwayat tindakan, dan pendapatan dalam format Excel per bulan atau 1 tahun penuh.
- **Visual Analytics Dashboard:**
  - *Analisis Keluhan Pasien:* Klasifikasi otomatis 6 kategori keluhan terbanyak (Sakit/Ngilu, Karang Gigi, Gigi Berlubang, Estetika/Bleaching, Gigi Patah/Goyang, dan Cabut Gigi).
  - *Peringkat Tindakan Medis:* Grafik tindakan medis paling sering dilakukan beserta total nominal pendapatan.
- **Kontrol Pengaturan Klinik:** Admin dapat menyetel mode *Otomatis (Ikuti Jam Praktik)* atau *Paksa Tutup (Cuti Libur)* serta memasang teks banner pengumuman darurat.

### 4. Arsitektur Pertahanan Keamanan Siber (*Defense-in-Depth*)
Sistem web menerapkan standar keamanan OWASP Top 10 dan standar perlindungan data kesehatan:
1. **Edge Middleware Route Guard (`src/middleware.js`):** Memverifikasi tiket JWT di serverless edge sebelum halaman dasbor dikirim (Zero UI Flash).
2. **Proteksi CSV/Formula Injection (CWE-1236):** Sanitasi otomatis simbol rumus Excel (`=`, `+`, `-`, `@`) pada generator laporan `.xlsx`.
3. **Sanitasi Stored XSS:** Pembersihan script, style, dan tag HTML berbahaya pada modul `src/lib/sanitize.js`.
4. **Honeypot Bot Trap:** Kolom tersembunyi untuk menjebak bot spam otomatis dengan respon *Silent Drop* (tanpa membuang kuota database).
5. **Proteksi CSRF (Origin & Referer Guard):** Edge middleware memverifikasi kecocokan origin pada semua mutasi data admin (`POST`, `PUT`, `PATCH`, `DELETE`).
6. **HTTP Security Headers Lengkap:** Strict-Transport-Security (HSTS 2 Tahun Preload), Content-Security-Policy (CSP), COOP, X-Frame-Options, dan X-Content-Type-Options.
7. **Panduan Lengkap Pengujian Keamanan:** Tersedia pada dokumen khusus [**PANDUAN_PENGUJIAN_KEAMANAN.md**](./PANDUAN_PENGUJIAN_KEAMANAN.md).

---

## 🛠️ Arsitektur & Spesifikasi Teknologi

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Framework Fullstack** | [Next.js](https://nextjs.org/) (App Router, React 19) | Server Components, Streaming SSR & Route Handlers |
| **Styling & Desain** | [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) | Utility-first CSS, modern, responsif, dan ringan |
| **Animasi & Interaksi**| Native CSS GPU Acceleration & IntersectionObserver | Efek scroll-reveal mulus tanpa beban runtime bundle besar |
| **Database** | [PostgreSQL](https://www.postgresql.org/) ([Neon Serverless](https://neon.tech/)) | Cloud Database dengan connection pooling aktif |
| **ORM Database** | [Prisma ORM v6](https://www.prisma.io/) | Schema modeling & migrasi database terstruktur |
| **Realtime Stream** | HTTP Server-Sent Events (SSE) | Kompatibel serverless Vercel tanpa perlu setup WebSocket eksternal |
| **Keamanan & Auth** | Jose (JWT), Bcryptjs | Enkripsi hash password & HTTP-only cookies |
| **Laporan Spreadsheet**| [SheetJS (XLSX)](https://sheetjs.com/) | Pembuatan file laporan Excel (.xlsx) di sisi server |
| **Pengujian (Testing)**| [Playwright](https://playwright.dev/) | Pengujian otomatis alur sistem (End-to-End Test Suite) |
| **Platform Hosting** | [Vercel](https://vercel.com/) | Serverless Edge Deployment |
| **Domain Kustom** | IDwebhost DNS (`klinikdrghetty.myon.my.id`) | Terhubung aman via CNAME ke `cname.vercel-dns.com` |

---

## 🚀 Panduan Instalasi & Menjalankan Proyek Lokal

Bagi anggota tim pengembang atau penilai PKL yang ingin menjalankan aplikasi secara lokal:

### 1. Kloning Repositori
```bash
git clone https://github.com/myon2000/web-klinik-gigi.git
cd web-klinik-gigi
```

### 2. Instalasi Dependensi
Pastikan telah terpasang **Node.js (versi 20.x atau 24.x)**:
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas template `.env.example` menjadi `.env.local` atau `.env`:
```bash
# Windows PowerShell:
Copy-Item .env.example .env.local

# Linux / macOS:
cp .env.example .env.local
```

Sesuaikan variabel di dalam `.env.local`:
```env
# Koneksi Basis Data PostgreSQL (Cloud Neon atau Lokal):
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Secret Key untuk Token JWT Admin:
JWT_SECRET="ganti-dengan-secret-key-acak-yang-aman"

# URL Publik Situs (untuk generator sitemap & link WA):
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Sinkronisasi Basis Data & Seeder
Jalankan sinkronisasi skema Prisma ke database:
```bash
npx prisma db push
```

Jalankan seeder untuk mengisi akun admin default dan data pengaturan awal:
```bash
npx prisma db seed
```

> **Kredensial Default Admin (Lingkungan Uji PKL):**
> - **URL Login Admin:** `http://localhost:3000/admin/login`
> - **Username:** `admin`
> - **Password:** `admin123`

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Akses halaman melalui peramban:
- **Halaman Utama & Profil Klinik:** `http://localhost:3000`
- **Peta Situs XML:** `http://localhost:3000/sitemap.xml`
- **Panel Masuk Admin:** `http://localhost:3000/admin/login`
- **Dashboard Admin:** `http://localhost:3000/admin/dashboard`

---

## 📊 Manajemen Data, Testing & Kualitas Kode

### Database GUI (Prisma Studio)
Untuk melihat dan mengelola isi tabel secara visual tanpa membuka DBMS terpisah:
```bash
npx prisma studio
```
Buka `http://localhost:5555` pada browser.

### Menjalankan Pengujian Otomatis (E2E Playwright)
Uji seluruh alur sistem (pendaftaran formulir pasien, validasi login salah/benar, serta dasbor admin):
```bash
npm run test:e2e
```
Atau buka mode visual interaktif:
```bash
npm run test:e2e:ui
```

### Pengecekan Kualitas Kode (Lint & Build)
```bash
npm run lint
npm run build
```

---

## 📁 Struktur Direktori Proyek

```text
web-klinik-gigi/
├── e2e/                                # Pengujian Otomatis End-to-End (Playwright)
│   ├── klinik.spec.js                  # Uji alur pasien, login admin, dan dashboard
│   └── security.spec.js                # Uji XSS, formula injection, bot trap, CSRF, & audit log
├── prisma/                             # Skema ORM & Seeder Basis Data
│   ├── schema.prisma                   # Model: Admin, Appointment, ClinicSetting, RateLimit, SecurityAuditLog
│   └── seed.js                         # Seeder akun admin & data awal klinik
├── public/                             # Aset Statis & Verifikasi Google
│   └── googledfe8476829535dd7.html     # File verifikasi Google Search Console
├── src/
│   ├── middleware.js                   # Edge Middleware (Route Guard & CSRF Origin Protection)
│   ├── app/
│   │   ├── admin/                      # Portal Admin
│   │   │   ├── dashboard/              # Halaman dasbor operasional admin
│   │   │   └── login/                  # Halaman masuk admin aman
│   │   ├── api/                        # REST API Next.js Route Handlers
│   │   │   ├── admin/                  # API data janji, ekspor excel, auth, audit-logs, & SSE stream
│   │   │   ├── appointments/           # API pendaftaran pasien & konfirmasi kehadiran
│   │   │   └── clinic-settings/        # API pengaturan jam operasional
│   │   ├── konfirmasi/[token]/         # Halaman publik persetujuan jadwal pasien
│   │   ├── globals.css                 # Styling Tailwind CSS & keyframe animasi
│   │   ├── layout.js                   # Root layout, Plus Jakarta Sans, SEO Jember, & JSON-LD
│   │   ├── page.js                     # Controller utama landing page & form pasien
│   │   ├── robots.js                   # Generator robots.txt otomatis
│   │   └── sitemap.js                  # Generator sitemap.xml standar Google
│   ├── components/
│   │   ├── admin/                      # Komponen Modular Dasbor Admin
│   │   │   ├── modals/                 # Modal Export, Pasien Manual, Invoice, Detail, Delete, Settings
│   │   │   ├── AnalyticsSection.js     # Grafik statistik keluhan & pendapatan tindakan
│   │   │   ├── AppointmentTable.js     # Tabel antrean pasien & aksi WhatsApp
│   │   │   ├── FilterBar.js            # Tab status, pencarian, & filter tanggal
│   │   │   ├── HeaderNav.js            # Navbar admin, toggle suara, & profil
│   │   │   ├── RealtimeToast.js        # Floating toast notifikasi pasien baru
│   │   │   ├── StatsGrid.js            # Kartu ringkasan metrik pasien
│   │   │   └── TodayAgendaCard.js      # Agenda kronologis pasien hari ini
│   │   ├── landing/                    # Komponen Modular Landing Page Publik
│   │   │   ├── FaqSection.js           # Accordion tanya-jawab pasien
│   │   │   ├── FooterSection.js        # Footer klinik & kontak
│   │   │   ├── HeroSection.js          # Hero banner klinik gigi Jember
│   │   │   ├── JsonLd.js               # Schema.org Dentist structured data
│   │   │   ├── LocationSection.js      # Peta Google Maps resmi & rute lokasi
│   │   │   ├── Navbar.js               # Navigasi publik & status klinik real-time
│   │   │   ├── ScheduleSection.js      # Tabel jam operasional & logika buka/tutup
│   │   │   ├── ServicesSection.js      # 6 Kartu layanan spesialis gigi Dribbble style
│   │   │   ├── TestimonialsSection.js  # Ulasan asli Google Maps 5.0 bintang
│   │   │   └── WhyUsSection.js         # Kartu keunggulan & statistik klinik
│   │   ├── patient/                    # Komponen Alur Pendaftaran Pasien
│   │   │   ├── PatientForm.js          # Formulir input data konsultasi & honeypot bot trap
│   │   │   ├── StepGuide.js            # Panduan alur pendaftaran 3 langkah
│   │   │   └── SuccessModal.js         # Modal notifikasi berhasil submit
│   │   └── ui/
│   │       ├── FloatingWhatsApp.js     # Tombol chat WhatsApp mengambang
│   │       └── ScrollReveal.js         # Komponen animasi fade-in scroll seamless
│   └── lib/                            # Modul Helper & Utilitas
│       ├── audit.js                    # Helper Security Audit Trail PostgreSQL
│       ├── auth.js                     # Otentikasi sesi JWT, single session token, & Bcrypt
│       ├── clinicSchedule.js           # Logika waktu operasional WIB (Asia/Jakarta)
│       ├── events.js                   # Real-time Event Bus (SSE Stream)
│       ├── prisma.js                   # Prisma Client singleton
│       ├── rate-limiter.js             # Proteksi Anti-Spam (IP & No. HP)
│       └── sanitize.js                 # Sanitasi XSS & Formula Injection Excel
├── PANDUAN_PENGUJIAN_KEAMANAN.md       # Panduan langkah-langkah pengujian manual keamanan
├── .env.example                        # Contoh berkas konfigurasi environment
├── package.json                        # Paket dependensi proyek
├── playwright.config.js                # Konfigurasi pengujian Playwright
└── README.md                           # Berkas dokumentasi utama proyek
```

---

## 🛡️ Standar Workflow & Manajemen Branch PKL
1. **Branch Isolation:** Setiap pengembangan fitur, perbaikan bug, atau dokumentasi dikerjakan pada branch terpisah (`feat/...`, `fix/...`, `docs/...`).
2. **Histori Utuh:** Seluruh riwayat cabang dipertahankan untuk kebutuhan rekam jejak portofolio dan laporan PKL.
3. **Standar Rilis:** Setiap cabang wajib lulus uji `npm run lint`, `npm run build`, dan `npm run test:e2e` sebelum digabungkan (*merge*) ke cabang utama (`main`).

---

*Proyek Praktik Kerja Lapangan (PKL) — Dikembangkan untuk Klinik drg. Hetty P., MPH Kabupaten Jember.*
