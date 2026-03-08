import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }, 
});

async function run() {
  const result = await sql`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'order_items';
  `;
  fs.writeFileSync('schema2.json', JSON.stringify(result, null, 2));
  process.exit(0);
}

run();
