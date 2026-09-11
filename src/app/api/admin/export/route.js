import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    const parsedYear = parseInt(year, 10);
    let startDate, endDate;
    let periodLabel = `Tahun-${parsedYear}`;

    if (month && month !== 'ALL') {
      const parsedMonth = parseInt(month, 10) - 1; // 0-indexed
      startDate = new Date(Date.UTC(parsedYear, parsedMonth, 1, 0, 0, 0));
      endDate = new Date(Date.UTC(parsedYear, parsedMonth + 1, 0, 23, 59, 59, 999));
      periodLabel = `Bulan-${month}-${parsedYear}`;
    } else {
      startDate = new Date(Date.UTC(parsedYear, 0, 1, 0, 0, 0));
      endDate = new Date(Date.UTC(parsedYear, 11, 31, 23, 59, 59, 999));
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const formatDate = (date) => {
      if (!date) return '-';
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    const rows = appointments.map((item, index) => ({
      No: index + 1,
      'Tanggal Daftar': formatDate(item.createdAt),
      Sumber: item.sumber,
      'Nama Pasien': item.nama,
      'No. WhatsApp': item.nomorHp,
      'Tempat, Tanggal Lahir': `${item.tempatLahir}, ${formatDate(item.tanggalLahir)}`,
      Alamat: item.alamat,
      Keluhan: item.keluhan,
      'Tanggal Janji': formatDate(item.tanggalJanji),
      'Jam Janji': item.jamJanji || '-',
      Status: item.status,
      'Tindakan Dokter Gigi': item.tindakan || '-',
      'Biaya (Rp)': item.biaya ? Number(item.biaya) : 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Set custom column widths
    worksheet['!cols'] = [
      { wch: 5 },  // No
      { wch: 15 }, // Tanggal Daftar
      { wch: 10 }, // Sumber
      { wch: 22 }, // Nama Pasien
      { wch: 16 }, // No. WhatsApp
      { wch: 24 }, // TTL
      { wch: 26 }, // Alamat
      { wch: 28 }, // Keluhan
      { wch: 15 }, // Tanggal Janji
      { wch: 12 }, // Jam Janji
      { wch: 20 }, // Status
      { wch: 30 }, // Tindakan
      { wch: 15 }, // Biaya
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Jadwal Pasien');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const filename = `Laporan-Jadwal-Klinik-${periodLabel}.xlsx`;

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating excel:', error);
    return NextResponse.json({ error: 'Gagal mengekspor data laporan.' }, { status: 500 });
  }
}
