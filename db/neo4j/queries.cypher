// ============================================================================
// PathFinder System — Reference Cypher Queries Catalog
// ============================================================================

// 1. Variable-Depth Shortest Path Query (1 to 6 Hops)
MATCH path = shortestPath((a:Person {userId: $u1})-[:KNOWS*..6]-(b:Person {userId: $u2}))
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
       length(path) AS totalDegrees;

// 2. People You May Know (Friend-of-Friend Discovery with Mutual Counts)
MATCH (me:Person {userId: $userId})-[:KNOWS]-(friend:Person)-[:KNOWS]-(suggestion:Person)
WHERE NOT (me)-[:KNOWS]-(suggestion) AND me <> suggestion
RETURN suggestion.userId AS userId,
       suggestion.name AS name,
       suggestion.headline AS headline,
       suggestion.avatarUrl AS avatarUrl,
       COUNT(DISTINCT friend) AS mutualCount,
       COLLECT(DISTINCT friend.name)[0..3] AS mutualNames
ORDER BY mutualCount DESC
LIMIT 10;

// 3. Mutual Connections Between Two Given Users
MATCH (a:Person {userId: $u1})-[:KNOWS]-(mutual:Person)-[:KNOWS]-(b:Person {userId: $u2})
RETURN mutual.userId AS userId,
       mutual.name AS name,
       mutual.headline AS headline,
       mutual.avatarUrl AS avatarUrl;

// 4. Network Degree Centrality Ranking (Top Influencers)
MATCH (p:Person)-[:KNOWS]-(neighbor:Person)
RETURN p.userId AS userId,
       p.name AS name,
       p.headline AS headline,
       COUNT(DISTINCT neighbor) AS connectionCount
ORDER BY connectionCount DESC
LIMIT 10;

// 5. Entire Subgraph for Visual Canvas Explorer (Bounded to 100 nodes/edges)
MATCH (p:Person)
OPTIONAL MATCH (p)-[r:KNOWS]->(target:Person)
WHERE p.userId < target.userId
RETURN p.userId AS sourceId,
       p.name AS sourceName,
       p.headline AS sourceHeadline,
       target.userId AS targetId,
       target.name AS targetName,
       target.headline AS targetHeadline,
       r.relType AS relType,
       r.strength AS strength
LIMIT 150;
