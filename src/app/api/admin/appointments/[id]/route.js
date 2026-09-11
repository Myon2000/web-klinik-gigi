import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PATCH(request, context) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const appointmentId = parseInt(id, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const body = await request.json();
    const updateData = {};

    if (body.tanggalJanji !== undefined) {
      updateData.tanggalJanji = body.tanggalJanji ? new Date(body.tanggalJanji) : null;
    }
    if (body.jamJanji !== undefined) {
      updateData.jamJanji = body.jamJanji;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.tindakan !== undefined) {
      updateData.tindakan = body.tindakan;
    }
    if (body.biaya !== undefined) {
      updateData.biaya = body.biaya !== null && body.biaya !== '' ? parseFloat(body.biaya) : null;
    }
    if (body.isRead !== undefined) {
      updateData.isRead = Boolean(body.isRead);
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Data jadwal berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data jadwal.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const appointmentId = parseInt(id, 10);
    if (isNaN(appointmentId)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Jadwal berhasil dihapus.',
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data jadwal.' },
      { status: 500 }
    );
  }
}
