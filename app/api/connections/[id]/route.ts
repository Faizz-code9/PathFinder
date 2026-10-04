import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';
import { runCypher } from '@/lib/db/neo4j';
import { getCurrentUserFromHeaders } from '@/lib/auth';
import { ConnectionActionSchema } from '@/lib/validators';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connectionId = Number(id);
    const currentUser = await getCurrentUserFromHeaders();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const validated = ConnectionActionSchema.parse(body);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Fetch connection request
      const fetchRes = await client.query(
        `SELECT id, sender_id, receiver_id, rel_type, status
         FROM connection_requests
         WHERE id = $1`,
        [connectionId]
      );

      if (fetchRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Connection request not found.' }, { status: 404 });
      }

      const conn = fetchRes.rows[0];

      // Only the receiver or admin can accept/reject
      if (conn.receiver_id !== currentUser.userId && currentUser.role !== 'admin') {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Forbidden: Only the recipient can accept or reject this request.' },
          { status: 403 }
        );
      }

      // Update PostgreSQL status (This triggers trg_connection_audit automatically!)
      const updateRes = await client.query(
        `UPDATE connection_requests
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [validated.status, connectionId]
      );

      if (validated.status === 'accepted') {
        // Calculate dynamic strength
        const strengthRes = await client.query(
          `SELECT calculate_connection_strength($1, $2) AS strength`,
          [conn.sender_id, conn.receiver_id]
        );
        const strength = strengthRes.rows[0]?.strength || 0.8;

        // 🔑 Dual-Write to Neo4j (Mirrors graph edge with idempotency)
        try {
          await runCypher(
            `MATCH (p1:Person {userId: $u1})
             MATCH (p2:Person {userId: $u2})
             MERGE (p1)-[r1:KNOWS {relType: $relType}]->(p2)
             SET r1.strength = $strength, r1.since = toString(datetime())
             MERGE (p2)-[r2:KNOWS {relType: $relType}]->(p1)
             SET r2.strength = $strength, r2.since = toString(datetime())`,
            {
              u1: conn.sender_id,
              u2: conn.receiver_id,
              relType: conn.rel_type,
              strength: strength,
            }
          );
        } catch (neo4jErr) {
          // Distributed Transaction Failure: Rollback PostgreSQL to prevent split-brain state
          await client.query('ROLLBACK');
          console.error('[Dual-Write Error] Neo4j write failed, rolled back PostgreSQL:', neo4jErr);
          return NextResponse.json(
            { error: 'Graph synchronization failed. Operation was safely rolled back.' },
            { status: 502 }
          );
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({
        connection: updateRes.rows[0],
        message: `Connection request ${validated.status} successfully.`,
      });
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
    console.error('Connection Update Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connectionId = Number(id);
    const currentUser = await getCurrentUserFromHeaders();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const fetchRes = await client.query(
        `SELECT id, sender_id, receiver_id, status
         FROM connection_requests
         WHERE id = $1`,
        [connectionId]
      );

      if (fetchRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Connection record not found.' }, { status: 404 });
      }

      const conn = fetchRes.rows[0];

      if (
        conn.sender_id !== currentUser.userId &&
        conn.receiver_id !== currentUser.userId &&
        currentUser.role !== 'admin'
      ) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
      }

      // Delete from PostgreSQL
      await client.query(`DELETE FROM connection_requests WHERE id = $1`, [connectionId]);

      // Remove from Neo4j if it was an active connection
      if (conn.status === 'accepted') {
        try {
          await runCypher(
            `MATCH (p1:Person {userId: $u1})-[r:KNOWS]-(p2:Person {userId: $u2})
             DELETE r`,
            { u1: conn.sender_id, u2: conn.receiver_id }
          );
        } catch (graphErr) {
          console.error('[Neo4j Edge Delete Warning]:', graphErr);
        }
      }

      await client.query('COMMIT');

      return NextResponse.json({ success: true, message: 'Connection removed successfully.' });
    } catch (dbErr) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Delete Connection Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
