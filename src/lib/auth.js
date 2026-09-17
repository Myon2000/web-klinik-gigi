import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET || 'klinik-gigi-super-secret-key-pkl-2026';
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function createAdminToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;

  const payload = await verifyAdminToken(token);
  if (!payload || !payload.id) return null;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: { id: true, username: true, sessionToken: true },
    });

    if (!admin) return null;

    // Single Active Session: Sesi lama ditendang jika ada login baru di perangkat lain
    if (payload.sessionToken && admin.sessionToken && payload.sessionToken !== admin.sessionToken) {
      return null;
    }

    return { id: admin.id, username: admin.username };
  } catch (err) {
    console.error('Error validating admin session:', err);
    return null;
  }
}
