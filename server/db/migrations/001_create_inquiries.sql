CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  phone varchar(40) NOT NULL,
  email varchar(254) NOT NULL,
  service varchar(100) NOT NULL,
  location varchar(160) NOT NULL,
  message text NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'new',
  source varchar(50) NOT NULL DEFAULT 'website',
  consent_to_contact boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT inquiries_name_length
    CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  CONSTRAINT inquiries_phone_length
    CHECK (char_length(btrim(phone)) BETWEEN 10 AND 40),
  CONSTRAINT inquiries_email_length
    CHECK (char_length(btrim(email)) BETWEEN 3 AND 254),
  CONSTRAINT inquiries_service_length
    CHECK (char_length(btrim(service)) BETWEEN 1 AND 100),
  CONSTRAINT inquiries_location_length
    CHECK (char_length(btrim(location)) BETWEEN 2 AND 160),
  CONSTRAINT inquiries_message_length
    CHECK (char_length(btrim(message)) BETWEEN 10 AND 5000),
  CONSTRAINT inquiries_status_allowed
    CHECK (status IN ('new', 'contacted', 'quoted', 'won', 'lost')),
  CONSTRAINT inquiries_source_length
    CHECK (char_length(btrim(source)) BETWEEN 1 AND 50)
);

CREATE OR REPLACE FUNCTION set_inquiries_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER inquiries_set_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW
EXECUTE FUNCTION set_inquiries_updated_at();

-- Supports status-specific work queues ordered from newest to oldest.
CREATE INDEX inquiries_status_created_at_idx
  ON inquiries (status, created_at DESC);
