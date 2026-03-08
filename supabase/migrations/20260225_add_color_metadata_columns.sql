-- =============================================
-- MIGRATION: Add missing columns to products table
-- color, metadata, and price alias for admin panel compatibility
-- =============================================

DO $$
BEGIN
    -- Add color column for product color filter feature
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'products' 
          AND column_name = 'color'
    ) THEN
        ALTER TABLE public.products ADD COLUMN color TEXT;
    END IF;

    -- Add metadata column for bottle editor design data (JSON)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'products' 
          AND column_name = 'metadata'
    ) THEN
        ALTER TABLE public.products ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;

    -- Ensure slug column exists (might be missing if DB was created before migration v2)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'products' 
          AND column_name = 'slug'
    ) THEN
        ALTER TABLE public.products ADD COLUMN slug TEXT UNIQUE;
    END IF;
END $$;

-- Make category column nullable (safe if already nullable)
ALTER TABLE public.products ALTER COLUMN category DROP NOT NULL;

-- Verification: Run this to confirm columns exist:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'products'
-- ORDER BY ordinal_position;
