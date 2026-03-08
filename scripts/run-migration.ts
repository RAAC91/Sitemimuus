import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  console.log('--- Starting Migration v2.1 ---');
  try {
    const migrationPath = path.join(process.cwd(), 'migration_v2.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing SQL...');
    await sql.unsafe(migrationSql);
    
    console.log('✅ Migration successful!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
