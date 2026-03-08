const postgres = require('postgres');
// using fallback connection string directly as in check-db.js
const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:abB*DhS!c876cgg@db.elgomlavjxzzszdjumyx.supabase.co:5432/postgres', {
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function addMetadataColumn() {
  try {
    console.log('🚀 Adding metadata column to products table...');
    
    // Check if column exists first
    const columns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'metadata';
    `;

    if (columns.length > 0) {
      console.log('✅ Metadata column already exists.');
    } else {
      await sql`
        ALTER TABLE products 
        ADD COLUMN metadata JSONB;
      `;
      console.log('✅ Metadata column added successfully!');
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding column:', error);
    await sql.end();
    process.exit(1);
  }
}

addMetadataColumn();
