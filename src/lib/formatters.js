/**
 * Format tanggal ke format lokal Indonesia (contoh: 15 Sep 2026 atau Senin, 15 September 2026)
 */
export function formatTanggal(dateStr, includeDayName = false) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';

  if (includeDayName) {
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format nominal angka ke format mata uang Rupiah (contoh: Rp 250.000)
 */
export function formatRupiah(number) {
  if (!number && number !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(number);
}

/**
 * Bersihkan nomor telepon dan ubah awalan 0 menjadi 62 untuk WhatsApp
 */
export function formatWhatsAppNumber(phoneNumber) {
  if (!phoneNumber) return '';
  let clean = phoneNumber.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62')) {
    clean = '62' + clean;
  }
  return clean;
}

/**
 * Buat tautan URL pesan WhatsApp konfirmasi jadwal beserta template teks
 */
export function buildWhatsAppLink({ nama, nomorHp, tanggalJanji, jamJanji, token, origin }) {
  const cleanPhone = formatWhatsAppNumber(nomorHp);
  const dateFormatted = formatTanggal(tanggalJanji, true);
  const confirmUrl = `${origin}/konfirmasi/${token}`;

  const message = `Halo Bapak/Ibu ${nama},\n\nKami dari Klinik Gigi Dokter Gigi ingin mengonfirmasi jadwal konsultasi Anda:\n📅 *Hari/Tanggal:* ${dateFormatted}\n⏰ *Pukul:* ${jamJanji} WIB\n\nSilakan klik tautan berikut untuk *konfirmasi kehadiran* Anda:\n👉 ${confirmUrl}\n\nJika Anda berhalangan hadir atau ingin menjadwalkan ulang di jam lain, silakan langsung balas pesan WhatsApp ini.\n\nTerima kasih! 🙏`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
