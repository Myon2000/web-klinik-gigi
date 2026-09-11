import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nomorHp: { contains: search, mode: 'insensitive' } },
        { keluhan: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (year) {
      const parsedYear = parseInt(year, 10);
      let startDate, endDate;

      if (month && month !== 'ALL') {
        const parsedMonth = parseInt(month, 10) - 1; // 0-indexed
        startDate = new Date(Date.UTC(parsedYear, parsedMonth, 1, 0, 0, 0));
        endDate = new Date(Date.UTC(parsedYear, parsedMonth + 1, 0, 23, 59, 59, 999));
      } else {
        startDate = new Date(Date.UTC(parsedYear, 0, 1, 0, 0, 0));
        endDate = new Date(Date.UTC(parsedYear, 11, 31, 23, 59, 59, 999));
      }

      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    return NextResponse.json({ error: 'Gagal memuat daftar antrean.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      nama,
      nomor_hp,
      tempat_lahir,
      tanggal_lahir,
      alamat,
      keluhan,
      tanggal_janji,
      jam_janji,
      status,
    } = body;

    if (!nama || !nomor_hp || !alamat || !keluhan) {
      return NextResponse.json(
        { error: 'Nama, No. WhatsApp, Alamat, dan Keluhan wajib diisi.' },
        { status: 400 }
      );
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        nama: nama.trim(),
        nomorHp: nomor_hp.trim(),
        tempatLahir: tempat_lahir ? tempat_lahir.trim() : '-',
        tanggalLahir: tanggal_lahir ? new Date(tanggal_lahir) : new Date(),
        alamat: alamat.trim(),
        keluhan: keluhan.trim(),
        tanggalJanji: tanggal_janji ? new Date(tanggal_janji) : null,
        jamJanji: jam_janji || null,
        status: status || 'TERKONFIRMASI',
        sumber: 'MANUAL',
        isRead: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Jadwal pasien manual berhasil ditambahkan.',
        data: newAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding manual appointment:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan jadwal pasien manual.' },
      { status: 500 }
    );
  }
}
