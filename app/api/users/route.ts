import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const skill = searchParams.get('skill')?.trim() || '';
    const company = searchParams.get('company')?.trim() || '';
    const limit = Math.min(Number(searchParams.get('limit')) || 30, 100);

    let sql = `
      SELECT
        u.id,
        u.email,
        u.role,
        p.full_name,
        p.headline,
        p.bio,
        p.location,
        p.avatar_url,
        COALESCE(
          (SELECT json_agg(json_build_object('name', s.name, 'proficiency', us.proficiency))
           FROM user_skills us
           JOIN skills s ON us.skill_id = s.id
           WHERE us.user_id = u.id),
          '[]'::json
        ) AS skills,
        COALESCE(
          (SELECT json_agg(json_build_object('title', e.title, 'company', c.name, 'is_current', e.is_current))
           FROM experiences e
           JOIN companies c ON e.company_id = c.id
           WHERE e.user_id = u.id),
          '[]'::json
        ) AS experiences
    `;

    const params: any[] = [];
    const whereConditions: string[] = ['u.is_active = TRUE'];

    if (query) {
      params.push(query);
      const paramIdx = params.length;
      sql += `, ts_rank(
        to_tsvector('english', p.full_name || ' ' || COALESCE(p.headline, '') || ' ' || COALESCE(p.bio, '')),
        plainto_tsquery('english', $${paramIdx})
      ) AS search_rank`;

      whereConditions.push(`(
        to_tsvector('english', p.full_name || ' ' || COALESCE(p.headline, '') || ' ' || COALESCE(p.bio, ''))
        @@ plainto_tsquery('english', $${paramIdx})
        OR p.full_name ILIKE '%' || $${paramIdx} || '%'
        OR p.headline ILIKE '%' || $${paramIdx} || '%'
      )`);
    }

    sql += ` FROM users u JOIN profiles p ON u.id = p.user_id `;

    if (skill) {
      params.push(skill);
      const skillIdx = params.length;
      whereConditions.push(`EXISTS (
        SELECT 1 FROM user_skills us_f
        JOIN skills s_f ON us_f.skill_id = s_f.id
        WHERE us_f.user_id = u.id AND s_f.name ILIKE '%' || $${skillIdx} || '%'
      )`);
    }

    if (company) {
      params.push(company);
      const compIdx = params.length;
      whereConditions.push(`EXISTS (
        SELECT 1 FROM experiences e_f
        JOIN companies c_f ON e_f.company_id = c_f.id
        WHERE e_f.user_id = u.id AND c_f.name ILIKE '%' || $${compIdx} || '%'
      )`);
    }

    if (whereConditions.length > 0) {
      sql += ` WHERE ` + whereConditions.join(' AND ');
    }

    if (query) {
      sql += ` ORDER BY search_rank DESC, u.id ASC LIMIT $${params.length + 1}`;
    } else {
      sql += ` ORDER BY u.id ASC LIMIT $${params.length + 1}`;
    }
    params.push(limit);

    const result = await pool.query(sql, params);
    return NextResponse.json({ users: result.rows });
  } catch (err) {
    console.error('Users Search Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
