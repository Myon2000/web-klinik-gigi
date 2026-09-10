# Sistem Pendaftaran Klinik Gigi

Aplikasi berbasis web untuk manajemen jadwal konsultasi klinik gigi. Sistem memfasilitasi pasien untuk mendaftar secara online tanpa login, dan memungkinkan admin untuk mengelola jadwal serta mengonfirmasi kedatangan pasien via tautan WhatsApp unik.

## Spesifikasi Teknologi
* **Kerangka Kerja Utama:** Next.js (App Router)
* **Antarmuka:** Tailwind CSS
* **Basis Data:** PostgreSQL (Library `pg`)
* **Lingkungan Produksi:** Vercel (Tautan Utama: `https://klinikhetty.myon.my.id`)

## Panduan Instalasi Lokal

### 1. Kloning Repositori & Instalasi
Pastikan Node.js dan Git sudah terinstal di perangkat masing-masing, lalu jalankan perintah berikut di terminal:

```bash
git clone [MASUKKAN_LINK_GITHUB_DI_SINI]
cd web-klinik-gigi
npm install
```

### 2. Konfigurasi Lingkungan (Environment)

Buat file bernama `.env.local` di *root directory* proyek (sejajar dengan `package.json`), lalu masukkan kredensial PostgreSQL lokal masing-masing:

```env
DATABASE_URL=postgresql://postgres:password_pgadmin_kalian@localhost:5432/nama_database_kalian
```

### 3. Migrasi Basis Data

Buat database baru di pgAdmin 4, buka Query Tool, dan jalankan skema berikut untuk membangun struktur tabel yang dibutuhkan sistem:

```sql
CREATE TYPE status_jadwal AS ENUM ('PENDING', 'MENUNGGU_KONFIRMASI', 'TERKONFIRMASI', 'SELESAI');

CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
    nama VARCHAR(255) NOT NULL,
    nomor_hp VARCHAR(20) NOT NULL,
    tempat_lahir VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    keluhan TEXT NOT NULL,
    tanggal_jadwal DATE,
    waktu_jadwal TIME,
    status status_jadwal DEFAULT 'PENDING',
    sumber_daftar VARCHAR(50) DEFAULT 'WEBSITE',
    tindakan TEXT,
    biaya INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Menjalankan Server Pengembangan

```bash
npm run dev
```

Buka `http://localhost:3000` di peramban untuk melihat hasil perubahan kode. Pastikan untuk selalu membuat branch baru saat mengembangkan fitur terpisah guna menghindari konflik saat penggabungan (merge) ke cabang utama.
