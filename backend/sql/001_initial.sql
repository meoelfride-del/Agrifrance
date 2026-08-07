CREATE EXTENSION IF NOT EXISTS "pgcrypto";
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('VISITOR','AGRICULTURIST_EMPLOYEE','COMPANY_MANAGER','DEALER_ADMIN','SUPER_ADMIN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(160) NOT NULL,
  tax_id varchar(80) UNIQUE, status varchar(30) NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid REFERENCES companies(id), email varchar(255) UNIQUE NOT NULL,
  name varchar(120) NOT NULL, password_hash text NOT NULL, role user_role NOT NULL DEFAULT 'AGRICULTURIST_EMPLOYEE',
  mfa_secret text, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL, expires_at timestamptz NOT NULL, revoked_at timestamptz, ip_address inet, user_agent text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(160) NOT NULL, slug varchar(180) UNIQUE NOT NULL, brand varchar(100) NOT NULL,
  price_cents bigint NOT NULL CHECK(price_cents>=0), currency char(3) NOT NULL DEFAULT 'EUR', engine_power_hp integer NOT NULL,
  transmission_type varchar(80) NOT NULL, condition varchar(10) NOT NULL CHECK(condition IN ('new','used')),
  stock_status varchar(30) NOT NULL DEFAULT 'available', technical_specs jsonb NOT NULL DEFAULT '{}', is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_filter_idx ON products(engine_power_hp,transmission_type,condition);
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference varchar(32) UNIQUE NOT NULL DEFAULT ('DV-'||to_char(now(),'YYYY')||'-'||upper(substr(encode(gen_random_bytes(4),'hex'),1,8))),
  user_id uuid NOT NULL REFERENCES users(id), company_id uuid REFERENCES companies(id), product_slug varchar(180) NOT NULL,
  company_name varchar(160) NOT NULL, contact_name varchar(120) NOT NULL, email varchar(255) NOT NULL, phone varchar(30) NOT NULL,
  surface_hectares numeric(12,2) NOT NULL, message text NOT NULL DEFAULT '', configuration jsonb NOT NULL DEFAULT '{}',
  total_cents bigint, currency char(3) NOT NULL DEFAULT 'EUR', status varchar(30) NOT NULL DEFAULT 'submitted', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quotes_company_idx ON quotes(company_id,created_at DESC);
CREATE TABLE IF NOT EXISTS spare_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference varchar(40) UNIQUE NOT NULL, name varchar(180) NOT NULL,
  compatibility text NOT NULL, price_cents integer NOT NULL CHECK(price_cents>=0), currency char(3) NOT NULL DEFAULT 'EUR',
  stock_status varchar(30) NOT NULL DEFAULT 'available', stock_quantity integer NOT NULL DEFAULT 0,
  category varchar(80) NOT NULL, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS spare_parts_search_idx ON spare_parts(category,stock_status);
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY, user_id uuid REFERENCES users(id) ON DELETE SET NULL, event varchar(80) NOT NULL,
  ip_address inet, metadata jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
