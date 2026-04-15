-- Base tables migration (Corrected for Entity Mismatch)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Users (PK: BIGINT) matches User Entity
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID DEFAULT uuid_generate_v4() UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    encrypted_email TEXT,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    encrypted_phone TEXT,
    avatar_url TEXT,
    email_verified_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    two_factor_secret TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_backup_codes JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
-- Categories (PK: UUID) matches Category Entity
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    page VARCHAR(50) DEFAULT 'policies',
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
-- Downloads (PK: UUID) matches Download Entity
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL DEFAULT 'Untitled Document',
    description TEXT,
    file_type VARCHAR(50) DEFAULT 'document',
    size VARCHAR(50),
    href TEXT NOT NULL DEFAULT '#',
    category VARCHAR(50) DEFAULT 'rules',
    category_id UUID REFERENCES categories(id) ON DELETE
    SET NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Results (PK: UUID) matches Result Entity
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    date VARCHAR(50),
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL UNIQUE,
    file_size BIGINT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    url TEXT NOT NULL,
    uploaded_by BIGINT REFERENCES users(id),
    category_id UUID REFERENCES categories(id) ON DELETE
    SET NULL,
        is_published BOOLEAN DEFAULT TRUE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
);
-- Galleries (PK: BIGINT)
CREATE TABLE IF NOT EXISTS galleries (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    images JSONB DEFAULT '[]',
    cover_image VARCHAR(500),
    event_date DATE,
    category_id UUID REFERENCES categories(id) ON DELETE
    SET NULL,
        is_published BOOLEAN DEFAULT FALSE,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
);
-- Athletes (PK: BIGINT)
CREATE TABLE IF NOT EXISTS athletes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    photo VARCHAR(500),
    date_of_birth DATE,
    classification VARCHAR(50),
    achievements JSONB DEFAULT '[]',
    social_links JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
-- Add comments
COMMENT ON TABLE users IS 'System users with authentication and role-based access';
COMMENT ON TABLE categories IS 'Categories for organizing content';
COMMENT ON TABLE downloads IS 'Downloadable files and documents';
COMMENT ON TABLE results IS 'Competition results and scores';
COMMENT ON TABLE galleries IS 'Photo galleries from events';
COMMENT ON TABLE athletes IS 'Athlete profiles and information';