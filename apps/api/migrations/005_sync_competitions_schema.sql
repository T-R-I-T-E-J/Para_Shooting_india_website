-- Sync competitions table to match Competition entity

ALTER TABLE competitions DROP CONSTRAINT IF EXISTS competitions_check;

ALTER TABLE competitions RENAME COLUMN start_date TO duration_start;
ALTER TABLE competitions RENAME COLUMN end_date TO duration_end;

ALTER TABLE competitions ADD COLUMN IF NOT EXISTS place VARCHAR(255) DEFAULT 'TBD';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'competitions_payment_mode_enum') THEN
        CREATE TYPE competitions_payment_mode_enum AS ENUM ('gateway', 'screenshot');
    END IF;
END$$;

ALTER TABLE competitions ADD COLUMN IF NOT EXISTS payment_mode competitions_payment_mode_enum DEFAULT 'gateway';
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS last_sequence_number INTEGER DEFAULT 0;

ALTER TABLE competitions ADD CONSTRAINT competitions_duration_check CHECK (duration_end >= duration_start);
