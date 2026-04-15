const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// --- Manual .env Loading Start ---
// Attempt to read .env from apps/api if DATABASE_URL is missing
const envPath = path.resolve(__dirname, '../.env');
if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const dbLine = content.split('\n').find(line => line.trim().startsWith('DATABASE_URL='));
    const renderLine = content.split('\n').find(line => line.trim().startsWith('RENDER_EXTERNAL_URL='));

    if (dbLine) {
        process.env.DATABASE_URL = dbLine.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
        console.log('✅ Loaded DATABASE_URL from api/.env');
    }
    if (renderLine) {
        process.env.RENDER_EXTERNAL_URL = renderLine.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
        console.log('✅ Loaded RENDER_EXTERNAL_URL from api/.env');
    }

  } catch (e) {
    console.error('❌ Failed to read .env file:', e.message);
  }
}
// --- Manual .env Loading End ---

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is missing (and not found in apps/api/.env)');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function diagnose() {
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    console.log('--- ENVIRONMENT INFO ---');
    console.log('CWD:', process.cwd());
    console.log('UPLOAD_DIR (env):', process.env.UPLOAD_DIR || '(not set)');
    console.log('RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL || '(not set)');
    console.log('APP_URL:', process.env.APP_URL || '(not set)');
    console.log('------------------------');

    // 1. Check News Loopkup
    console.log('\n🔍 Checking News Article "test39" (Event)...');
    // Correct column is 'status', not 'is_published'
    const newsRes = await client.query('SELECT id, title, slug, status, category, author_id, deleted_at FROM news_articles WHERE slug LIKE $1', ['%test39%']);
    
    if (newsRes.rows.length === 0) {
      console.log('❌ No news article found matching "test39"');
      // List top 5 slugs
      const topNews = await client.query('SELECT slug, status, category FROM news_articles ORDER BY created_at DESC LIMIT 5');
      console.log('Latest 5 slugs:', topNews.rows.map(r => `${r.slug} (${r.status} - ${r.category})`));
    } else {
      console.log('Found article(s):');
      console.table(newsRes.rows);
      
      const article = newsRes.rows[0];
      if (article.status !== 'published') {
        console.warn('⚠️ Article is NOT published! This explains the 404 on public site.');
      }
      console.log(`ℹ️ Category in DB: '${article.category}'`);

      // Check Author
      if (article.author_id) {
          const userRes = await client.query('SELECT id, name, deleted_at FROM users WHERE id = $1', [article.author_id]);
          if (userRes.rows.length === 0) {
              console.warn(`⚠️ Article references author_id ${article.author_id} which DOES NOT EXIST in users table! TypeORM query might be failing due to this.`);
          } else {
              console.log(`✅ Author exists: ${userRes.rows[0].name} (deleted: ${userRes.rows[0].deleted_at})`);
          }
      }

      // Test API Retrieval
      if (process.env.RENDER_EXTERNAL_URL) {
          const testUrl = `${process.env.RENDER_EXTERNAL_URL}/api/v1/news/${article.slug}`;
          console.log(`\nTesting API fetch: ${testUrl}`);
          try {
             // Basic fetch polyfill check
             if (typeof fetch !== 'undefined') {
                 const res = await fetch(testUrl);
                 console.log(`API Response Status: ${res.status} ${res.statusText}`);
                 if (res.ok) {
                     const json = await res.json();
                     console.log('API returned JSON:', JSON.stringify(json).substring(0, 100) + '...');
                 } else {
                     console.log('API Error Body:', await res.text());
                 }
             } else {
                 console.log('fetch not available in this Node env, skipping network test.');
             }
          } catch (e) {
              console.error(`API Fetch Failed: ${e.message}`);
          }
      }
    }

    // 2. Check Results
    console.log('\n🔍 Checking Latest Result...');
    const resultRes = await client.query('SELECT id, title, url, file_name, stored_file_name FROM results ORDER BY created_at DESC LIMIT 1');
    if (resultRes.rows.length === 0) {
      console.log('❌ No results found in DB');
    } else {
      const result = resultRes.rows[0];
      console.log('Latest Result:', result);

      // Check URL format
      const expectedPrefix = '/uploads/results/';
      console.log(`URL Pattern Valid? ${result.url.includes(expectedPrefix) ? 'YES' : 'NO (Expected to contain ' + expectedPrefix + ')'}`);

      // 3. Check File System
      console.log('\n📂 Checking File System for Result...');
      
      // Check Default Path (what AppModule uses)
      const defaultPath = path.join(process.cwd(), 'uploads', 'results');
      checkDir(defaultPath, result.stored_file_name, 'Default Path (process.cwd/uploads/results)');

      // Check Configured Path (if different)
      if (process.env.UPLOAD_DIR) {
         checkDir(process.env.UPLOAD_DIR, result.stored_file_name, 'Env UPLOAD_DIR');
      }
    }

  } catch (err) {
    console.error('❌ Diagnostic failed:', err);
  } finally {
    await client.end();
  }
}

function checkDir(dirPath, filename, label) {
  console.log(`\nChecking [${label}]: ${dirPath}`);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ Directory exists`);
    try {
        const files = fs.readdirSync(dirPath);
        console.log(`Files count: ${files.length}`);
        if(files.length > 0) console.log(`First 5 files:`, files.slice(0, 5));
        
        if (filename) {
            const exists = files.includes(filename);
            console.log(`Target file '${filename}' exists? ${exists ? '✅ YES' : '❌ NO'}`);
        }
    } catch (e) {
        console.log(`❌ Error reading directory: ${e.message}`);
    }
  } else {
    console.log(`❌ Directory does NOT exist`);
  }
}

diagnose();
