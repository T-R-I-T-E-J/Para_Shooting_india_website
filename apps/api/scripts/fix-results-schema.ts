import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is missing');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fixSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    console.log('🔄 Dropping old results table...');
    await client.query('DROP TABLE IF EXISTS results CASCADE');

    console.log('🔄 Creating new results table matching Entity...');
    await client.query(`
      CREATE TABLE results (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        title varchar(200) NOT NULL,
        date varchar(50) NOT NULL,
        description text,
        file_name varchar(255) NOT NULL,
        stored_file_name varchar(255) NOT NULL UNIQUE,
        file_size bigint NOT NULL,
        mime_type varchar(100) DEFAULT 'application/pdf',
        url text NOT NULL,
        uploaded_by bigint NOT NULL,
        category_id uuid,
        is_published boolean DEFAULT true,
        is_deleted boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now(),
        CONSTRAINT fk_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id),
        CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);

    console.log('✅ Results table recreated successfully');

  } catch (err) {
    console.error('❌ Error fixing schema:', err);
  } finally {
    await client.end();
  }
}

void fixSchema();
