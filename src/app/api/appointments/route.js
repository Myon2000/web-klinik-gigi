import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getClientIp, checkRateLimit, checkPhoneCooldown } from '@/lib/rate-limiter';
import { appointmentEvents } from '@/lib/events';
import { sanitizeText } from '@/lib/sanitize';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, nomor_hp, tempat_lahir, tanggal_lahir, alamat, keluhan, rencana_kunjungan } = body;

    // 1. Validasi Kelengkapan Kolom & Tipe Data
    if (
      typeof nama !== 'string' ||
      typeof nomor_hp !== 'string' ||
      typeof tempat_lahir !== 'string' ||
      !tanggal_lahir ||
      typeof alamat !== 'string' ||
      typeof keluhan !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Format data tidak valid atau ada kolom yang belum diisi.' },
        { status: 400 }
      );
    }

    // Sanitasi input teks dari tag HTML dan karakter berbahaya (Stored XSS Defense)
    const cleanNama = sanitizeText(nama);
    const cleanHp = sanitizeText(nomor_hp);
    const cleanTempat = sanitizeText(tempat_lahir);
    const cleanAlamat = sanitizeText(alamat);
    const cleanKeluhan = sanitizeText(keluhan);
    const cleanRencana = typeof rencana_kunjungan === 'string' && rencana_kunjungan.trim()
      ? sanitizeText(rencana_kunjungan)
      : null;

    if (!cleanNama || !cleanHp || !cleanTempat || !cleanAlamat || !cleanKeluhan) {
      return NextResponse.json(
        { error: 'Semua kolom formulir wajib diisi dengan benar.' },
        { status: 400 }
      );
    }

    // Validasi batas panjang karakter (mencegah DoS / database bloat)
    if (cleanNama.length < 2 || cleanNama.length > 100) {
      return NextResponse.json({ error: 'Nama harus antara 2 hingga 100 karakter.' }, { status: 400 });
    }
    if (cleanTempat.length < 2 || cleanTempat.length > 100) {
      return NextResponse.json({ error: 'Tempat lahir harus antara 2 hingga 100 karakter.' }, { status: 400 });
    }
    if (cleanAlamat.length < 5 || cleanAlamat.length > 500) {
      return NextResponse.json({ error: 'Alamat harus antara 5 hingga 500 karakter.' }, { status: 400 });
    }
    if (cleanKeluhan.length < 5 || cleanKeluhan.length > 2000) {
      return NextResponse.json({ error: 'Keluhan harus antara 5 hingga 2000 karakter.' }, { status: 400 });
    }

    // Validasi format nomor telepon / WhatsApp
    const phoneDigits = cleanHp.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      return NextResponse.json({ error: 'Nomor WhatsApp tidak valid (9-15 digit).' }, { status: 400 });
    }

    // Validasi keabsahan tanggal lahir
    const parsedBirthDate = new Date(tanggal_lahir);
    if (isNaN(parsedBirthDate.getTime())) {
      return NextResponse.json({ error: 'Format tanggal lahir tidak valid.' }, { status: 400 });
    }
    const today = new Date();
    if (parsedBirthDate > today) {
      return NextResponse.json({ error: 'Tanggal lahir tidak boleh di masa depan.' }, { status: 400 });
    }
    if (today.getFullYear() - parsedBirthDate.getFullYear() > 120) {
      return NextResponse.json({ error: 'Tanggal lahir tidak realistis.' }, { status: 400 });
    }

    // 2. Rate Limiting Berdasarkan IP Address (Maks 3 pengiriman per 10 menit)
    const clientIp = getClientIp(request);
    const ipCheck = await checkRateLimit(`ip:${clientIp}`, 3, 10);

    if (!ipCheck.success) {
      const waitMinutes = Math.ceil(ipCheck.retryAfterSeconds / 60);
      return NextResponse.json(
        {
          error: `Terlalu banyak permintaan pendaftaran dari perangkat Anda. Silakan coba lagi dalam ${waitMinutes} menit untuk mencegah spam.`,
          retryAfter: ipCheck.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // 3. Rate Limiting Berdasarkan Nomor WhatsApp (Jeda 15 menit & cegah antrean duplikat)
    const phoneCheck = await checkPhoneCooldown(cleanHp, 15);
    if (!phoneCheck.allowed) {
      const errorMessage = phoneCheck.isStillPending
        ? 'Nomor WhatsApp ini sudah mendaftar dan sedang dalam proses penjadwalan oleh tim kami. Mohon tunggu pesan WhatsApp dari klinik.'
        : `Nomor WhatsApp ini baru saja mendaftar. Mohon tunggu sekitar ${phoneCheck.remainingSeconds} menit jika ingin mengajukan pendaftaran baru.`;

      return NextResponse.json(
        { error: errorMessage },
        { status: 429 }
      );
    }

    // 4. Simpan Pendaftaran Baru
    const newAppointment = await prisma.appointment.create({
      data: {
        nama: cleanNama,
        nomorHp: cleanHp,
        tempatLahir: cleanTempat,
        tanggalLahir: parsedBirthDate,
        alamat: cleanAlamat,
        keluhan: cleanKeluhan,
        rencanaKunjungan: cleanRencana,
        status: 'MENUNGGU_JADWAL',
        sumber: 'WEB',
        isRead: false,
      },
    });

    // 5. Broadcast event realtime ke Admin Dashboard via SSE / WebSocket
    try {
      appointmentEvents.emit('new-appointment', newAppointment);
    } catch (err) {
      console.error('Gagal broadcast event:', err);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Pendaftaran konsultasi berhasil dikirim.',
        data: {
          id: newAppointment.id,
          token: newAppointment.token,
          nama: newAppointment.nama,
          status: newAppointment.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error membuat appointment:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat mendaftar jadwal.' },
      { status: 500 }
    );
  }
}
