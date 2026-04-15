-- sync registration entities to the db

DO $$ 
BEGIN 
    -- Competition Events Changes
    ALTER TABLE competition_events ADD COLUMN IF NOT EXISTS event_no VARCHAR(20);
    ALTER TABLE competition_events ADD COLUMN IF NOT EXISTS event_name VARCHAR(255);
    ALTER TABLE competition_events ADD COLUMN IF NOT EXISTS fee DECIMAL(10, 2);

    -- Postgres requires dropping NOT NULL if the TS app doesn't send them
    ALTER TABLE competition_events ALTER COLUMN shooting_event_id DROP NOT NULL;
    ALTER TABLE competition_events ALTER COLUMN scheduled_date DROP NOT NULL;

    -- Enums specifically for these tables to avoid collisions
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registrations_status_enum') THEN
        CREATE TYPE registrations_status_enum AS ENUM ('submitted', 'under_review', 'approved', 'rejected');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registrations_payment_status_enum') THEN
        CREATE TYPE registrations_payment_status_enum AS ENUM ('pending', 'uploaded', 'verified', 'failed');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registrations_payment_method_enum') THEN
        CREATE TYPE registrations_payment_method_enum AS ENUM ('gateway', 'screenshot');
    END IF;

END$$;

CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    competition_id BIGINT NOT NULL REFERENCES competitions(id) ON DELETE RESTRICT,
    shooter_id BIGINT NOT NULL REFERENCES shooters(id) ON DELETE RESTRICT,
    competition_no VARCHAR(30) UNIQUE,
    status registrations_status_enum DEFAULT 'submitted',
    payment_status registrations_payment_status_enum DEFAULT 'pending',
    payment_method registrations_payment_method_enum DEFAULT 'gateway',
    amount DECIMAL(10, 2) DEFAULT 0,
    transaction_id VARCHAR(255),
    payment_proof_url TEXT,
    payment_verified_by BIGINT REFERENCES users(id),
    payment_verified_at TIMESTAMPTZ,
    remarks TEXT,
    terms_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_comp_shooter UNIQUE (competition_id, shooter_id)
);

CREATE TABLE IF NOT EXISTS registration_events (
    id BIGSERIAL PRIMARY KEY,
    registration_id BIGINT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    competition_event_id BIGINT NOT NULL REFERENCES competition_events(id) ON DELETE RESTRICT,
    event_name_snapshot VARCHAR(255) NOT NULL,
    fee_snapshot DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
