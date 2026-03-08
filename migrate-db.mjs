import postgres from 'postgres';
console.log("Connecting...");
const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });
async function migrate() {
  try {
    const res = await sql`
      ALTER TABLE order_items ALTER COLUMN product_id TYPE VARCHAR(255);
    `;
    console.log("Migration Success:", res);
  } catch (e) {
    console.error("Migration Error:", e);
  }
  process.exit(0);
}
migrate();
