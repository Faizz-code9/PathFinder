import { NextResponse } from 'next/server';
import { runCypher } from '@/lib/db/neo4j';
import { pool } from '@/lib/db/postgres';
import { getCurrentUserFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUserFromHeaders();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId')) || currentUser.userId;
    const limit = Math.min(Number(searchParams.get('limit')) || 12, 30);

    // 1. 🔑 Execute Friend-of-Friend (FoF) Graph Aggregation in Neo4j
    const cypher = `
      MATCH (me:Person {userId: $userId})-[:KNOWS]-(friend:Person)-[:KNOWS]-(suggestion:Person)
      WHERE NOT (me)-[:KNOWS]-(suggestion) AND me <> suggestion
      RETURN suggestion.userId AS userId,
             suggestion.name AS name,
             suggestion.headline AS headline,
             suggestion.avatarUrl AS avatarUrl,
             COUNT(DISTINCT friend) AS mutualCount,
             COLLECT(DISTINCT friend.name)[0..3] AS mutualNames
      ORDER BY mutualCount DESC, suggestion.name ASC
      LIMIT $limit
    `;

    const graphSuggestions = await runCypher(cypher, { userId, limit });

    if (graphSuggestions.length === 0) {
      // Fallback: If user has 0 connections, recommend influential nodes (high degree centrality)
      const fallbackCypher = `
        MATCH (suggestion:Person)
        WHERE suggestion.userId <> $userId
        OPTIONAL MATCH (suggestion)-[:KNOWS]-(n:Person)
        RETURN suggestion.userId AS userId,
               suggestion.name AS name,
               suggestion.headline AS headline,
               suggestion.avatarUrl AS avatarUrl,
               COUNT(DISTINCT n) AS mutualCount,
               [] AS mutualNames
        ORDER BY mutualCount DESC
        LIMIT $limit
      `;
      const fallbackResults = await runCypher(fallbackCypher, { userId, limit });
      return NextResponse.json({ suggestions: fallbackResults, isFallback: true });
    }

    // 2. Fetch rich profile context for each suggestion from PostgreSQL
    const userIds = graphSuggestions.map((s) => Number(s.userId));
    const pgRes = await pool.query(
      `SELECT u.id, p.location,
              COALESCE(
                (SELECT json_agg(json_build_object('title', e.title, 'company', c.name))
                 FROM experiences e
                 JOIN companies c ON e.company_id = c.id
                 WHERE e.user_id = u.id AND e.is_current = TRUE),
                '[]'::json
              ) AS current_roles
       FROM users u
       JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ANY($1)`,
      [userIds]
    );

    const profileMap = new Map(pgRes.rows.map((r) => [r.id, r]));

    const enriched = graphSuggestions.map((s) => {
      const uId = Number(s.userId);
      const details = profileMap.get(uId) || {};
      return {
        ...s,
        userId: uId,
        mutualCount: Number(s.mutualCount),
        location: details.location || 'San Francisco, CA',
        currentRoles: details.current_roles || [],
      };
    });

    return NextResponse.json({ suggestions: enriched, isFallback: false });
  } catch (err) {
    console.error('Suggestions Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
