-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    is_system BOOLEAN DEFAULT FALSE,
    parent_id BIGINT REFERENCES roles(id) ON DELETE
    SET NULL,
        level INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by BIGINT REFERENCES users(id) ON DELETE
    SET NULL,
        assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        UNIQUE(user_id, role_id)
);
-- Insert default roles
INSERT INTO roles (
        name,
        display_name,
        description,
        permissions,
        is_system,
        level
    )
VALUES (
        'admin',
        'Administrator',
        'Full system access',
        '{"users:read": true, "users:create": true, "users:update": true, "users:delete": true, "roles:read": true, "roles:create": true, "roles:update": true, "roles:delete": true, "roles:assign": true, "shooters:read": true, "shooters:create": true, "shooters:update": true, "shooters:delete": true, "competitions:read": true, "competitions:create": true, "competitions:update": true, "competitions:delete": true, "scores:read": true, "scores:create": true, "scores:update": true, "scores:delete": true, "audit:read": true, "system:admin": true}'::jsonb,
        true,
        0
    ),
    (
        'editor',
        'Editor',
        'Can manage content and users',
        '{"users:read": true, "users:update": true, "shooters:read": true, "shooters:create": true, "shooters:update": true, "competitions:read": true, "competitions:create": true, "competitions:update": true, "scores:read": true, "scores:create": true, "scores:update": true}'::jsonb,
        true,
        1
    ),
    (
        'viewer',
        'Viewer',
        'Read-only access',
        '{"users:read": true, "shooters:read": true, "competitions:read": true, "scores:read": true}'::jsonb,
        true,
        2
    ),
    (
        'shooter',
        'Shooter',
        'Registered shooter with basic access',
        '{"shooters:read": true, "competitions:read": true, "scores:read": true}'::jsonb,
        true,
        2
    ) ON CONFLICT (name) DO NOTHING;
-- (Removed redundant ALTER TABLE users statements as they are now in base migration)