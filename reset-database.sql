-- =============================================
-- MIMUUS - DATABASE RESET SCRIPT
-- =============================================
-- ⚠️ WARNING: THIS WILL DELETE ALL DATA IN CUSTOM TABLES ⚠️
-- Does NOT delete auth.users (requires admin API), but cleans up everything else.

-- 1. DROP EXISTING TABLES & TRIGGERS (Cleanup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_order_paid ON orders;
DROP TRIGGER IF EXISTS on_design_created ON designs;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_profile_on_order();
DROP FUNCTION IF EXISTS award_design_xp();
DROP FUNCTION IF EXISTS calculate_level(INTEGER);
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS designs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. CREATE TABLES

-- Products
CREATE TABLE products (
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

-- User Profiles (With Role)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_spent DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Designs
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT,
  layers JSONB NOT NULL,
  preview_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_designs_product_id ON designs(product_id);
CREATE INDEX idx_designs_user_id ON designs(user_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);

-- 4. RLS POLICIES

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Products" ON products FOR SELECT TO public USING (is_active = true);
-- Allow admins (via user_profiles role) to insert/update
CREATE POLICY "Admin Insert Products" ON products FOR INSERT TO authenticated 
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin Update Products" ON products FOR UPDATE TO authenticated 
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- User Profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
-- Allow public to see profiles if needed (e.g. reviews), but for now strict
CREATE POLICY "Users update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
-- System (triggers with security definer) handles inserts, but if we need manual:
CREATE POLICY "System insert profiles" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Designs
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public designs visible" ON designs FOR SELECT TO public USING (is_public = true);
CREATE POLICY "Users view own designs" ON designs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert designs" ON designs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert orders" ON orders FOR INSERT TO authenticated WITH CHECK (true); -- Usually processed by webhook or system

-- Activity Log
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own activity" ON activity_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System insert activity" ON activity_log FOR INSERT TO authenticated WITH CHECK (true);

-- 5. FUNCTIONS & TRIGGERS

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate Level
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR(SQRT(xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Handle New User (Auto-Admin Logic)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if email matches specific admin emails
  is_admin := (NEW.email = 'rueliton.andrade@gmail.com');

  INSERT INTO user_profiles (user_id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    CASE WHEN is_admin THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update Profile on Order
CREATE OR REPLACE FUNCTION update_profile_on_order()
RETURNS TRIGGER AS $$
DECLARE
  xp_to_add INTEGER;
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    xp_to_add := FLOOR(NEW.total);
    UPDATE user_profiles
    SET 
      xp_points = xp_points + xp_to_add,
      total_spent = total_spent + NEW.total,
      total_orders = total_orders + 1,
      level = calculate_level(xp_points + xp_to_add)
    WHERE user_id = NEW.user_id;
    
    INSERT INTO activity_log (user_id, action_type, action_data, xp_earned)
    VALUES (NEW.user_id, 'order_placed', jsonb_build_object('order_id', NEW.id), xp_to_add);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_paid AFTER INSERT OR UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_profile_on_order();

-- Award Design XP
CREATE OR REPLACE FUNCTION award_design_xp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET xp_points = xp_points + 10, level = calculate_level(xp_points + 10)
  WHERE user_id = NEW.user_id;

  INSERT INTO activity_log (user_id, action_type, action_data, xp_earned)
  VALUES (NEW.user_id, 'design_saved', jsonb_build_object('design_id', NEW.id), 10);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_design_created AFTER INSERT ON designs FOR EACH ROW EXECUTE FUNCTION award_design_xp();

-- 6. SEED DATA (Products)
INSERT INTO products (name, slug, description, category, base_price, stock, images, tags)
VALUES 
  ('Garrafa Térmica Sport 500ml', 'garrafa-termica-sport-500ml', 'Garrafa térmica de alta performance.', 'sports', 89.90, 50, ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/2.png'], ARRAY['térmica', 'esporte']),
  ('Garrafa Kids Unicórnio 350ml', 'garrafa-kids-unicornio-350ml', 'Garrafa divertida para crianças.', 'kids', 49.90, 30, ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/4.png'], ARRAY['kids', 'infantil']),
  ('Garrafa Corporate Premium 750ml', 'garrafa-corporate-premium-750ml', 'Garrafa elegante para escritório.', 'corporate', 129.90, 25, ARRAY['https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/3.png'], ARRAY['corporativo', 'premium'])
ON CONFLICT (slug) DO NOTHING;
