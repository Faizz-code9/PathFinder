import { NextResponse } from 'next/server';
import { runCypher } from '@/lib/db/neo4j';
import { getCurrentUserFromHeaders } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUserFromHeaders();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 60, 150);

    // Fetch nodes
    const nodesCypher = `
      MATCH (p:Person)
      OPTIONAL MATCH (p)-[r:KNOWS]-()
      WITH p, COUNT(r) AS degree
      ORDER BY degree DESC
      LIMIT $limit
      RETURN p.userId AS id,
             p.name AS name,
             p.headline AS headline,
             p.avatarUrl AS avatarUrl,
             degree
    `;

    const nodes = await runCypher(nodesCypher, { limit });
    const nodeIds = new Set(nodes.map((n) => Number(n.id)));

    // Fetch links connecting these nodes
    const linksCypher = `
      MATCH (p1:Person)-[r:KNOWS]->(p2:Person)
      WHERE p1.userId < p2.userId
      RETURN p1.userId AS source,
             p2.userId AS target,
             r.relType AS relType,
             r.strength AS strength
    `;

    const allLinks = await runCypher(linksCypher);
    const validLinks = allLinks.filter(
      (l) => nodeIds.has(Number(l.source)) && nodeIds.has(Number(l.target))
    );

    return NextResponse.json({
      nodes: nodes.map((n) => ({
        id: Number(n.id),
        name: n.name,
        headline: n.headline,
        avatarUrl: n.avatarUrl,
        degree: Number(n.degree),
      })),
      links: validLinks.map((l) => ({
        source: Number(l.source),
        target: Number(l.target),
        relType: l.relType,
        strength: Number(l.strength || 0.8),
      })),
    });
  } catch (err) {
    console.error('Subgraph Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
