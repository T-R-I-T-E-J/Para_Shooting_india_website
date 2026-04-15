-- Add missing columns to categories table
-- These columns are expected by the TypeORM entity

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS page VARCHAR(50) DEFAULT 'policies',
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Update existing records to have the 'page' value
UPDATE categories SET page = 'policies' WHERE page IS NULL;

-- Add comment
COMMENT ON COLUMN categories.page IS 'Page where this category appears (e.g., policies, downloads)';
COMMENT ON COLUMN categories."order" IS 'Display order for sorting categories';
