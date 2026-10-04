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
    const targetId = Number(searchParams.get('targetId'));
    const sourceId = Number(searchParams.get('sourceId')) || currentUser.userId;

    if (!targetId || isNaN(targetId)) {
      return NextResponse.json({ error: 'Valid targetId parameter is required.' }, { status: 400 });
    }

    const cypher = `
      MATCH (a:Person {userId: $u1})-[:KNOWS]-(mutual:Person)-[:KNOWS]-(b:Person {userId: $u2})
      RETURN DISTINCT mutual.userId AS userId,
             mutual.name AS name,
             mutual.headline AS headline,
             mutual.avatarUrl AS avatarUrl
      ORDER BY mutual.name ASC
    `;

    const records = await runCypher(cypher, { u1: sourceId, u2: targetId });
    return NextResponse.json({ mutualConnections: records, count: records.length });
  } catch (err) {
    console.error('Mutual Connections Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
