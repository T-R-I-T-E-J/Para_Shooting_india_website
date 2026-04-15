const { Client } = require('pg');

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

async function seedCategories() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    const categories = [
      { name: 'Rules & Regulations', slug: 'rules', page: 'policies', order: 10 },
      { name: 'Selection Policy', slug: 'selection', page: 'policies', order: 20 },
      { name: 'Event Calendar', slug: 'calendar', page: 'policies', order: 30 },
      { name: 'Match Documents', slug: 'match', page: 'results', order: 40 },
      { name: 'Classification', slug: 'classification', page: 'classification', order: 10 },
      { name: 'Medical Classification', slug: 'medical_classification', page: 'classification', order: 20 },
      { name: 'IPC License', slug: 'ipc_license', page: 'classification', order: 30 },
      { name: 'National Classification', slug: 'national_classification', page: 'classification', order: 40 }
    ];

    console.log('🔄 Seeding missing categories...');
    let added = 0;

    for (const cat of categories) {
      // Check if exists
      const res = await client.query('SELECT id FROM categories WHERE slug = $1', [cat.slug]);
      if (res.rowCount === 0) {
        await client.query(
          'INSERT INTO categories (name, slug, page, "order", is_active) VALUES ($1, $2, $3, $4, true)',
          [cat.name, cat.slug, cat.page, cat.order]
        );
        console.log(`   + Added category: ${cat.name} (${cat.slug})`);
        added++;
      }
    }

    if (added === 0) {
        console.log('✅ All categories already exist.');
    } else {
        console.log(`✅ Successfully added ${added} missing categories.`);
    }

  } catch (err) {
    console.error('❌ Error seeding categories:', err);
  } finally {
    await client.end();
  }
}

seedCategories();
