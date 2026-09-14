/**
 * Kamus Kategori Keluhan Pasien Berdasarkan Kata Kunci (Keyword Classification)
 */
export const COMPLAINT_CATEGORIES = [
  {
    id: 'karies',
    name: 'Gigi Berlubang / Karies',
    color: 'bg-rose-500',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    keywords: ['lubang', 'bolong', 'karies', 'tambal', 'ngilu', 'tumpatan', 'berlubang', 'ngilu'],
  },
  {
    id: 'scaling',
    name: 'Pembersihan Karang (Scaling)',
    color: 'bg-cyan-500',
    textColor: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    keywords: ['karang', 'scaling', 'plak', 'kotor', 'pembersihan', 'bau mulut', 'karang gigi'],
  },
  {
    id: 'cabut',
    name: 'Cabut Gigi / Gigi Bungsu',
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    keywords: ['cabut', 'bungsu', 'impaksi', 'goyang', 'patah', 'tanggal', 'copot', 'ekstraksi', 'odontektomi'],
  },
  {
    id: 'behel',
    name: 'Kawat Gigi / Behel (Ortodonti)',
    color: 'bg-indigo-500',
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    keywords: ['behel', 'kawat', 'merapikan', 'rapi', 'orto', 'ortho', 'bracket', 'karet'],
  },
  {
    id: 'gusi',
    name: 'Gusi & Infeksi',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    keywords: ['gusi', 'bengkak', 'darah', 'berdarah', 'sariawan', 'abses', 'nanah', 'radang', 'pipi'],
  },
  {
    id: 'umum',
    name: 'Konsultasi & Pemeriksaan Umum',
    color: 'bg-slate-400',
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-50',
    keywords: [],
  },
];

/**
 * Klasifikasi teks keluhan bebas ke dalam salah satu kategori standar
 */
export function classifyComplaint(complaintText) {
  if (!complaintText) return 'Konsultasi & Pemeriksaan Umum';
  const lower = complaintText.toLowerCase();

  for (const cat of COMPLAINT_CATEGORIES) {
    if (cat.keywords.length > 0 && cat.keywords.some((k) => lower.includes(k))) {
      return cat.name;
    }
  }

  return 'Konsultasi & Pemeriksaan Umum';
}

/**
 * Hitung statistik persentase dan jumlah keluhan pasien
 */
export function getComplaintStats(appointments) {
  if (!appointments || appointments.length === 0) return [];

  const counts = {};
  COMPLAINT_CATEGORIES.forEach((c) => {
    counts[c.name] = 0;
  });

  appointments.forEach((appt) => {
    const category = classifyComplaint(appt.keluhan);
    counts[category] = (counts[category] || 0) + 1;
  });

  const total = appointments.length;

  return COMPLAINT_CATEGORIES.map((c) => {
    const count = counts[c.name] || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      name: c.name,
      count,
      percentage,
      color: c.color,
      textColor: c.textColor,
      bgColor: c.bgColor,
    };
  }).sort((a, b) => b.count - a.count);
}

/**
 * Master Data Daftar Tindakan Medis Standar & Rekomendasi Tarif
 */
export const MASTER_TREATMENTS = [
  { name: 'Pembersihan Karang Gigi (Scaling)', defaultBiaya: 250000, kategori: 'Preventif' },
  { name: 'Penambalan Gigi Komposit / Sinar', defaultBiaya: 300000, kategori: 'Konservasi' },
  { name: 'Pencabutan Gigi Dewasa', defaultBiaya: 250000, kategori: 'Bedah Minor' },
  { name: 'Pencabutan Gigi Anak (Sulung)', defaultBiaya: 150000, kategori: 'Pedodonsia' },
  { name: 'Perawatan Saluran Akar (PSA)', defaultBiaya: 450000, kategori: 'Endodontik' },
  { name: 'Pencabutan Gigi Bungsu (Odontektomi)', defaultBiaya: 1500000, kategori: 'Bedah Mulut' },
  { name: 'Pemasangan Kawat Gigi (Behel)', defaultBiaya: 3500000, kategori: 'Ortodonti' },
  { name: 'Kontrol & Ganti Karet Behel', defaultBiaya: 100000, kategori: 'Ortodonti' },
  { name: 'Pemutihan Gigi (Bleaching)', defaultBiaya: 1800000, kategori: 'Estetika' },
  { name: 'Pembuatan Gigi Tiruan (Gigi Palsu)', defaultBiaya: 850000, kategori: 'Prostodonsia' },
  { name: 'Konsultasi & Pemeriksaan Umum', defaultBiaya: 100000, kategori: 'Diagnostik' },
];

/**
 * Hitung analitik tindakan medis dokter dari pasien yang sudah selesai (SELESAI)
 */
export function getTreatmentStats(appointments) {
  if (!appointments) return { totalTindakan: 0, totalPendapatan: 0, items: [] };

  const doneAppointments = appointments.filter(
    (a) => a.status === 'SELESAI' && a.tindakan && a.tindakan.trim() !== ''
  );

  if (doneAppointments.length === 0) {
    return { totalTindakan: 0, totalPendapatan: 0, items: [] };
  }

  const grouped = {};
  let totalPendapatan = 0;

  doneAppointments.forEach((appt) => {
    const rawTindakan = appt.tindakan.trim();
    // Cari apakah cocok dengan salah satu master treatment
    const matched = MASTER_TREATMENTS.find((m) =>
      rawTindakan.toLowerCase().includes(m.name.toLowerCase().split('(')[0].trim())
    );
    const key = matched ? matched.name : rawTindakan;
    const biaya = appt.biaya ? Number(appt.biaya) : 0;
    totalPendapatan += biaya;

    if (!grouped[key]) {
      grouped[key] = {
        name: key,
        count: 0,
        totalBiaya: 0,
      };
    }
    grouped[key].count += 1;
    grouped[key].totalBiaya += biaya;
  });

  const totalTindakan = doneAppointments.length;

  const items = Object.values(grouped)
    .map((item) => ({
      ...item,
      percentage: totalTindakan > 0 ? Math.round((item.count / totalTindakan) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalTindakan,
    totalPendapatan,
    items,
  };
}
