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
    const targetId = Number(searchParams.get('targetId'));
    const sourceId = Number(searchParams.get('sourceId')) || currentUser.userId;

    if (!targetId || isNaN(targetId) || !sourceId || isNaN(sourceId)) {
      return NextResponse.json(
        { error: 'Valid sourceId and targetId parameters are required.' },
        { status: 400 }
      );
    }

    if (sourceId === targetId) {
      return NextResponse.json(
        { error: 'Source and target user cannot be the same person.' },
        { status: 400 }
      );
    }

    // 1. Fetch Source and Target details from PostgreSQL
    const usersRes = await pool.query(
      `SELECT u.id, p.full_name, p.headline, p.avatar_url, p.location
       FROM users u
       JOIN profiles p ON u.id = p.user_id
       WHERE u.id IN ($1, $2)`,
      [sourceId, targetId]
    );

    if (usersRes.rows.length < 2) {
      return NextResponse.json({ error: 'Source or target user not found.' }, { status: 404 });
    }

    const sourceUser = usersRes.rows.find((u) => u.id === sourceId);
    const targetUser = usersRes.rows.find((u) => u.id === targetId);

    // 2. 🔑 Execute Native Graph Traversal in Neo4j (Shortest Path)
    const cypher = `
      MATCH (a:Person {userId: $u1})
      MATCH (b:Person {userId: $u2})
      MATCH path = shortestPath((a)-[:KNOWS*..6]-(b))
      RETURN [node in nodes(path) | {
                userId: node.userId, 
                name: node.name, 
                headline: node.headline, 
                avatarUrl: node.avatarUrl
             }] AS nodes,
             [rel in relationships(path) | {
                relType: rel.relType, 
                strength: rel.strength
             }] AS edges,
             length(path) AS totalDegrees
    `;

    const graphResults = await runCypher(cypher, { u1: sourceId, u2: targetId });

    if (graphResults.length === 0 || !graphResults[0]?.nodes) {
      return NextResponse.json({
        pathFound: false,
        source: sourceUser,
        target: targetUser,
        message: 'No connection path found within 6 degrees of separation.',
      });
    }

    const rawPath = graphResults[0];
    const pathNodes = rawPath.nodes;
    const pathEdges = rawPath.edges;
    const totalDegrees = Number(rawPath.totalDegrees);

    // 3. Enrich each hop with PL/pgSQL hop annotations
    const enrichedHops = [];
    let cumulativeWarmthScore = 0;

    for (let i = 0; i < pathNodes.length - 1; i++) {
      const u1 = Number(pathNodes[i].userId);
      const u2 = Number(pathNodes[i + 1].userId);
      const edge = pathEdges[i] || {};

      // Call PL/pgSQL stored procedure get_hop_context
      const contextRes = await pool.query(
        `SELECT get_hop_context($1, $2) AS hop_context,
                calculate_connection_strength($1, $2) AS strength`,
        [u1, u2]
      );

      const hopContext = contextRes.rows[0]?.hop_context || `${edge.relType || 'Connection'}`;
      const hopStrength = Number(contextRes.rows[0]?.strength || edge.strength || 0.7);

      // Semantic weight scoring formula
      let relWeight = 3.0;
      const rel = (edge.relType || '').toLowerCase();
      if (rel.includes('co-founder') || rel.includes('founder')) relWeight = 1.0;
      else if (rel.includes('mentor')) relWeight = 2.0;
      else if (rel.includes('colleague')) relWeight = 3.0;
      else if (rel.includes('classmate')) relWeight = 4.0;
      else relWeight = 5.0;

      cumulativeWarmthScore += (hopStrength * 100) / relWeight;

      enrichedHops.push({
        from: pathNodes[i],
        to: pathNodes[i + 1],
        relType: edge.relType || 'colleague',
        strength: hopStrength,
        context: hopContext,
        hopIndex: i + 1,
      });
    }

    // Normalized Warmth Rating (0 to 100%)
    const normalizedWarmth = Math.min(
      Math.max(Math.round((cumulativeWarmthScore / totalDegrees) * 1.5), 25),
      99
    );

    return NextResponse.json({
      pathFound: true,
      degrees: totalDegrees,
      overallWarmth: normalizedWarmth,
      source: sourceUser,
      target: targetUser,
      nodes: pathNodes,
      edges: pathEdges,
      hops: enrichedHops,
    });
  } catch (err) {
    console.error('Pathfinder Traversal Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
