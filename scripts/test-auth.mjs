import bcrypt from 'bcryptjs';
import pg from 'pg';

const client = new pg.Client({ connectionString: 'postgresql://pathfinder_user:pathfinder_pass@localhost:5432/pathfinder' });

async function check() {
  await client.connect();
  const res = await client.query("SELECT id, email, password_hash, role, is_active FROM users WHERE email = 'admin@pathfinder.io'");
  if (res.rows.length === 0) {
    console.log('User admin@pathfinder.io not found');
  } else {
    const user = res.rows[0];
    console.log('User found:', user.email, 'hash:', user.password_hash);
    const passwords = ['password123', 'admin', 'admin123', 'pathfinder', 'password'];
    for (const p of passwords) {
      const match = await bcrypt.compare(p, user.password_hash);
      console.log(`Password "${p}": ${match}`);
    }
  }
  await client.end();
}

check().catch(console.error);
