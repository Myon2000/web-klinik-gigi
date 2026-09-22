import prisma from '@/lib/prisma';

/**
 * Mencatat peristiwa keamanan sensitif ke dalam basis data PostgreSQL (Security Audit Trail)
 * @param {Object} params
 * @param {string} params.action - Jenis aksi (LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, PASSWORD_CHANGED, RESET_TEST_DATA, DELETE_APPOINTMENT)
 * @param {string} [params.actor] - Username pelaku aksi atau 'SYSTEM'
 * @param {string} [params.ip] - Alamat IP pelaku aksi
 * @param {string} [params.details] - Deskripsi rincian konteks keamanan
 */
export async function logSecurityEvent({ action, actor, ip, details }) {
  try {
    return await prisma.securityAuditLog.create({
      data: {
        action: String(action),
        actor: actor ? String(actor).slice(0, 100) : 'SYSTEM',
        ip: ip ? String(ip).slice(0, 50) : null,
        details: details ? String(details).slice(0, 500) : null,
      },
    });
  } catch (err) {
    console.error('[SecurityAudit] Gagal mencatat log keamanan:', err);
    return null;
  }
}
