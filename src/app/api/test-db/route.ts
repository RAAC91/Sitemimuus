import { NextResponse } from "next/server";
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: { rejectUnauthorized: false } });

export async function GET() {
  try {
    const res = await sql`
      ALTER TABLE order_items ALTER COLUMN product_id TYPE VARCHAR(255);
    `;
    return NextResponse.json({ success: true, res });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
