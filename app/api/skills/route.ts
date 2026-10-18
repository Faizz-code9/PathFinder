import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';

export async function GET() {
  try {
    const res = await pool.query('SELECT id, name FROM skills ORDER BY name ASC');
    return NextResponse.json({ skills: res.rows });
  } catch (err) {
    console.error('Fetch skills error:', err);
    return NextResponse.json({ error: 'Failed to fetch skills.' }, { status: 500 });
  }
}
