import neo4j, { Driver, Session } from 'neo4j-driver';

declare global {
  // eslint-disable-next-line no-var
  var __neo4j_driver__: Driver | undefined;
}

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'pathfinder_neo4j';

export const driver =
  global.__neo4j_driver__ ||
  neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionPoolSize: 50,
    connectionTimeout: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__neo4j_driver__ = driver;
}

export async function runCypher<T = any>(
  cypher: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const session: Session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => record.toObject() as T);
  } finally {
    await session.close();
  }
}

export default driver;
