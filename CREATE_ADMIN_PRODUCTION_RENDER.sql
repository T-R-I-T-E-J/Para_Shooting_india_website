-- =====================================================
-- CREATE ADMIN USER FOR RENDER PRODUCTION DATABASE
-- =====================================================
-- Email: admin@psci.in
-- Password: Admin@123
-- 
-- INSTRUCTIONS:
-- 1. Go to: https://dashboard.render.com/d/dpg-cu9v4h8gph6c73aodqog
-- 2. Click "Connect" -> Choose "External Connection" or use SQL Editor
-- 3. Copy and paste this entire script
-- 4. Execute it
-- 5. Try logging in at: https://para-shooting-india-webf.netlify.app/login
-- =====================================================

-- Step 1: Insert the admin user with hashed password
INSERT INTO public.users (
    email,
    password_hash,
    first_name,
    last_name,
    phone,
    email_verified_at,
    is_active,
    created_at,
    updated_at
)
VALUES (
    'admin@psci.in',
    '$2b$10$jYBPzK.kGbtoDYwh89/.dukk.n11yatZPuIwaN/00rXdMgw5n9Sg.',
    'System',
    'Administrator',
    '+91-1234567890',
    NOW(),
    true,
    NOW(),
    NOW()
) 
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    is_active = true,
    email_verified_at = NOW(),
    updated_at = NOW();

-- Step 2: Insert admin role if it doesn't exist
INSERT INTO public.roles (
    name,
    display_name,
    description,
    permissions,
    is_system,
    level,
    created_at,
    updated_at
)
VALUES (
    'admin',
    'Administrator',
    'Full system access with all permissions',
    '{"all": true}'::jsonb,
    true,
    100,
    NOW(),
    NOW()
) 
ON CONFLICT (name) DO NOTHING;

-- Step 3: Assign admin role to the user
INSERT INTO public.user_roles (user_id, role_id, assigned_at)
SELECT 
    u.id,
    r.id,
    NOW()
FROM public.users u
CROSS JOIN public.roles r
WHERE u.email = 'admin@psci.in'
  AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 4: Verify the user was created successfully
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    u.email_verified_at,
    r.name as role_name,
    r.display_name as role_display_name
FROM public.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@psci.in';

-- =====================================================
-- EXPECTED OUTPUT FROM VERIFICATION QUERY:
-- =====================================================
-- id | email          | first_name | last_name    | is_active | email_verified_at | role_name | role_display_name
-- ---|----------------|------------|--------------|-----------|-------------------|-----------|------------------
-- 1  | admin@psci.in  | System     | Administrator| true      | 2026-02-08...     | admin     | Administrator
-- =====================================================
