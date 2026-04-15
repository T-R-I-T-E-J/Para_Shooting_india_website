-- Drop and recreate categories and downloads tables with correct schema

-- Step 1: Drop tables (downloads first because of FK)
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Step 2: Recreate categories table with UUID primary key
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    page VARCHAR(255) NOT NULL DEFAULT 'policies',
    "order" INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial categories data
INSERT INTO categories (name, slug, page, "order")
VALUES
    ('Rules', 'rules', 'policies', 1),
    ('Selection', 'selection', 'policies', 2),
    ('Calendar', 'calendar', 'policies', 3),
    ('Classification', 'classification', 'policies', 4),
    ('Match', 'match', 'policies', 5)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    page = EXCLUDED.page,
    "order" = EXCLUDED."order";

-- Step 3: Recreate downloads table matching the Download entity
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Document',
    description TEXT,
    file_type VARCHAR(50) NOT NULL DEFAULT 'document',
    size VARCHAR(50),
    href TEXT NOT NULL DEFAULT '#',
    category VARCHAR(50) NOT NULL DEFAULT 'rules',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_downloads_category ON downloads(category_id);
CREATE INDEX IF NOT EXISTS idx_downloads_active ON downloads(is_active);
CREATE INDEX IF NOT EXISTS idx_downloads_category_str ON downloads(category);
