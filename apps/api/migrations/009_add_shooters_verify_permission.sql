-- Migration 009: Add shooters:verify permission to admin role
-- Required for approve/reject/assign-pci-id/revoke endpoints on AdminShootersController

UPDATE roles
SET permissions = permissions || '{"shooters:verify": true}'::jsonb
WHERE name = 'admin';
