import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  const migrationPath = path.resolve('supabase/migrations/20260210_master_sync.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  console.log('Applying migration...');
  try {
    await sql.unsafe(migrationSql);
    console.log('Migration applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();
