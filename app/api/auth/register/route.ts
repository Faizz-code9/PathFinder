import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';
import { runCypher } from '@/lib/db/neo4j';
import { hashPassword, signToken } from '@/lib/auth';
import { RegisterSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = RegisterSchema.parse(body);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check duplicate email
      const existing = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [validated.email.toLowerCase()]
      );

      if (existing.rows.length > 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'An account with this email address already exists.' },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await hashPassword(validated.password);

      // 1. Insert into PostgreSQL users table
      const userRes = await client.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, 'user')
         RETURNING id, email, role, created_at`,
        [validated.email.toLowerCase(), passwordHash]
      );
      const newUser = userRes.rows[0];

      // 2. Insert into PostgreSQL profiles table
      const defaultAvatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`;
      const profileRes = await client.query(
        `INSERT INTO profiles (user_id, full_name, headline, bio, location, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING full_name, headline, bio, location, avatar_url`,
        [
          newUser.id,
          validated.fullName,
          validated.headline || 'Professional on PathFinder',
          validated.bio || '',
          validated.location || 'Remote',
          defaultAvatar,
        ]
      );
      const profile = profileRes.rows[0];

      // 3. Log user creation in activity_log
      await client.query(
        `INSERT INTO activity_log (user_id, action, metadata)
         VALUES ($1, 'USER_REGISTERED', $2)`,
        [newUser.id, JSON.stringify({ email: newUser.email, name: profile.full_name })]
      );

      await client.query('COMMIT');

      // 4. Dual-Write to Neo4j (Mirror Person Node)
      try {
        await runCypher(
          `MERGE (p:Person {userId: $userId})
           SET p.name = $name,
               p.headline = $headline,
               p.avatarUrl = $avatarUrl`,
          {
            userId: newUser.id,
            name: profile.full_name,
            headline: profile.headline,
            avatarUrl: profile.avatar_url,
          }
        );
      } catch (graphErr) {
        console.error('[Dual-Write Warning] Failed to mirror user to Neo4j:', graphErr);
      }

      // Sign JWT
      const token = await signToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: profile.full_name,
        avatarUrl: profile.avatar_url,
      });

      const response = NextResponse.json({
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: profile.full_name,
          headline: profile.headline,
          avatarUrl: profile.avatar_url,
        },
        token,
      });

      response.cookies.set('pathfinder_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
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
    console.error('Registration Error:', err);
    return NextResponse.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
