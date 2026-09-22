import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createAdminToken, generateSessionToken } from '@/lib/auth';
import { getClientIp, isRateLimited, recordFailure, clearRateLimit } from '@/lib/rate-limiter';
import { logSecurityEvent } from '@/lib/audit';

// Hash dummy untuk mencegah timing attack jika username tidak ditemukan
const DUMMY_HASH = '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO1234567890123456';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitKey = `login:ip:${clientIp}`;

    // 1. Periksa apakah IP sedang diblokir karena terlalu banyak percobaan salah
    const rateCheck = await isRateLimited(rateLimitKey, 5);
    if (rateCheck.limited) {
      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login yang gagal. Akses dibatasi selama ${rateCheck.remainingMinutes} menit untuk keamanan.`,
          isLocked: true,
          remainingMinutes: rateCheck.remainingMinutes,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { username: String(username).trim() },
    });

    // Jalankan compare dengan hash sebenarnya atau dummy hash agar waktu komputasi konstan
    const hashToCompare = admin ? admin.password : DUMMY_HASH;
    const isMatch = await bcrypt.compare(String(password), hashToCompare);

    if (!admin || !isMatch) {
      // Catat kegagalan login untuk IP ini
      const failureCount = await recordFailure(rateLimitKey, 15);
      const remainingAttempts = Math.max(0, 5 - failureCount);

      // Audit log kegagalan login
      await logSecurityEvent({
        action: 'LOGIN_FAILED',
        actor: String(username).trim(),
        ip: clientIp,
        details: remainingAttempts > 0 ? `Gagal (Sisa percobaan: ${remainingAttempts})` : 'Percobaan habis / akun diblokir sementara',
      });

      if (remainingAttempts === 0) {
        return NextResponse.json(
          {
            error: 'Terlalu banyak percobaan login gagal. Akses dibatasi selama 15 menit untuk keamanan.',
            isLocked: true,
            remainingMinutes: 15,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Username atau password salah. (Sisa percobaan: ${remainingAttempts})`,
          remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 2. Jika login berhasil, bersihkan catatan kegagalan rate limit
    await clearRateLimit(rateLimitKey);

    // 3. Buat sesi token baru untuk Single Active Session
    const sessionToken = generateSessionToken();
    await prisma.admin.update({
      where: { id: admin.id },
      data: { sessionToken },
    });

    // Audit log keberhasilan login
    await logSecurityEvent({
      action: 'LOGIN_SUCCESS',
      actor: admin.username,
      ip: clientIp,
      details: 'Sesi aktif tunggal diterbitkan',
    });

    const token = await createAdminToken({
      id: admin.id,
      username: admin.username,
      sessionToken,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil.',
      user: { username: admin.username },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error admin login:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat login.' }, { status: 500 });
  }
}
