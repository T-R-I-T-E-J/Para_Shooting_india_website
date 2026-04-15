-- ═══════════════════════════════════════════════════════════
-- PSAI COMPLETE MIGRATION
-- Run in psql: psql -U postgres -d YOUR_DB_NAME -f migration.sql
-- ═══════════════════════════════════════════════════════════
BEGIN;
-- ─────────────────────────────────────────────────────────
-- 1. SHOOTERS TABLE — add all missing profile fields
-- ─────────────────────────────────────────────────────────
ALTER TABLE shooters -- Personal
ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS place_of_birth VARCHAR(200),
    ADD COLUMN IF NOT EXISTS marital_status VARCHAR(50),
    ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS place_of_work_study VARCHAR(300),
    -- Family
ADD COLUMN IF NOT EXISTS father_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS mother_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS spouse_name VARCHAR(200),
    -- Address
ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS district VARCHAR(100),
    ADD COLUMN IF NOT EXISTS residential_state VARCHAR(100),
    ADD COLUMN IF NOT EXISTS pincode VARCHAR(10),
    ADD COLUMN IF NOT EXISTS domicile_state VARCHAR(100),
    -- Identity Documents (encrypted in app layer)
ADD COLUMN IF NOT EXISTS aadhar_no VARCHAR(20),
    ADD COLUMN IF NOT EXISTS pan_no VARCHAR(20),
    -- Passport
ADD COLUMN IF NOT EXISTS passport_no VARCHAR(30),
    ADD COLUMN IF NOT EXISTS passport_issue_date DATE,
    ADD COLUMN IF NOT EXISTS passport_expiry_date DATE,
    ADD COLUMN IF NOT EXISTS passport_issued_by VARCHAR(200),
    ADD COLUMN IF NOT EXISTS passport_place_of_issue VARCHAR(200),
    -- Sport Profile
ADD COLUMN IF NOT EXISTS event_type VARCHAR(20),
    ADD COLUMN IF NOT EXISTS education VARCHAR(200),
    ADD COLUMN IF NOT EXISTS sdms_no VARCHAR(50),
    ADD COLUMN IF NOT EXISTS nsrs_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS pci_card_expiry DATE,
    ADD COLUMN IF NOT EXISTS pci_id VARCHAR(50),
    -- Equipment Adaptations
ADD COLUMN IF NOT EXISTS trigger_adaptation BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS loader BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS wheelchair BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS loading_device BOOLEAN DEFAULT FALSE,
    -- Sizing
ADD COLUMN IF NOT EXISTS weight DECIMAL(5, 2),
    ADD COLUMN IF NOT EXISTS shoe_size VARCHAR(10),
    ADD COLUMN IF NOT EXISTS track_suit_size VARCHAR(10),
    ADD COLUMN IF NOT EXISTS t_shirt_size VARCHAR(10),
    -- Media
ADD COLUMN IF NOT EXISTS photo_url TEXT,
    ADD COLUMN IF NOT EXISTS signature_url TEXT,
    -- Registration workflow
ADD COLUMN IF NOT EXISTS registration_status VARCHAR(30) NOT NULL DEFAULT 'incomplete',
    ADD COLUMN IF NOT EXISTS registration_step INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS completed_steps JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS approved_by BIGINT REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
-- Add check constraint for registration_status
ALTER TABLE shooters DROP CONSTRAINT IF EXISTS shooters_reg_status_check;
ALTER TABLE shooters
ADD CONSTRAINT shooters_reg_status_check CHECK (
        registration_status IN (
            'incomplete',
            'pending',
            'approved',
            'rejected'
        )
    );
-- ─────────────────────────────────────────────────────────
-- 2. NEWS ARTICLES — add content_date
-- ─────────────────────────────────────────────────────────
ALTER TABLE news_articles
ADD COLUMN IF NOT EXISTS content_date DATE;
-- Backfill: use published_at if set, otherwise created_at
UPDATE news_articles
SET content_date = COALESCE(published_at::DATE, created_at::DATE)
WHERE content_date IS NULL;
-- Add content_year as generated column for fast filtering
ALTER TABLE news_articles
ADD COLUMN IF NOT EXISTS content_year INTEGER;
UPDATE news_articles
SET content_year = EXTRACT(
        YEAR
        FROM content_date
    )::INTEGER
WHERE content_year IS NULL;
CREATE INDEX IF NOT EXISTS idx_news_content_year ON news_articles(content_year);
CREATE INDEX IF NOT EXISTS idx_news_content_date ON news_articles(content_date DESC);
-- ─────────────────────────────────────────────────────────
-- 3. DOCUMENTS — add content_date + issued_by
-- ─────────────────────────────────────────────────────────
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS content_date DATE,
    ADD COLUMN IF NOT EXISTS content_year INTEGER,
    ADD COLUMN IF NOT EXISTS issued_by VARCHAR(300),
    ADD COLUMN IF NOT EXISTS effective_date DATE;
-- Backfill using valid_from if set, otherwise created_at
UPDATE documents
SET content_date = COALESCE(valid_from, created_at::DATE)
WHERE content_date IS NULL;
UPDATE documents
SET content_year = EXTRACT(
        YEAR
        FROM content_date
    )::INTEGER
WHERE content_year IS NULL;
CREATE INDEX IF NOT EXISTS idx_documents_content_year ON documents(content_year);
-- ─────────────────────────────────────────────────────────
-- 4. RESULTS — add content_year index (date column exists)
-- ─────────────────────────────────────────────────────────
-- results.date is already the content date — good!
-- Just add an index and content_year for fast filtering.
ALTER TABLE results
ADD COLUMN IF NOT EXISTS content_year INTEGER;
UPDATE results
SET content_year = EXTRACT(
        YEAR
        FROM date
    )::INTEGER
WHERE content_year IS NULL
    AND date IS NOT NULL;
UPDATE results
SET content_year = EXTRACT(
        YEAR
        FROM created_at
    )::INTEGER
WHERE content_year IS NULL;
CREATE INDEX IF NOT EXISTS idx_results_content_year ON results(content_year);
CREATE INDEX IF NOT EXISTS idx_results_date ON results(date DESC);
-- ─────────────────────────────────────────────────────────
-- 5. SHOOTER DOCUMENTS table (new — for uploaded files)
-- ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS shooter_documents (
    id BIGSERIAL PRIMARY KEY,
    shooter_id BIGINT NOT NULL REFERENCES shooters(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    -- Types: 'passport_photo' | 'birth_certificate' | 'aadhar_card'
    -- 'pan_card' | 'passport' | 'arms_license' | 'affidavit' | 'ipc_card'
    -- 'signature'
    file_url TEXT NOT NULL,
    file_name VARCHAR(300),
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by BIGINT REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_shooter_docs_shooter_id ON shooter_documents(shooter_id);
CREATE INDEX IF NOT EXISTS idx_shooter_docs_type ON shooter_documents(document_type);
-- Only one active document per type per shooter
CREATE UNIQUE INDEX IF NOT EXISTS idx_shooter_docs_unique_type ON shooter_documents(shooter_id, document_type);
-- ─────────────────────────────────────────────────────────
-- 6. SHOOTERS — add indexes for common queries
-- ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_shooters_user_id ON shooters(user_id);
CREATE INDEX IF NOT EXISTS idx_shooters_registration_status ON shooters(registration_status);
CREATE INDEX IF NOT EXISTS idx_shooters_event_type ON shooters(event_type);
CREATE INDEX IF NOT EXISTS idx_shooters_pci_id ON shooters(pci_id);
-- ─────────────────────────────────────────────────────────
-- 7. Verify everything looks correct
-- ─────────────────────────────────────────────────────────
SELECT 'shooters' AS table_name,
    COUNT(*) AS total_columns
FROM information_schema.columns
WHERE table_name = 'shooters'
    AND table_schema = 'public'
UNION ALL
SELECT 'shooter_documents',
    COUNT(*)
FROM information_schema.columns
WHERE table_name = 'shooter_documents'
    AND table_schema = 'public'
UNION ALL
SELECT 'news_articles',
    COUNT(*)
FROM information_schema.columns
WHERE table_name = 'news_articles'
    AND table_schema = 'public'
UNION ALL
SELECT 'documents',
    COUNT(*)
FROM information_schema.columns
WHERE table_name = 'documents'
    AND table_schema = 'public'
UNION ALL
SELECT 'results',
    COUNT(*)
FROM information_schema.columns
WHERE table_name = 'results'
    AND table_schema = 'public';
COMMIT;