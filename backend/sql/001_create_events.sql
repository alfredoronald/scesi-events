CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  location text NOT NULL,
  cover_image_url text,
  participation_kind text NOT NULL CHECK (participation_kind IN ('organized', 'invited', 'staff')),
  registration_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_valid_dates CHECK (ends_at >= starts_at)
);

CREATE INDEX IF NOT EXISTS events_published_starts_at_idx
  ON events (starts_at)
  WHERE status = 'published';
