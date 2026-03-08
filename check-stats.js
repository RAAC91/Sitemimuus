const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || 
  'postgresql://postgres:abB*DhS!c876cgg@db.elgomlavjxzzszdjumyx.supabase.co:5432/postgres', {
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function checkStats() {
  try {
    console.log('🔍 Coletando estatísticas do banco de dados...\n');

    // Count Tables
    const tables = await sql`
      SELECT count(*)::int 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;

    // Count Functions
    const functions = await sql`
      SELECT count(*)::int 
      FROM information_schema.routines 
      WHERE routine_schema = 'public';
    `;
    
    // Get Table Names
    const tableNames = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log(`📊 ESTATÍSTICAS:`);
    console.log(`   Tabelas:   ${tables[0].count}`);
    console.log(`   Funções:   ${functions[0].count}`);
    console.log('\n📋 Lista de Tabelas:');
    tableNames.forEach(t => console.log(`   - ${t.table_name}`));

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar (O projeto pode estar pausado):', error.message);
    await sql.end();
    process.exit(1);
  }
}

checkStats();
