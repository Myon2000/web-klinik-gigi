import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, nomor_hp, tempat_lahir, tanggal_lahir, alamat, keluhan } = body;

    const query = `
      INSERT INTO appointments (nama, nomor_hp, tempat_lahir, tanggal_lahir, alamat, keluhan)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nama, status
    `;
    
    const values = [nama, nomor_hp, tempat_lahir, tanggal_lahir, alamat, keluhan];
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error insert data:', error);
    return NextResponse.json({ error: 'Gagal mendaftar jadwal' }, { status: 500 });
  }
}