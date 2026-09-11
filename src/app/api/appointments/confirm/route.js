import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { token },
      select: {
        id: true,
        token: true,
        nama: true,
        tanggalJanji: true,
        jamJanji: true,
        status: true,
        keluhan: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Jadwal konsultasi tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error fetching appointment by token:', error);
    return NextResponse.json({ error: 'Gagal memuat jadwal.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token tidak valid.' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { token },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Jadwal konsultasi tidak ditemukan.' }, { status: 404 });
    }

    if (appointment.status === 'TERKONFIRMASI') {
      return NextResponse.json({
        success: true,
        message: 'Jadwal Anda sudah dikonfirmasi sebelumnya.',
        data: appointment,
      });
    }

    if (appointment.status === 'SELESAI' || appointment.status === 'BATAL') {
      return NextResponse.json(
        { error: `Jadwal ini berstatus ${appointment.status.toLowerCase()}.` },
        { status: 400 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { token },
      data: {
        status: 'TERKONFIRMASI',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Jadwal berhasil dikonfirmasi. Terima kasih!',
      data: updated,
    });
  } catch (error) {
    console.error('Error confirming appointment:', error);
    return NextResponse.json({ error: 'Gagal mengonfirmasi jadwal.' }, { status: 500 });
  }
}
