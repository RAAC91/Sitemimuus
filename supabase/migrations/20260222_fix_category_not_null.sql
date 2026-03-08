-- =============================================
-- FIX: Remove NOT NULL constraint from products.category
-- =============================================
-- REASON: The schema was migrated to use category_id (UUID FK → categories table).
-- The old `category TEXT NOT NULL` constraint in the live DB blocks all new inserts
-- because createProduct() only provides category_id, not the legacy category TEXT field.
-- =============================================

-- Step 1: Drop the NOT NULL constraint from the category column
ALTER TABLE public.products ALTER COLUMN category DROP NOT NULL;

-- Step 2: Optional - set a safe default for any existing rows with null category
-- (Supabase may already have these from seed data, so this is a no-op safety net)
UPDATE public.products SET category = 'uncategorized' WHERE category IS NULL;

-- Verification query (run after to confirm success):
-- SELECT column_name, is_nullable FROM information_schema.columns
-- WHERE table_name = 'products' AND column_name = 'category';
-- Expected result: is_nullable = 'YES'
