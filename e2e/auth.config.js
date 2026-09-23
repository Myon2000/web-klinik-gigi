/**
 * Konfigurasi Kredensial untuk Pengujian Otomatis E2E Playwright.
 * Mengutamakan variabel lingkungan TEST_ADMIN_USER / TEST_ADMIN_PASS jika ada,
 * atau menggunakan fallback nilai seed default 'admin' / 'admin123' untuk lingkungan lokal baru.
 */
export const ADMIN_USERNAME = process.env.TEST_ADMIN_USER || 'admin';
export const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASS || 'admin123';
