import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const setting = await prisma.clinicSetting.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json({
      success: true,
      data: setting || { id: 1, isOpen: true, announcement: '' },
    });
  } catch (error) {
    console.error('Error fetching clinic settings:', error);
    return NextResponse.json({ error: 'Gagal memuat info klinik.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isOpen, announcement } = body;

    const updated = await prisma.clinicSetting.upsert({
      where: { id: 1 },
      update: {
        isOpen: Boolean(isOpen),
        announcement: announcement || '',
      },
      create: {
        id: 1,
        isOpen: Boolean(isOpen),
        announcement: announcement || '',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengaturan klinik berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating clinic settings:', error);
    return NextResponse.json({ error: 'Gagal memperbarui info klinik.' }, { status: 500 });
  }
}
