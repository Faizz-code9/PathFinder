import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';
import { runCypher } from '@/lib/db/neo4j';
import { getCurrentUserFromHeaders } from '@/lib/auth';
import { ProfileUpdateSchema } from '@/lib/validators';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
    }

    const currentUser = await getCurrentUserFromHeaders();
    const viewerId = currentUser?.userId || userId;

    // 1. Fetch user + profile
    const userRes = await pool.query(
      `SELECT u.id, u.email, u.role, u.is_active, u.created_at,
              p.full_name, p.headline, p.bio, p.location, p.avatar_url, p.linkedin_url
       FROM users u
       JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const profile = userRes.rows[0];

    // 2. Fetch experiences with companies & industries
    const expRes = await pool.query(
      `SELECT e.id, e.title, e.start_date, e.end_date, e.is_current,
              c.id AS company_id, c.name AS company_name, c.size AS company_size,
              c.location AS company_location, i.name AS industry_name
       FROM experiences e
       JOIN companies c ON e.company_id = c.id
       LEFT JOIN industries i ON c.industry_id = i.id
       WHERE e.user_id = $1
       ORDER BY e.is_current DESC, e.start_date DESC`,
      [userId]
    );

    // 3. Fetch skills
    const skillRes = await pool.query(
      `SELECT s.id, s.name, us.proficiency
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1
       ORDER BY s.name ASC`,
      [userId]
    );

    // 4. Check connection state between viewer and target
    let connectionState: any = null;
    let connectionStrength = 0.2;

    if (viewerId !== userId) {
      const connRes = await pool.query(
        `SELECT id, sender_id, receiver_id, rel_type, status, created_at
         FROM connection_requests
         WHERE (sender_id = $1 AND receiver_id = $2)
            OR (sender_id = $2 AND receiver_id = $1)`,
        [viewerId, userId]
      );
      if (connRes.rows.length > 0) {
        connectionState = connRes.rows[0];
      }

      // Execute Stored Scoring Procedure in PL/pgSQL
      const scoreRes = await pool.query(
        `SELECT calculate_connection_strength($1, $2) AS strength`,
        [viewerId, userId]
      );
      connectionStrength = scoreRes.rows[0]?.strength || 0.2;
    }

    return NextResponse.json({
      user: profile,
      experiences: expRes.rows,
      skills: skillRes.rows,
      connection: connectionState,
      connectionStrength,
    });
  } catch (err) {
    console.error('User Detail Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const targetUserId = Number(id);
    const currentUser = await getCurrentUserFromHeaders();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Only allow editing own profile unless admin
    if (currentUser.userId !== targetUserId && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: You can only edit your own profile.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = ProfileUpdateSchema.parse(body);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateRes = await client.query(
        `UPDATE profiles
         SET full_name = COALESCE($1, full_name),
             headline = COALESCE($2, headline),
             bio = COALESCE($3, bio),
             location = COALESCE($4, location),
             avatar_url = COALESCE($5, avatar_url),
             linkedin_url = COALESCE($6, linkedin_url)
         WHERE user_id = $7
         RETURNING *`,
        [
          validated.fullName,
          validated.headline,
          validated.bio,
          validated.location,
          validated.avatarUrl,
          validated.linkedinUrl,
          targetUserId,
        ]
      );

      // Handle skills update
      if (Array.isArray(validated.skills)) {
        await client.query('DELETE FROM user_skills WHERE user_id = $1', [targetUserId]);
        for (const sId of validated.skills) {
          await client.query(
            `INSERT INTO user_skills (user_id, skill_id, proficiency)
             VALUES ($1, $2, 'advanced')
             ON CONFLICT DO NOTHING`,
            [targetUserId, sId]
          );
        }
      }

      // Handle new experience addition
      if (validated.newExperience) {
        const exp = validated.newExperience;
        await client.query(
          `INSERT INTO experiences (user_id, company_id, title, start_date, end_date, is_current)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            targetUserId,
            exp.companyId,
            exp.title,
            exp.startDate,
            exp.endDate || null,
            exp.isCurrent || false,
          ]
        );
      }

      // Handle experience deletion
      if (validated.deleteExperienceId) {
        await client.query(
          'DELETE FROM experiences WHERE id = $1 AND user_id = $2',
          [validated.deleteExperienceId, targetUserId]
        );
      }

      await client.query(
        `UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [targetUserId]
      );

      await client.query('COMMIT');

      const updatedProfile = updateRes.rows[0];

      // Mirror update in Neo4j
      try {
        await runCypher(
          `MATCH (p:Person {userId: $userId})
           SET p.name = $name,
               p.headline = $headline,
               p.avatarUrl = $avatarUrl`,
          {
            userId: targetUserId,
            name: updatedProfile.full_name,
            headline: updatedProfile.headline,
            avatarUrl: updatedProfile.avatar_url,
          }
        );

        if (Array.isArray(validated.skills)) {
          await runCypher(
            `MATCH (p:Person {userId: $userId})-[r:HAS_SKILL]->()
             DELETE r
             WITH p
             UNWIND $skills AS sId
             MATCH (s:Skill {skillId: sId})
             MERGE (p)-[:HAS_SKILL]->(s)`,
            { userId: targetUserId, skills: validated.skills }
          );
        }

        if (validated.newExperience) {
          await runCypher(
            `MATCH (p:Person {userId: $userId})
             MATCH (c:Company {companyId: $cId})
             MERGE (p)-[:WORKS_AT]->(c)`,
            { userId: targetUserId, cId: validated.newExperience.companyId }
          );
        }
      } catch (graphErr) {
        console.error('[Neo4j Profile Sync Warning]:', graphErr);
      }

      // Fetch fresh updated experiences and skills
      const freshExp = await pool.query(
        `SELECT e.id, e.title, e.start_date, e.end_date, e.is_current,
                c.id AS company_id, c.name AS company_name
         FROM experiences e
         JOIN companies c ON e.company_id = c.id
         WHERE e.user_id = $1
         ORDER BY e.is_current DESC, e.start_date DESC`,
        [targetUserId]
      );

      const freshSkills = await pool.query(
        `SELECT s.id, s.name, us.proficiency
         FROM user_skills us
         JOIN skills s ON us.skill_id = s.id
         WHERE us.user_id = $1
         ORDER BY s.name ASC`,
        [targetUserId]
      );

      return NextResponse.json({
        profile: updatedProfile,
        experiences: freshExp.rows,
        skills: freshSkills.rows,
        message: 'Profile updated successfully.',
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
    console.error('Update Profile Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
