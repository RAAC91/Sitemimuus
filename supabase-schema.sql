-- =============================================
-- MIMUUS - Schema do Banco de Dados
-- =============================================
-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql

-- 1. TABELA DE PRODUTOS
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
);

-- 2. TABELA DE DESIGNS (Customizações salvas)
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT,
  layers JSONB NOT NULL,
  preview_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, processing, shipped, delivered, cancelled
  items JSONB NOT NULL,
  shipping_address JSONB,
  customer_email TEXT,
  customer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_designs_product_id ON designs(product_id);
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);

-- 5. ROW LEVEL SECURITY (RLS)

-- Products: Todos podem ler, apenas admins podem modificar
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos são públicos para leitura"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Apenas admins podem inserir produtos"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Apenas admins podem atualizar produtos"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Designs: Usuários podem ver públicos ou seus próprios
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Designs públicos são visíveis"
  ON designs FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Usuários podem ver seus próprios designs"
  ON designs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar designs"
  ON designs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Orders: Usuários só veem seus próprios pedidos
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seus pedidos"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode criar pedidos"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. STORAGE BUCKET PARA IMAGENS
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política de acesso ao bucket
CREATE POLICY "Imagens de produtos são públicas"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Usuários autenticados podem fazer upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- 7. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. PRODUTOS DE EXEMPLO (OPCIONAL - PARA TESTE)
INSERT INTO products (name, slug, description, category, base_price, stock, images, tags)
VALUES 
  (
    'Garrafa Térmica Sport 500ml',
    'garrafa-termica-sport-500ml',
    'Garrafa térmica de alta performance, mantém bebidas geladas por 24h e quentes por 12h. Perfeita para treinos e aventuras.',
    'sports',
    89.90,
    50,
    ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/2.png'],
    ARRAY['térmica', 'esporte', 'fitness', '500ml']
  ),
  (
    'Garrafa Kids Unicórnio 350ml',
    'garrafa-kids-unicornio-350ml',
    'Garrafa divertida para crianças com design de unicórnio. Livre de BPA, segura e resistente.',
    'kids',
    49.90,
    30,
    ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/4.png'],
    ARRAY['kids', 'infantil', 'unicórnio', '350ml']
  ),
  (
    'Garrafa Corporate Premium 750ml',
    'garrafa-corporate-premium-750ml',
    'Garrafa elegante para ambiente corporativo. Design minimalista e sofisticado.',
    'corporate',
    129.90,
    25,
    ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/3.png'],
    ARRAY['corporativo', 'premium', 'escritório', '750ml']
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- FIM DO SCHEMA
-- =============================================
-- Próximos passos:
-- 1. Execute este SQL no Supabase SQL Editor
-- 2. Verifique se as tabelas foram criadas
-- 3. Teste inserindo um produto manualmente
