import prisma from './prisma.js';

/**
 * Mendapatkan IP klien dari header HTTP Next.js / Vercel
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Memeriksa limit permintaan per IP
 * @param {string} key - Identifier limit (misal: "ip:127.0.0.1")
 * @param {number} maxRequests - Maksimal permintaan yang diizinkan (default: 3)
 * @param {number} windowInMinutes - Jendela waktu dalam menit (default: 10)
 */
export async function checkRateLimit(key, maxRequests = 3, windowInMinutes = 10) {
  try {
    const now = new Date();

    const record = await prisma.rateLimit.findUnique({
      where: { key },
    });

    if (!record || record.expiresAt < now) {
      const expiresAt = new Date(now.getTime() + windowInMinutes * 60 * 1000);
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, expiresAt },
        create: { key, count: 1, expiresAt },
      });
      return { success: true, remaining: maxRequests - 1 };
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000)
      );
      return {
        success: false,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    const updated = await prisma.rateLimit.update({
      where: { key },
      data: { count: record.count + 1 },
    });

    return {
      success: true,
      remaining: Math.max(0, maxRequests - updated.count),
    };
  } catch (error) {
    console.error('Error saat memeriksa rate limit IP:', error);
    // Jika ada error DB pada rate limiter, jangan gagalkan sistem pengguna (fail-open)
    return { success: true, remaining: 1 };
  }
}

/**
 * Memeriksa apakah nomor WhatsApp baru saja mendaftar atau masih dalam antrean
 * @param {string} phone - Nomor HP pasien
 * @param {number} cooldownMinutes - Waktu tunggu dalam menit (default: 15)
 */
export async function checkPhoneCooldown(phone, cooldownMinutes = 15) {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 8) return { allowed: true };

    const now = new Date();
    const cutoffTime = new Date(now.getTime() - cooldownMinutes * 60 * 1000);
    const searchPattern = cleanPhone.slice(-8); // 8 digit terakhir agar fleksibel 08xx vs 628xx

    const recentAppointment = await prisma.appointment.findFirst({
      where: {
        nomorHp: {
          contains: searchPattern,
        },
        OR: [
          { createdAt: { gte: cutoffTime } },
          { status: 'MENUNGGU_JADWAL' },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentAppointment) {
      const isStillPending = recentAppointment.status === 'MENUNGGU_JADWAL';
      const diffMs = now.getTime() - new Date(recentAppointment.createdAt).getTime();
      const remainingSeconds = Math.max(
        1,
        Math.ceil((cooldownMinutes * 60 * 1000 - diffMs) / 1000)
      );

      return {
        allowed: false,
        isStillPending,
        remainingSeconds: Math.ceil(remainingSeconds / 60), // dalam menit
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error saat memeriksa cooldown nomor HP:', error);
    return { allowed: true };
  }
}
