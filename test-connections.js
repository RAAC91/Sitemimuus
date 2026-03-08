const postgres = require('postgres');

console.log('🔍 TESTANDO CONEXÕES MIMUUS\n');

const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    console.log('📡 Testando Supabase...');
    const result = await sql`SELECT NOW() as time`;
    console.log('✅ Supabase conectado!');
    console.log(`   Hora: ${result[0].time}\n`);

    console.log('📋 Verificando tabelas...');
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `;
    console.log(`✅ ${tables.length} tabelas:`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    console.log('\n📦 Produtos:');
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    console.log(`   ${products[0].count} cadastrados\n`);

    console.log('🔑 Variáveis de ambiente:');
    console.log(`   SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}`);
    console.log(`   STRIPE_KEY: ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅' : '❌'}`);
    console.log(`   APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`);

    await sql.end();
    console.log('\n✅ TUDO OK!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await sql.end();
    process.exit(1);
  }
}

test();
