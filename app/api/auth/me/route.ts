import { NextResponse } from 'next/server';
import { getCurrentUserFromHeaders } from '@/lib/auth';
import { pool } from '@/lib/db/postgres';

export async function GET(request: Request) {
  try {
    let currentUser = await getCurrentUserFromHeaders();

    if (!currentUser) {
      // Fallback check from middleware header
      const headerUserId = request.headers.get('x-user-id');
      if (headerUserId) {
        currentUser = {
          userId: Number(headerUserId),
          email: request.headers.get('x-user-email') || '',
          role: (request.headers.get('x-user-role') as any) || 'user',
        };
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT u.id, u.email, u.role, u.is_active, u.created_at,
              p.full_name, p.headline, p.bio, p.location, p.avatar_url, p.linkedin_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [currentUser.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Me Auth Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
