-- Create latest_updates table
CREATE TABLE IF NOT EXISTS public.latest_updates (
    id BIGSERIAL PRIMARY KEY,
    public_id UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    document JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Index for ordering by recency
CREATE INDEX idx_latest_updates_created_at ON public.latest_updates(created_at DESC);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_latest_updates_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_latest_updates_timestamp
    BEFORE UPDATE ON public.latest_updates
    FOR EACH ROW
    EXECUTE FUNCTION update_latest_updates_timestamp();
