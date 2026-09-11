import { test, expect } from '@playwright/test';

test.describe('Klinik Gigi - E2E Testing Suite', () => {
  test('1. Pasien dapat mengakses halaman pendaftaran dan mengirim data konsultasi', async ({ page }) => {
    await page.goto('/');

    // Verifikasi elemen halaman publik
    await expect(page.getByRole('heading', { name: 'Formulir Pendaftaran Pasien' })).toBeVisible();

    // Mengisi formulir pendaftaran
    await page.fill('input[name="nama"]', 'Tes Pasien E2E');
    await page.fill('input[name="nomor_hp"]', '081299887766');
    await page.fill('input[name="tempat_lahir"]', 'Jakarta');
    await page.fill('input[name="tanggal_lahir"]', '1995-08-17');
    await page.fill('textarea[name="alamat"]', 'Jl. Sudirman Kav 10, Jakarta Selatan');
    await page.fill('textarea[name="keluhan"]', 'Gigi geraham atas berlubang dan ngilu saat makan manis');

    // Submit formulir
    await page.click('button[type="submit"]');

    // Verifikasi pop-up notifikasi berhasil muncul
    const popupHeading = page.getByRole('heading', { name: 'Pendaftaran Konsultasi Berhasil!' });
    await expect(popupHeading).toBeVisible({ timeout: 10000 });

    // Verifikasi tombol tutup pop-up dapat menutup modal
    await page.click('button:has-text("Mengerti & Tutup")');
    await expect(popupHeading).not.toBeVisible();
  });

  test('2. Pengujian halaman login admin dengan kredensial salah dan benar', async ({ page }) => {
    await page.goto('/admin/login');

    await expect(page.getByRole('heading', { name: 'Portal Masuk Admin' })).toBeVisible();

    // Uji dengan password salah
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'passwordsalah123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Username atau password salah.')).toBeVisible({ timeout: 5000 });

    // Uji dengan password benar (default PKL: admin123)
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Menunggu pengalihan ke dashboard
    await expect(page).toHaveURL(/.*\/admin\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Panel Admin Klinik' })).toBeVisible();
  });

  test('3. Dashboard admin menampilkan ringkasan statistik dan tombol tindakan', async ({ page }) => {
    // Login terlebih dahulu
    await page.goto('/admin/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // Verifikasi metrik filter/tab
    await expect(page.getByRole('button', { name: 'Menunggu Konfirmasi' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Terkonfirmasi' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Selesai' })).toBeVisible();

    // Verifikasi tombol-tombol fungsional
    await expect(page.locator('button:has-text("Pasien Manual")')).toBeVisible();
    await expect(page.locator('button:has-text("Ekspor Excel")')).toBeVisible();
  });
});
