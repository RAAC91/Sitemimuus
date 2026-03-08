"use server";

import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
});

export async function createCustomerDesignsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS customer_designs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        session_id TEXT,
        sku TEXT NOT NULL,
        layers JSONB NOT NULL DEFAULT '[]'::jsonb,
        preview_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_customer_designs_user_id ON customer_designs(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_customer_designs_session_id ON customer_designs(session_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_customer_designs_created_at ON customer_designs(created_at DESC)
    `;

    return { success: true, message: 'Table created successfully' };
  } catch (error: unknown) {
    console.error('Error creating customer_designs table:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
