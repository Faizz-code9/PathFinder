import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/postgres';
import { runCypher } from '@/lib/db/neo4j';
import { getCurrentUserFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUserFromHeaders();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
    }

    // 1. Query PostgreSQL Analytical View
    const pgStatsRes = await pool.query(`SELECT * FROM v_network_analytics LIMIT 1`);
    const pgStats = pgStatsRes.rows[0] || {};

    // 2. Query Industry Distribution View
    const industryRes = await pool.query(`SELECT * FROM v_industry_distribution LIMIT 8`);

    // 3. Query Neo4j Graph Centrality
    const centralityCypher = `
      MATCH (p:Person)-[:KNOWS]-(neighbor:Person)
      RETURN p.userId AS userId,
             p.name AS name,
             p.headline AS headline,
             COUNT(DISTINCT neighbor) AS connectionCount
      ORDER BY connectionCount DESC
      LIMIT 6
    `;
    const graphCentrality = await runCypher(centralityCypher);

    return NextResponse.json({
      stats: {
        activeUsers: Number(pgStats.active_users || 0),
        totalConnections: Number(pgStats.total_accepted_connections || 0),
        pendingRequests: Number(pgStats.total_pending_requests || 0),
        totalCompanies: Number(pgStats.total_companies || 0),
        totalSkills: Number(pgStats.total_skills || 0),
        avgConnectionsPerUser: Number(pgStats.avg_connections_per_user || 0),
      },
      topInfluencers: graphCentrality.map((c) => ({
        userId: Number(c.userId),
        name: c.name,
        headline: c.headline,
        connectionCount: Number(c.connectionCount),
      })),
      industryDistribution: industryRes.rows,
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
