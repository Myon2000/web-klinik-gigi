import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await prisma.securityAuditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Gagal memuat log audit keamanan.' }, { status: 500 });
  }
}
