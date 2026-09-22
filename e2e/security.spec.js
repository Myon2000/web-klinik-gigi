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
});
