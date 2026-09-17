import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAdminSession, createAdminToken, generateSessionToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Sesi Anda telah berakhir. Silakan login kembali.' }, { status: 401 });
    }

    const body = await request.json();
    const { oldPassword, newPassword, confirmPassword, newUsername } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Kata sandi lama dan kata sandi baru wajib diisi.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Kata sandi baru minimal harus 6 karakter.' }, { status: 400 });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Konfirmasi kata sandi baru tidak cocok.' }, { status: 400 });
    }

    // Ambil data admin lengkap
    const admin = await prisma.admin.findUnique({
      where: { id: session.id },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Akun admin tidak ditemukan.' }, { status: 404 });
    }

    // Verifikasi password lama
    const isOldMatch = await bcrypt.compare(String(oldPassword), admin.password);
    if (!isOldMatch) {
      return NextResponse.json({ error: 'Kata sandi saat ini (lama) tidak benar.' }, { status: 400 });
    }

    // Cek username baru jika ingin diubah
    let updatedUsername = admin.username;
    if (newUsername && newUsername.trim() !== admin.username) {
      const existing = await prisma.admin.findUnique({
        where: { username: newUsername.trim() },
      });
      if (existing && existing.id !== admin.id) {
        return NextResponse.json({ error: 'Username tersebut sudah digunakan.' }, { status: 400 });
      }
      updatedUsername = newUsername.trim();
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(String(newPassword), 10);
    const newSessionToken = generateSessionToken();

    // Simpan ke database
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        username: updatedUsername,
        password: hashedPassword,
        sessionToken: newSessionToken,
      },
    });

    // Buat token sesi baru untuk sesi lokal saat ini
    const token = await createAdminToken({
      id: admin.id,
      username: updatedUsername,
      sessionToken: newSessionToken,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui. Sesi lain otomatis dikeluarkan.',
      user: { username: updatedUsername },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error changing admin password:', error);
    return NextResponse.json({ error: 'Gagal memperbarui kata sandi.' }, { status: 500 });
  }
}
