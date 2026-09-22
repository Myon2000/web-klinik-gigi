import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'klinik-gigi-super-secret-key-pkl-2026';
const encodedKey = new TextEncoder().encode(SECRET_KEY);

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;
  const payload = token ? await verifyToken(token) : null;
  const isAuthenticated = Boolean(payload?.id);

  // 1. Proteksi CSRF (Cross-Site Request Forgery) pada mutasi admin & pengaturan klinik
  if (
    (pathname.startsWith('/api/admin') || pathname === '/api/clinic-settings') &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
  ) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // Blokir jika origin adalah 'null' (misal dari sandboxed iframe jahat)
    if (origin === 'null') {
      return new NextResponse(
        JSON.stringify({ error: 'Akses ditolak: Permintaan tidak sah (Null Origin).' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let requestOriginHost = null;
    if (origin) {
      try {
        requestOriginHost = new URL(origin).host;
      } catch {}
    } else if (referer) {
      try {
        requestOriginHost = new URL(referer).host;
      } catch {}
    }

    // Jika origin atau referer berasal dari luar domain klinik (Cross-Origin), tolak akses
    if (requestOriginHost && host && requestOriginHost !== host) {
      return new NextResponse(
        JSON.stringify({ error: 'Akses ditolak: Verifikasi keamanan CSRF gagal (Origin Mismatch).' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 2. Jika mengakses halaman login
  if (pathname === '/admin/login') {
    const reason = request.nextUrl.searchParams.get('reason');
    if (reason) {
      // Jika dialihkan karena sesi berakhir (single-session atau inactivity):
      // Hapus cookie sesi basi seketika dan izinkan halaman login terbuka dengan pemberitahuan
      const response = NextResponse.next();
      response.cookies.delete('admin_token');
      return response;
    }

    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 3. Proteksi rute halaman admin (/admin, /admin/dashboard, dll)
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/clinic-settings',
  ],
};
