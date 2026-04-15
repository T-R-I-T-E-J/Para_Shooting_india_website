-- Migration: Add content_date and content_year to downloads table
-- Date: 2026-03-03
-- Purpose: Allow documents to track their original issue/publication date
--          separate from the upload timestamp (created_at)
ALTER TABLE downloads
ADD COLUMN IF NOT EXISTS content_date DATE,
    ADD COLUMN IF NOT EXISTS content_year INTEGER;
-- Backfill year from date when date is set
UPDATE downloads
SET content_year = EXTRACT(
        YEAR
        FROM content_date
    )::INTEGER
WHERE content_date IS NOT NULL
    AND content_year IS NULL;
-- Index for year filtering
CREATE INDEX IF NOT EXISTS idx_downloads_content_year ON downloads(content_year);