require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function fix() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query(`ALTER TABLE latest_updates ADD COLUMN "date" timestamptz DEFAULT CURRENT_TIMESTAMP;`);
    console.log('Fixed DB: Added "date" column to latest_updates.');
  } catch (err) {
    if (err.code === '42701') {
       console.log('Column "date" already exists.');
    } else {
       console.error('Failed to fix DB:', err);
    }
  } finally {
    await client.end();
  }
}
fix();
