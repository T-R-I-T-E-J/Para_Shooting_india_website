// Run this with: node run-migration.mjs
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://admin:postgres_password_123@127.0.0.1:5432/psci_platform',
});

const sql = `
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

CREATE INDEX IF NOT EXISTS idx_collection_images_collection_id ON collection_images(collection_id);
CREATE INDEX IF NOT EXISTS idx_media_collections_created_at ON media_collections(created_at DESC);
`;

try {
  await client.connect();
  console.log('Connected to database');
  await client.query(sql);
  console.log('✓ Tables created successfully: media_collections, collection_images');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
