import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAdminSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Sesi Anda telah berakhir. Silakan login kembali.' }, { status: 401 });
    }

    const body = await request.json();
    const { password, mode = 'ALL' } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Kata sandi admin diperlukan untuk konfirmasi penghapusan data uji.' },
        { status: 400 }
      );
    }

    // Verifikasi password admin demi keamanan
    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin tidak ditemukan.' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(String(password), admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Kata sandi yang Anda masukkan salah.' }, { status: 401 });
    }

    if (mode === 'ALL') {
      // Hapus semua data appointment dan bersihkan rate limits
      await prisma.$executeRawUnsafe('TRUNCATE TABLE "appointments" RESTART IDENTITY CASCADE;');
      await prisma.rateLimit.deleteMany({});
    } else {
      // Hapus hanya yang berstatus BATAL atau SELESAI
      await prisma.appointment.deleteMany({
        where: {
          status: { in: ['SELESAI', 'BATAL'] },
        },
      });
      await prisma.rateLimit.deleteMany({});
    }

    return NextResponse.json({
      success: true,
      message:
        mode === 'ALL'
          ? 'Seluruh data antrean uji berhasil dibersihkan dan nomor antrean di-reset ke 1.'
          : 'Data uji riwayat selesai & batal berhasil dibersihkan.',
    });
  } catch (error) {
    console.error('Error resetting test data:', error);
    return NextResponse.json({ error: 'Gagal membersihkan data uji: ' + error.message }, { status: 500 });
  }
}
