const postgres = require('postgres');
// require('dotenv').config(...) removed

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres:abB*DhS!c876cgg@db.elgomlavjxzzszdjumyx.supabase.co:5432/postgres', {
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function checkSchema() {
  try {
    console.log('🔍 Checking products table columns...');
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'products';
    `;
    
    console.log('Columns found:', columns.map(c => c.column_name).join(', '));
    
    const hasMetadata = columns.some(c => c.column_name === 'metadata');
    console.log(`Has metadata column? ${hasMetadata}`);
    
    if (!hasMetadata) {
        console.log('⚠️ Metadata column missing. Preparing to add...');
    } else {
        console.log('✅ Metadata column already exists.');
    }

    await sql.end();
  } catch (error) {
    console.error('Error:', error);
    await sql.end();
  }
}

checkSchema();
