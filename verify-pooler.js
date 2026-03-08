const postgres = require('postgres');

// Connection string for pooler (IPv4)
// postgres://[user].[ref]:[password]@[pooler-host]:6543/[db]
const connectionString = 'postgres://postgres.elgomlavjxzzszdjumyx:abB*DhS!c876cgg@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function verify() {
  try {
    console.log('🔍 VERIFICANDO CONNEXÃO POOLER (IPv4)...\n');
    console.log('   URL:', connectionString.replace(/:[^:]*@/, ':****@'));

    const result = await sql`SELECT version()`;
    console.log(`✅ CONEXÃO BEM SUCEDIDA!`);
    console.log(`   Versão: ${result[0].version}`);

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão pooler:', error.message);
    await sql.end();
    process.exit(1);
  }
}

verify();
