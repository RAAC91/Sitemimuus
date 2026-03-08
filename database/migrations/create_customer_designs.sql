-- Create customer_designs table to store customer customizations
CREATE TABLE IF NOT EXISTS customer_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous users
  sku TEXT NOT NULL,
  layers JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_customer_designs_user_id ON customer_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_designs_session_id ON customer_designs(session_id);
CREATE INDEX IF NOT EXISTS idx_customer_designs_created_at ON customer_designs(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_customer_designs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_designs_updated_at
  BEFORE UPDATE ON customer_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_designs_updated_at();
