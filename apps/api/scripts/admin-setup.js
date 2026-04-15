/* eslint-disable */
// @ts-nocheck
const { Client } = require('pg');

async function setupAdmin() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // 1. Insert/Update User
    console.log('👤 Creating/Updating Admin User...');
    const userQuery = `
      INSERT INTO public.users (email, password_hash, first_name, last_name, phone, email_verified_at, is_active, created_at, updated_at) 
      VALUES ('admin@psci.in', '$2b$10$jYBPzK.kGbtoDYwh89/.dukk.n11yatZPuIwaN/00rXdMgw5n9Sg.', 'System', 'Administrator', '+91-1234567890', NOW(), true, NOW(), NOW()) 
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = true
      RETURNING id, email;
    `;
    await client.query(userQuery);
    console.log('✅ Admin user processed.');

    // 2. Insert Role
    console.log('🛡️ Creating Admin Role...');
    const roleQuery = `
      INSERT INTO public.roles (name, display_name, description, permissions, is_system, level, created_at, updated_at) 
      VALUES ('admin', 'Administrator', 'Full system access', '{"all": true}'::jsonb, true, 100, NOW(), NOW()) 
      ON CONFLICT (name) DO NOTHING;
    `;
    await client.query(roleQuery);
    console.log('✅ Admin role processed.');

    // 3. Assign Role to User
    console.log('🔗 Assigning Role to User...');
    // We can use a subquery/CTE or just direct select as provided by user
    const assignQuery = `
      INSERT INTO public.user_roles (user_id, role_id, assigned_at) 
      SELECT u.id, r.id, NOW() 
      FROM public.users u 
      CROSS JOIN public.roles r 
      WHERE u.email = 'admin@psci.in' AND r.name = 'admin' 
      ON CONFLICT (user_id, role_id) DO NOTHING;
    `;
    await client.query(assignQuery);
    console.log('✅ Role assigned.');

    // 4. Verification
    console.log('\n🔍 Verifying Admin Setup:');
    const verifyQuery = `
      SELECT u.email, u.first_name, u.is_active, r.name as role 
      FROM public.users u 
      LEFT JOIN public.user_roles ur ON u.id = ur.user_id 
      LEFT JOIN public.roles r ON ur.role_id = r.id 
      WHERE u.email = 'admin@psci.in';
    `;
    const res = await client.query(verifyQuery);
    console.table(res.rows);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
    console.log('👋 Connection closed.');
  }
}

setupAdmin();
