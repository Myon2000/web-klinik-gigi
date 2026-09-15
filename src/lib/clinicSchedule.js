/**
 * Utility untuk menghitung status operasional klinik secara real-time
 * Berdasarkan waktu Indonesia Barat (WIB / Asia/Jakarta)
 */

export const REGULAR_SCHEDULE = [
  { day: 'Senin', dayIndex: 1, openTime: '16:00', closeTime: '21:00', isOpenDay: true, label: '16:00 - 21:00 WIB' },
  { day: 'Selasa', dayIndex: 2, openTime: '16:00', closeTime: '21:00', isOpenDay: true, label: '16:00 - 21:00 WIB' },
  { day: 'Rabu', dayIndex: 3, openTime: '16:00', closeTime: '21:00', isOpenDay: true, label: '16:00 - 21:00 WIB' },
  { day: 'Kamis', dayIndex: 4, openTime: '16:00', closeTime: '21:00', isOpenDay: true, label: '16:00 - 21:00 WIB' },
  { day: 'Jumat', dayIndex: 5, openTime: '16:00', closeTime: '21:00', isOpenDay: true, label: '16:00 - 21:00 WIB' },
  { day: 'Sabtu', dayIndex: 6, openTime: null, closeTime: null, isOpenDay: false, label: 'Tutup (Kecuali Janji Khusus)' },
  { day: 'Minggu', dayIndex: 0, openTime: null, closeTime: null, isOpenDay: false, label: 'Tutup' },
];

export function getWIBDate() {
  const now = new Date();
  // Konversi akurat ke WIB (UTC+7 / Asia/Jakarta)
  const wibString = now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  return new Date(wibString);
}

export function computeClinicStatus(clinicInfo) {
  const wib = getWIBDate();
  const day = wib.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  const hours = wib.getHours();
  const minutes = wib.getMinutes();
  const currentTotalMinutes = hours * 60 + minutes;

  const openMinute = 16 * 60; // 16:00 (960 min)
  const closeMinute = 21 * 60; // 21:00 (1260 min)

  // 1. Jika admin secara manual mematikan (TUTUP / LIBUR)
  if (clinicInfo && clinicInfo.isOpen === false) {
    return {
      isOpen: false,
      statusLabel: 'Klinik Tutup',
      detailLabel: 'Tutup Sementara / Libur',
      explanation: clinicInfo.announcement || 'Klinik sedang tutup sementara sesuai instruksi dokter.',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      dotColor: 'bg-rose-500',
      isWorkDay: day >= 1 && day <= 5,
    };
  }

  // 2. Hari Minggu -> Tutup
  if (day === 0) {
    return {
      isOpen: false,
      statusLabel: 'Klinik Tutup',
      detailLabel: 'Tutup (Hari Libur)',
      explanation: 'Hari ini klinik libur. Buka kembali hari Senin pukul 16:00 WIB.',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      dotColor: 'bg-slate-400',
      isWorkDay: false,
    };
  }

  // 3. Hari Sabtu -> Tutup (Kecuali Janji Khusus)
  if (day === 6) {
    return {
      isOpen: false,
      statusLabel: 'Klinik Tutup',
      detailLabel: 'Tutup (Janji Khusus)',
      explanation: 'Hari Sabtu tutup untuk umum. Hubungi WhatsApp untuk reservasi janji khusus.',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
      isWorkDay: false,
    };
  }

  // 4. Hari Kerja (Senin - Jumat)
  if (currentTotalMinutes >= openMinute && currentTotalMinutes < closeMinute) {
    return {
      isOpen: true,
      statusLabel: 'Klinik Buka',
      detailLabel: 'Buka Sekarang',
      explanation: 'Praktik dokter sedang berlangsung hingga pukul 21:00 WIB.',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
      isWorkDay: true,
    };
  }

  if (currentTotalMinutes < openMinute) {
    const hoursLeft = Math.floor((openMinute - currentTotalMinutes) / 60);
    const minsLeft = (openMinute - currentTotalMinutes) % 60;
    const timeRemaining = hoursLeft > 0 ? `${hoursLeft} jam ${minsLeft} mnt` : `${minsLeft} menit`;

    return {
      isOpen: false,
      statusLabel: 'Klinik Tutup',
      detailLabel: 'Tutup (Buka 16:00 WIB)',
      explanation: `Praktik hari ini buka pukul 16:00 - 21:00 WIB (sekitar ${timeRemaining} lagi).`,
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
      isWorkDay: true,
    };
  }

  // Setelah 21:00 WIB
  return {
    isOpen: false,
    statusLabel: 'Klinik Tutup',
    detailLabel: 'Tutup (Selesai Praktik)',
    explanation: 'Jam praktik hari ini telah selesai. Buka kembali besok pukul 16:00 WIB.',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    dotColor: 'bg-rose-500',
    isWorkDay: true,
  };
}
