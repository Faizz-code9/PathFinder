import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';

export async function GET() {
  try {
    const res = await pool.query('SELECT id, name FROM companies ORDER BY name ASC');
    return NextResponse.json({ companies: res.rows });
  } catch (err) {
    console.error('Fetch companies error:', err);
    return NextResponse.json({ error: 'Failed to fetch companies.' }, { status: 500 });
  }
}
