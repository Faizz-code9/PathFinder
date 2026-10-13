import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import neo4j from 'neo4j-driver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pgConnectionString =
  process.env.DATABASE_URL ||
  'postgresql://pathfinder_user:pathfinder_pass@localhost:5432/pathfinder';

const neo4jUri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const neo4jUser = process.env.NEO4J_USER || 'neo4j';
const neo4jPassword = process.env.NEO4J_PASSWORD || 'pathfinder_neo4j';

async function setupPostgres() {
  console.log('🐘 Initializing PostgreSQL schema & seed data...');
  const client = new pg.Client({ connectionString: pgConnectionString });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL.');

    const sqlFiles = [
      '01_schema.sql',
      '02_indexes.sql',
      '03_views.sql',
      '04_procedures.sql',
      '05_triggers.sql',
      '06_seed.sql',
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(rootDir, 'db', 'postgres', 'init', file);
      if (fs.existsSync(filePath)) {
        console.log(`  Executing ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf-8');
        await client.query(sql);
      } else {
        console.warn(`  Warning: ${filePath} not found.`);
      }
    }
    console.log('✅ PostgreSQL initialization complete.');
  } catch (err) {
    console.error('❌ PostgreSQL Setup Failed:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function waitForNeo4j(driver, maxRetries = 15, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const session = driver.session();
    try {
      await session.run('RETURN 1');
      await session.close();
      return;
    } catch (err) {
      await session.close();
      if (attempt === maxRetries) {
        throw err;
      }
      console.log(`  ⏳ Waiting for Neo4j Bolt server to be ready (attempt ${attempt}/${maxRetries})...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

async function setupNeo4j() {
  console.log('🌐 Initializing Neo4j schema & seed data...');
  const driver = neo4j.driver(
    neo4jUri,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
  );
  let session;
  try {
    await waitForNeo4j(driver);
    console.log('Connected to Neo4j.');
    session = driver.session();

    const parseCypherStatements = (content) =>
      content
        .split(';')
        .map((stmt) =>
          stmt
            .split('\n')
            .filter((line) => !line.trim().startsWith('//'))
            .join('\n')
            .trim()
        )
        .filter((stmt) => stmt.length > 0);

    // 1. Schema constraints & indexes
    const schemaFile = path.join(rootDir, 'db', 'neo4j', 'schema.cypher');
    if (fs.existsSync(schemaFile)) {
      console.log('  Executing schema.cypher...');
      const schemaCypher = fs.readFileSync(schemaFile, 'utf-8');
      const statements = parseCypherStatements(schemaCypher);

      for (const stmt of statements) {
        await session.run(stmt);
      }
    }

    // 2. Seed data
    const seedFile = path.join(rootDir, 'db', 'neo4j', 'seed.cypher');
    if (fs.existsSync(seedFile)) {
      console.log('  Executing seed.cypher...');
      const seedCypher = fs.readFileSync(seedFile, 'utf-8');
      const statements = parseCypherStatements(seedCypher);

      for (const stmt of statements) {
        await session.run(stmt);
      }
    }

    console.log('✅ Neo4j initialization complete.');
  } catch (err) {
    console.error('❌ Neo4j Setup Failed:', err);
    throw err;
  } finally {
    if (session) await session.close();
    await driver.close();
  }
}

async function main() {
  console.log('========================================');
  console.log(' PathFinder Database Provisioner');
  console.log('========================================');
  try {
    await setupPostgres();
    await setupNeo4j();
    console.log('\n🎉 All databases initialized and seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('\nDatabase setup failed with error:', err.message);
    process.exit(1);
  }
}

main();
