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
    const search = searchParams.get('q') || '';

    let sql = `
      SELECT u.id, u.email, u.role, u.is_active, u.created_at, u.updated_at,
             p.full_name, p.headline, p.location, p.avatar_url,
             (SELECT COUNT(*) FROM connection_requests cr 
              WHERE (cr.sender_id = u.id OR cr.receiver_id = u.id) AND cr.status = 'accepted') AS connection_count
      FROM users u
      JOIN profiles p ON u.id = p.user_id
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` WHERE p.full_name ILIKE $1 OR u.email ILIKE $1 OR p.headline ILIKE $1`;
    }

    sql += ` ORDER BY u.id ASC`;

    const result = await pool.query(sql, params);
    return NextResponse.json({ users: result.rows });
  } catch (err) {
    console.error('Admin Users Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUserFromHeaders();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, isActive } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updates: string[] = [];
      const params: any[] = [];

      if (role !== undefined && ['user', 'admin'].includes(role)) {
        params.push(role);
        updates.push(`role = $${params.length}`);
      }

      if (isActive !== undefined) {
        params.push(Boolean(isActive));
        updates.push(`is_active = $${params.length}`);
      }

      if (updates.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'No valid fields provided for update.' }, { status: 400 });
      }

      params.push(userId);
      const sql = `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length} RETURNING *`;
      const result = await client.query(sql, params);

      // Audit log
      await client.query(
        `INSERT INTO activity_log (user_id, action, target_id, metadata)
         VALUES ($1, 'ADMIN_USER_MODIFIED', $2, $3)`,
        [currentUser.userId, userId, JSON.stringify({ role, isActive })]
      );

      await client.query('COMMIT');
      return NextResponse.json({ user: result.rows[0], message: 'User updated successfully.' });
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Admin User Update Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
