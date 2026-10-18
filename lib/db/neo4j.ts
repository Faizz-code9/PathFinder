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

function convertNeo4jTypes(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }
  if (neo4j.isInt(value)) {
    return neo4j.integer.inSafeRange(value) ? value.toNumber() : value.toString();
  }
  if (typeof value === 'object' && 'low' in value && 'high' in value && Object.keys(value).length <= 2) {
    return Number(value.low);
  }
  if (Array.isArray(value)) {
    return value.map(convertNeo4jTypes);
  }
  if (typeof value === 'object') {
    const res: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      res[key] = convertNeo4jTypes(val);
    }
    return res;
  }
  return value;
}

export async function runCypher<T = any>(
  cypher: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const session: Session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => {
      const obj = record.toObject();
      return convertNeo4jTypes(obj) as T;
    });
  } finally {
    await session.close();
  }
}

export default driver;
