import postgres from 'postgres';
console.log("Connecting to:", process.env.DATABASE_URL ? "Exists" : "Missing");
const sql = postgres(process.env.DATABASE_URL, { ssl: { rejectUnauthorized: false } });
async function check() {
  const res = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'order_items';
  `;
  console.log(res);
  process.exit(0);
}
check();
