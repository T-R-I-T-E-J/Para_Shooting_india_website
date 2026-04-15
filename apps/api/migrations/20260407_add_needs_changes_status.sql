-- Migration: Add 'needs_changes' status and admin_feedback column to shooters
-- This allows admins to request corrections without permanently blocking reapplication

-- 1. Drop existing check constraint on registration_status
ALTER TABLE shooters DROP CONSTRAINT IF EXISTS shooters_registration_status_check;

-- 2. Add new check constraint that includes 'needs_changes'
ALTER TABLE shooters ADD CONSTRAINT shooters_registration_status_check
  CHECK (registration_status IN ('incomplete', 'pending', 'approved', 'rejected', 'needs_changes'));

-- 3. Add admin_feedback column to store reason when requesting changes
ALTER TABLE shooters ADD COLUMN IF NOT EXISTS admin_feedback TEXT;
