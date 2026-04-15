import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

async function resetAdminPassword() {
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

    const password = 'Admin@123';
    console.log(`🔒 Hashing password: "${password}"...`);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed.');

    console.log('👤 Updating Admin User...');
    const updateQuery = `
      UPDATE public.users 
      SET password_hash = $1, is_active = true, updated_at = NOW()
      WHERE email = 'admin@psci.in'
      RETURNING id, email, is_active;
    `;
    
    const res = await client.query(updateQuery, [hashedPassword]);
    
    if (res.rowCount === 0) {
      console.log('⚠️ Admin user not found. Creating one...');
      const insertQuery = `
        INSERT INTO public.users (email, password_hash, first_name, last_name, phone, email_verified_at, is_active, created_at, updated_at) 
        VALUES ('admin@psci.in', $1, 'System', 'Administrator', '+91-1234567890', NOW(), true, NOW(), NOW()) 
        RETURNING id, email;
      `;
      await client.query(insertQuery, [hashedPassword]);
      console.log('✅ Admin user created.');
    } else {
      console.log('✅ Admin user updated.');
    }

    // Ensure role exists
    console.log('🛡️ Ensuring Admin Role...');
    await client.query(`
      INSERT INTO public.roles (name, display_name, description, permissions, is_system, level, created_at, updated_at) 
      VALUES ('admin', 'Administrator', 'Full system access', '{"all": true}'::jsonb, true, 100, NOW(), NOW()) 
      ON CONFLICT (name) DO NOTHING;
    `);

    // Assign role
    console.log('🔗 Assigning Role...');
    await client.query(`
      INSERT INTO public.user_roles (user_id, role_id, assigned_at) 
      SELECT u.id, r.id, NOW() 
      FROM public.users u 
      CROSS JOIN public.roles r 
      WHERE u.email = 'admin@psci.in' AND r.name = 'admin' 
      ON CONFLICT (user_id, role_id) DO NOTHING;
    `);
    console.log('✅ Setup complete.');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
    console.log('👋 Connection closed.');
  }
}

void resetAdminPassword();
