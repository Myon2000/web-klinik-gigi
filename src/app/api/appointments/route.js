import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getClientIp, checkRateLimit, checkPhoneCooldown } from '@/lib/rate-limiter';
import { appointmentEvents } from '@/lib/events';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, nomor_hp, tempat_lahir, tanggal_lahir, alamat, keluhan } = body;

    // 1. Validasi Kelengkapan Kolom
    if (!nama || !nomor_hp || !tempat_lahir || !tanggal_lahir || !alamat || !keluhan) {
      return NextResponse.json(
        { error: 'Semua kolom formulir wajib diisi.' },
        { status: 400 }
      );
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
    const phoneCheck = await checkPhoneCooldown(nomor_hp, 15);
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
        nama: nama.trim(),
        nomorHp: nomor_hp.trim(),
        tempatLahir: tempat_lahir.trim(),
        tanggalLahir: new Date(tanggal_lahir),
        alamat: alamat.trim(),
        keluhan: keluhan.trim(),
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
