/**
 * Modul Keamanan: Sanitasi Input Pengguna & Proteksi OWASP CSV/Formula Injection
 */

/**
 * Membersihkan input teks dari tag HTML dan injeksi script (Stored XSS defense)
 * @param {string} input - Teks mentah dari formulir
 * @returns {string} - Teks polos yang aman
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // Hapus null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Hapus script tags beserta isinya
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Hapus style tags beserta isinya
    .replace(/<[^>]+>/g, '') // Hapus semua tag HTML
    .replace(/javascript:/gi, '') // Cegah protokol pseudo-javascript
    .replace(/data:\s*text\/html/gi, '') // Cegah data URI HTML injection
    .trim();
}

/**
 * Proteksi terhadap OWASP CSV / Formula Injection (CWE-1236)
 * Mencegah eksekusi formula jahat (misal: =cmd|' /C calc'!A0 atau @SUM) saat file Excel dibuka oleh dokter/admin.
 * Karakter pembuka formula disematkan tanda petik tunggal (') agar Excel membacanya murni sebagai literal string.
 * @param {any} value - Nilai sel Excel
 * @returns {any} - Nilai yang aman diekspor ke Excel
 */
export function sanitizeExcelCell(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];
  if (dangerousChars.some((char) => trimmed.startsWith(char))) {
    return `'${trimmed}`;
  }
  return trimmed;
}
