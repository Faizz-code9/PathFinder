import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';
import { getCurrentUserFromHeaders } from '@/lib/auth';
import { ConnectionRequestSchema } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUserFromHeaders();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let sql = `
      SELECT connection_id, user_id, partner_id, partner_name,
             partner_headline, partner_location, partner_avatar,
             rel_type, status, direction, created_at, updated_at
      FROM v_user_connections
      WHERE user_id = $1
    `;
    const params: any[] = [currentUser.userId];

    if (statusFilter) {
      params.push(statusFilter);
      sql += ` AND status = $2`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await pool.query(sql, params);
    return NextResponse.json({ connections: result.rows });
  } catch (err) {
    console.error('Fetch Connections Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUserFromHeaders();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const validated = ConnectionRequestSchema.parse(body);

    if (currentUser.userId === validated.receiverId) {
      return NextResponse.json(
        { error: 'You cannot send a connection request to yourself.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check existing connection or request
      const existing = await client.query(
        `SELECT id, status, sender_id, receiver_id
         FROM connection_requests
         WHERE (sender_id = $1 AND receiver_id = $2)
            OR (sender_id = $2 AND receiver_id = $1)`,
        [currentUser.userId, validated.receiverId]
      );

      if (existing.rows.length > 0) {
        const conn = existing.rows[0];
        await client.query('ROLLBACK');
        return NextResponse.json(
          {
            error: `Connection request already exists with status: ${conn.status}.`,
            existingConnection: conn,
          },
          { status: 409 }
        );
      }

      // Insert connection request
      const insertRes = await client.query(
        `INSERT INTO connection_requests (sender_id, receiver_id, rel_type, status, message)
         VALUES ($1, $2, $3, 'pending', $4)
         RETURNING *`,
        [
          currentUser.userId,
          validated.receiverId,
          validated.relType,
          validated.message || null,
        ]
      );

      // Audit log entry
      await client.query(
        `INSERT INTO activity_log (user_id, action, target_id, metadata)
         VALUES ($1, 'CONNECTION_REQUEST_SENT', $2, $3)`,
        [
          currentUser.userId,
          validated.receiverId,
          JSON.stringify({ rel_type: validated.relType, message: validated.message }),
        ]
      );

      await client.query('COMMIT');

      return NextResponse.json(
        { connection: insertRes.rows[0], message: 'Connection request sent successfully.' },
        { status: 201 }
      );
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 });
    }
    console.error('Send Connection Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
