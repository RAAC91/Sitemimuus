const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || 
  'postgresql://postgres:abB*DhS!c876cgg@db.elgomlavjxzzszdjumyx.supabase.co:5432/postgres', {
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function verify() {
  try {
    console.log('🔍 VERIFICANDO BANCO DE DADOS\n');

    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    
    console.log(`✅ ${products.length} produtos encontrados:\n`);
    
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Categoria: ${p.category}`);
      console.log(`   Preço: R$ ${p.base_price}`);
      console.log(`   Estoque: ${p.stock} unidades`);
      console.log(`   Imagens: ${p.images ? p.images.length : 0}`);
      console.log('');
    });

    const orders = await sql`SELECT COUNT(*) as count FROM orders`;
    console.log(`📦 Pedidos: ${orders[0].count}`);

    const designs = await sql`SELECT COUNT(*) as count FROM designs`;
    console.log(`🎨 Designs: ${designs[0].count}\n`);

    console.log('🌐 Teste no navegador:');
    console.log('   http://localhost:3000/produtos');
    console.log('   http://localhost:3000/admin/products');
    console.log('   http://localhost:3000/categorias/sports\n');

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    await sql.end();
    process.exit(1);
  }
}

verify();
