import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';
import { getCurrentUserFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUserFromHeaders();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);

    const result = await pool.query(
      `SELECT a.id, a.user_id, a.action, a.target_id, a.metadata, a.created_at,
              p.full_name AS user_name, p.avatar_url AS user_avatar,
              tp.full_name AS target_name
       FROM activity_log a
       JOIN profiles p ON a.user_id = p.user_id
       LEFT JOIN profiles tp ON a.target_id = tp.user_id
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limit]
    );

    return NextResponse.json({ logs: result.rows });
  } catch (err) {
    console.error('Audit Log Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
