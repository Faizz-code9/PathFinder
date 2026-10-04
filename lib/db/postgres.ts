import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __postgres_pool__: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://pathfinder_user:pathfinder_pass@localhost:5432/pathfinder';

export const pool =
  global.__postgres_pool__ ||
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.__postgres_pool__ = pool;
}

export async function query<T = any>(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development' && duration > 200) {
    console.warn(`[PostgreSQL Slow Query] (${duration}ms):`, text);
  }
  return res;
}

export default pool;
