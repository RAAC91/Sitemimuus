-- =============================================
-- MIMUUS - User Profiles & XP System Migration
-- =============================================
-- Execute this SQL in Supabase SQL Editor after the main schema

-- 1. CREATE USER_PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_spent DECIMAL(10,2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE ACTIVITY_LOG TABLE
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'order_placed', 'design_saved', 'level_up', etc.
  action_data JSONB,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(level);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- 4. ROW LEVEL SECURITY
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own profile (name, avatar only)
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- System can insert profiles
CREATE POLICY "System can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own activity
CREATE POLICY "Users can view their own activity"
  ON activity_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- System can insert activity
CREATE POLICY "System can insert activity"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. AUTO-UPDATE TRIGGER FOR user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. FUNCTION TO CALCULATE LEVEL FROM XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: Level = floor(sqrt(XP / 100)) + 1
  -- Level 1: 0-99 XP
  -- Level 2: 100-399 XP
  -- Level 3: 400-899 XP
  -- Level 4: 900-1599 XP
  -- etc.
  RETURN FLOOR(SQRT(xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 7. FUNCTION TO AUTO-CREATE PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 8. FUNCTION TO UPDATE PROFILE STATS ON ORDER COMPLETION
CREATE OR REPLACE FUNCTION update_profile_on_order()
RETURNS TRIGGER AS $$
DECLARE
  xp_to_add INTEGER;
  new_level INTEGER;
  old_level INTEGER;
BEGIN
  -- Only process when order status changes to 'paid'
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    -- Calculate XP: 1 point per R$1 spent
    xp_to_add := FLOOR(NEW.total);
    
    -- Get current level
    SELECT level INTO old_level FROM user_profiles WHERE user_id = NEW.user_id;
    
    -- Update profile stats
    UPDATE user_profiles
    SET 
      xp_points = xp_points + xp_to_add,
      total_spent = total_spent + NEW.total,
      total_orders = total_orders + 1,
      level = calculate_level(xp_points + xp_to_add)
    WHERE user_id = NEW.user_id;
    
    -- Get new level
    SELECT level INTO new_level FROM user_profiles WHERE user_id = NEW.user_id;
    
    -- Log activity
    INSERT INTO activity_log (user_id, action_type, action_data, xp_earned)
    VALUES (
      NEW.user_id,
      'order_placed',
      jsonb_build_object('order_id', NEW.id, 'total', NEW.total),
      xp_to_add
    );
    
    -- If leveled up, log it
    IF new_level > old_level THEN
      INSERT INTO activity_log (user_id, action_type, action_data, xp_earned)
      VALUES (
        NEW.user_id,
        'level_up',
        jsonb_build_object('old_level', old_level, 'new_level', new_level),
        0
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update profile on order
DROP TRIGGER IF EXISTS on_order_paid ON orders;
CREATE TRIGGER on_order_paid
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_on_order();

-- 9. FUNCTION TO AWARD XP FOR DESIGN CREATION
CREATE OR REPLACE FUNCTION award_design_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 10 XP for creating a design
  UPDATE user_profiles
  SET 
    xp_points = xp_points + 10,
    level = calculate_level(xp_points + 10)
  WHERE user_id = NEW.user_id;
  
  -- Log activity
  INSERT INTO activity_log (user_id, action_type, action_data, xp_earned)
  VALUES (
    NEW.user_id,
    'design_saved',
    jsonb_build_object('design_id', NEW.id, 'design_name', NEW.name),
    10
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to award XP on design creation
DROP TRIGGER IF EXISTS on_design_created ON designs;
CREATE TRIGGER on_design_created
  AFTER INSERT ON designs
  FOR EACH ROW
  EXECUTE FUNCTION award_design_xp();

-- =============================================
-- END OF MIGRATION
-- =============================================
