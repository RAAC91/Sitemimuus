const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL || 
  'postgresql://postgres:abB*DhS!c876cgg@db.elgomlavjxzzszdjumyx.supabase.co:5432/postgres', {
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function createAll() {
  try {
    console.log('🚀 CRIANDO SCHEMA COMPLETO\n');

    // 1. Products (já existe, mas vamos garantir campos completos)
    console.log('📋 1. Tabela PRODUCTS...');
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        category TEXT,
        base_price DECIMAL(10,2) NOT NULL,
        sale_price DECIMAL(10,2),
        stock INTEGER DEFAULT 0,
        images TEXT[],
        tags TEXT[],
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Products OK\n');

    // 2. Orders
    console.log('📋 2. Tabela ORDERS...');
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        stripe_session_id TEXT UNIQUE,
        stripe_payment_intent_id TEXT,
        total DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        items JSONB NOT NULL,
        shipping_address JSONB,
        customer_email TEXT,
        customer_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Orders OK\n');

    // 3. Designs
    console.log('📋 3. Tabela DESIGNS...');
    await sql`
      CREATE TABLE IF NOT EXISTS designs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID,
        user_id UUID,
        name TEXT,
        layers JSONB NOT NULL,
        preview_url TEXT,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('✅ Designs OK\n');

    // 4. Índices
    console.log('📋 4. Criando índices...');
    await sql`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    console.log('✅ Índices OK\n');

    // 5. Produtos de exemplo
    console.log('📦 5. Inserindo produtos...');
    await sql`
      INSERT INTO products (name, slug, description, category, base_price, stock, images, tags)
      VALUES 
        ('Garrafa Térmica Sport 500ml', 'garrafa-termica-sport-500ml', 
         'Mantém bebidas geladas por 24h e quentes por 12h. Perfeita para treinos!', 
         'sports', 89.90, 50, 
         ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/2.png'], 
         ARRAY['térmica', 'esporte', 'fitness']),
        
        ('Garrafa Kids Unicórnio 350ml', 'garrafa-kids-unicornio-350ml',
         'Design divertido para crianças. Livre de BPA e super resistente!',
         'kids', 49.90, 30,
         ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/4.png'],
         ARRAY['kids', 'infantil', 'unicórnio']),
        
        ('Garrafa Corporate Premium 750ml', 'garrafa-corporate-premium-750ml',
         'Elegância e sofisticação para o ambiente corporativo.',
         'corporate', 129.90, 25,
         ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/3.png'],
         ARRAY['corporativo', 'premium', 'escritório'])
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log('✅ Produtos inseridos\n');

    // 6. Verificar
    const count = await sql`SELECT COUNT(*) as count FROM products`;
    const products = await sql`SELECT name, category, base_price FROM products`;
    
    console.log(`📊 Total: ${count[0].count} produtos\n`);
    products.forEach(p => console.log(`   - ${p.name} (${p.category}) - R$ ${p.base_price}`));

    await sql.end();
    console.log('\n✅ SCHEMA COMPLETO CRIADO!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    await sql.end();
    process.exit(1);
  }
}

createAll();
