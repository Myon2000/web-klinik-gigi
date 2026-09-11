import { getAdminSession } from '@/lib/auth';
import { appointmentEvents } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = await getAdminSession();
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Kirim pesan inisiasi koneksi
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ message: 'Realtime SSE terhubung' })}\n\n`)
      );

      // 2. Listener saat ada pendaftaran pasien baru
      const onNewAppointment = (appointment) => {
        try {
          const payload = `event: new-appointment\ndata: ${JSON.stringify(appointment)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch (err) {
          console.error('Error saat streaming SSE appointment:', err);
        }
      };

      appointmentEvents.on('new-appointment', onNewAppointment);

      // 3. Heartbeat ping berkala agar koneksi tidak diputus proxy / Vercel
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          clearInterval(pingInterval);
        }
      }, 15000);

      // 4. Bersihkan listener ketika koneksi ditutup/dibatalkan oleh client
      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        appointmentEvents.off('new-appointment', onNewAppointment);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Menghindari buffering pada NGINX / proxy
    },
  });
}
