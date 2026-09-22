import { test, expect } from '@playwright/test';
import { sanitizeText, sanitizeExcelCell } from '../src/lib/sanitize';

test.describe('Security Utilities - Unit & Logic Verification', () => {
  test('1. sanitizeText membersihkan script dan tag HTML berbahaya (Stored XSS)', () => {
    const maliciousScript = "Budi Santoso<script>alert('XSS')</script>";
    expect(sanitizeText(maliciousScript)).toBe('Budi Santoso');

    const maliciousImg = "Gigi sakit <img src=x onerror=alert('hack')> di geraham";
    expect(sanitizeText(maliciousImg)).toBe('Gigi sakit  di geraham');

    const pseudoJs = "Klinik javascript:alert('pwned')";
    expect(sanitizeText(pseudoJs)).toBe("Klinik alert('pwned')");
  });

  test('2. sanitizeExcelCell memproteksi Formula Injection (=, +, -, @)', () => {
    expect(sanitizeExcelCell("=CMD|' /C calc'!A0")).toBe("'=CMD|' /C calc'!A0");
    expect(sanitizeExcelCell("+628123456789")).toBe("'+628123456789");
    expect(sanitizeExcelCell("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
    expect(sanitizeExcelCell("-1000")).toBe("'-1000");
    expect(sanitizeExcelCell("Budi Santoso")).toBe("Budi Santoso");
  });

  test('3. Honeypot Bot Trap menjebak bot otomatis dan melakukan Silent Drop', async ({ request }) => {
    const res = await request.post('/api/appointments', {
      data: {
        nama: 'Bot Spammer',
        nomor_hp: '081299998888',
        tempat_lahir: 'Unknown',
        tanggal_lahir: '2000-01-01',
        alamat: 'http://spam-link.com',
        keluhan: 'Buy cheap watches now',
        user_website: 'http://bot-automated-spammer.com',
      },
    });

    expect(res.status()).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.token).toBe('trapped');
  });

  test('3b. Honeypot Bot Trap dari UI browser: input DOM yang diisi tidak terhapus saat mengetik dan dibuang', async ({ page }) => {
    await page.goto('/');

    // 1. Bot atau DevTools mengisi honeypot
    await page.evaluate(() => {
      document.querySelector('input[name="user_website"]').value = "http://bot-console-trap.com";
    });

    // 2. Ketik kolom-kolom lain (memastikan re-render React tidak menghapus nilai honeypot)
    const uniquePhone = '0899' + Math.floor(10000000 + Math.random() * 90000000);
    await page.fill('input[name="nama"]', 'Bot Spammer Browser');
    await page.fill('input[name="nomor_hp"]', uniquePhone);
    await page.fill('input[name="tempat_lahir"]', 'Cyber');
    await page.fill('input[name="tanggal_lahir"]', '1999-01-01');
    await page.fill('textarea[name="alamat"]', 'Internet');
    await page.fill('textarea[name="keluhan"]', 'Spamming via browser');

    // 3. Verifikasi sebelum submit bahwa honeypot tetap terisi
    const honeypotVal = await page.evaluate(() => document.querySelector('input[name="user_website"]').value);
    expect(honeypotVal).toBe('http://bot-console-trap.com');

    // 4. Submit
    await page.click('button[type="submit"]');

    // 5. Modal sukses tetap muncul (agar bot mengira sukses)
    const popupHeading = page.getByRole('heading', { name: 'Pendaftaran Konsultasi Berhasil!' });
    await expect(popupHeading).toBeVisible({ timeout: 20000 });
  });

  test('4. Server mengembalikan Security Headers lengkap (CSP, HSTS, X-Frame-Options, dll)', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);

    const headers = res.headers();
    expect(headers['content-security-policy']).toBeDefined();
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['strict-transport-security']).toContain('max-age=63072000');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['cross-origin-opener-policy']).toBe('same-origin-allow-popups');
  });

  test('5. Proteksi CSRF menolak mutasi admin yang berasal dari Origin asing (Cross-Origin)', async ({ request }) => {
    const res = await request.patch('/api/admin/appointments/1', {
      headers: {
        Origin: 'https://evil-hacker-site.com',
      },
      data: {
        status: 'BATAL',
      },
    });

    expect(res.status()).toBe(403);
    const json = await res.json();
    expect(json.error).toContain('Origin Mismatch');
  });

  test('6. Proteksi CSRF menolak mutasi admin dengan Origin "null"', async ({ request }) => {
    const res = await request.post('/api/admin/appointments', {
      headers: {
        Origin: 'null',
      },
      data: {
        nama: 'Attack',
      },
    });

    expect(res.status()).toBe(403);
    const json = await res.json();
    expect(json.error).toContain('Null Origin');
  });

  test('7. Sistem audit trail mencatat log keamanan login dan dapat diakses via API audit-logs', async ({ request, page }) => {
    // 1. Coba login salah untuk memicu log LOGIN_FAILED
    await request.post('/api/admin/auth/login', {
      data: {
        username: 'fake_auditor',
        password: 'wrong_password',
      },
    });

    // 2. Login resmi via page untuk mendapatkan session cookie
    await page.goto('/admin/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // 3. Verifikasi endpoint /api/admin/audit-logs
    const cookies = await page.context().cookies();
    const adminToken = cookies.find((c) => c.name === 'admin_token')?.value;

    const auditRes = await request.get('/api/admin/audit-logs', {
      headers: {
        Cookie: `admin_token=${adminToken}`,
      },
    });

    expect(auditRes.status()).toBe(200);
    const auditData = await auditRes.json();
    expect(auditData.success).toBe(true);
    expect(Array.isArray(auditData.data)).toBe(true);
    expect(auditData.data.length).toBeGreaterThan(0);

    const hasFailedAttempt = auditData.data.some(
      (log) => log.action === 'LOGIN_FAILED' && log.actor === 'fake_auditor'
    );
    expect(hasFailedAttempt).toBe(true);
  });

  test('8. Pengalihan SSO: saat dialihkan ke /admin/login?reason=single-session, middleware tidak melempar balik ke dashboard', async ({ page }) => {
    // 1. Login dulu
    await page.goto('/admin/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // 2. Navigasi ke /admin/login?reason=single-session
    await page.goto('/admin/login?reason=single-session');

    // 3. Pastikan tetap di halaman login (tidak terpental balik ke dashboard)
    await expect(page).toHaveURL(/.*\/admin\/login\?reason=single-session/);
    await expect(page.locator('text=/.*Akun Anda telah masuk di perangkat lain.*/')).toBeVisible();

    // 4. Verifikasi bahwa cookie admin_token telah dihapus
    const cookies = await page.context().cookies();
    const tokenCookie = cookies.find((c) => c.name === 'admin_token');
    expect(tokenCookie).toBeUndefined();
  });
});
