const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is missing');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for some hosted Postgres providers
  },
});

async function fixDataUrls() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Determine Base URL
    const baseUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || 'https://api.parashooting.in';
    console.log(`ℹ️  Using Base URL for fixes: ${baseUrl}`);

    // --- FIX DOWNLOADS ---
    console.log('🔄 Checking downloads table...');
    const downloadsRes = await client.query('SELECT id, href FROM downloads WHERE href LIKE \'/%/\' AND href NOT LIKE \'http%\'');
    
    let downloadUpdates = 0;
    for (const row of downloadsRes.rows) {
      // Logic: if href starts with /, prepend baseUrl + /uploads (if not already /uploads?)
      // Seed data was: '/para-shooting-criteria.pdf'
      // We want: 'https://api.../uploads/para-shooting-criteria.pdf'
      
      let newHref = row.href;
      if (newHref.startsWith('/')) {
         // If it already has /uploads (e.g. /uploads/file.pdf), just prepend base
         // If it doesn't (e.g. /file.pdf), prepend base/uploads
         if (newHref.startsWith('/uploads/')) {
             newHref = `${baseUrl}${newHref}`;
         } else {
             newHref = `${baseUrl}/uploads${newHref}`;
         }
      }

      await client.query('UPDATE downloads SET href = $1 WHERE id = $2', [newHref, row.id]);
      downloadUpdates++;
    }
    console.log(`✅ Updated ${downloadUpdates} records in 'downloads' table.`);

    // --- FIX NEWS ARTICLES ---
    console.log('🔄 Checking news_articles documents...');
    // We look for rows where documents is not null and not empty array
    const newsRes = await client.query(`
        SELECT id, documents 
        FROM news_articles 
        WHERE documents IS NOT NULL 
        AND jsonb_array_length(documents) > 0
    `);

    let newsUpdates = 0;
    for (const row of newsRes.rows) {
        let docs = row.documents;
        let modified = false;

        // docs is an array of objects: [{ url, name }]
        const fixedDocs = docs.map(doc => {
            if (doc.url && doc.url.startsWith('/') && !doc.url.startsWith('http')) {
                modified = true;
                let newUrl = doc.url;
                 if (newUrl.startsWith('/api/v1/upload/view/')) {
                     // If it is already an API view path, just prepend base
                     return { ...doc, url: `${baseUrl}${newUrl}` };
                 }
                 // If raw path
                 if (newUrl.startsWith('/uploads/')) {
                     return { ...doc, url: `${baseUrl}${newUrl}` };
                 } else {
                     return { ...doc, url: `${baseUrl}/uploads${newUrl}` };
                 }
            }
            return doc;
        });

        if (modified) {
            await client.query('UPDATE news_articles SET documents = $1 WHERE id = $2', [JSON.stringify(fixedDocs), row.id]);
            newsUpdates++;
        }
    }
    console.log(`✅ Updated ${newsUpdates} records in 'news_articles' table.`);

  } catch (err) {
    console.error('❌ Error fixing data URLs:', err);
  } finally {
    await client.end();
  }
}

fixDataUrls();
