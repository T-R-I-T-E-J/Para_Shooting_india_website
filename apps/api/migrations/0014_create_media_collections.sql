-- Migration: Create media_collections and collection_images tables
-- Run this against your PostgreSQL database

CREATE TABLE IF NOT EXISTS media_collections (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  full_description TEXT,
  featured_image TEXT,
  event_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS collection_images (
  id BIGSERIAL PRIMARY KEY,
  collection_id BIGINT NOT NULL REFERENCES media_collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast image lookups by collection
CREATE INDEX IF NOT EXISTS idx_collection_images_collection_id ON collection_images(collection_id);

-- Index for ordering collections by date
CREATE INDEX IF NOT EXISTS idx_media_collections_created_at ON media_collections(created_at DESC);
