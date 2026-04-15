
const { Client } = require('pg');
const { config } = require('dotenv');

// Load env vars
config({ path: '.env' });

async function fixDocumentCategories() {
    console.log('Using connection string:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: false
    });

    try {
        console.log('Connecting to database...');
        await client.connect();
        console.log('Database connected.');

        // 1. Identify "Rules" category ID
        // From previous step we know it is 'd5d2aa6f-b245-46ce-bbfc-0c6d0b02e7ea'
        // But let's look it up to be safe
        const rulesCatRes = await client.query(`SELECT * FROM categories WHERE slug = 'rules'`);
        
        if (rulesCatRes.rows.length === 0) {
            console.log('Rules category not found.');
            return;
        }

        const rulesCatId = rulesCatRes.rows[0].id;
        const rulesCatSlug = rulesCatRes.rows[0].slug;

        console.log(`Found Rules Category: ${rulesCatSlug} (${rulesCatId})`);

        // 2. Find documents with this categoryId but mismatched category slug
        const mismatchRes = await client.query(`
            SELECT id, title, category, category_id 
            FROM downloads 
            WHERE category_id = $1 AND category != $2
        `, [rulesCatId, rulesCatSlug]);

        console.log(`Found ${mismatchRes.rows.length} documents with mismatch.`);

        if (mismatchRes.rows.length > 0) {
            console.log('Mismatched documents:', mismatchRes.rows);

            // 3. Update them
            const updateRes = await client.query(`
                UPDATE downloads 
                SET category = $1, updated_at = NOW() 
                WHERE category_id = $2 AND category != $1
            `, [rulesCatSlug, rulesCatId]);

            console.log(`Updated ${updateRes.rowCount} documents.`);
        } else {
            console.log('No mismatches found for Rules category.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
        console.log('Done.');
    }
}

fixDocumentCategories();
