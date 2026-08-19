-- Extension progressive du modèle commercial. Migration additive et idempotente.
ALTER TABLE products ALTER COLUMN price_cents DROP NOT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_source text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_checked_at timestamptz;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tax_included boolean;
ALTER TABLE products ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code varchar(50) UNIQUE NOT NULL,
  permissions jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), parent_id uuid REFERENCES categories(id),
  name varchar(120) NOT NULL, slug varchar(140) UNIQUE NOT NULL, is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(120) UNIQUE NOT NULL,
  slug varchar(140) UNIQUE NOT NULL, website_url text
);
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES brands(id);
CREATE INDEX IF NOT EXISTS products_category_brand_idx ON products(category_id, brand_id);
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL, alt_text varchar(240) NOT NULL, source_url text, author varchar(160),
  license varchar(120), checked_at timestamptz, sort_order integer NOT NULL DEFAULT 0,
  is_illustration boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS product_images_product_idx ON product_images(product_id, sort_order);
CREATE TABLE IF NOT EXISTS product_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name varchar(120) NOT NULL, value varchar(240) NOT NULL, sort_order integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS inventory (
  product_id uuid PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0 CHECK(quantity >= 0), reserved integer NOT NULL DEFAULT 0 CHECK(reserved >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(), CHECK(reserved <= quantity)
);
CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_cents bigint CHECK(price_cents >= 0), currency char(3) NOT NULL DEFAULT 'EUR', tax_included boolean,
  source_url text, checked_at timestamptz NOT NULL, valid_from timestamptz NOT NULL DEFAULT now(), valid_to timestamptz
);
CREATE INDEX IF NOT EXISTS price_history_product_idx ON price_history(product_id, valid_from DESC);
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name varchar(160) NOT NULL, price_cents bigint NOT NULL CHECK(price_cents >= 0),
  reference_price_cents bigint NOT NULL CHECK(reference_price_cents >= price_cents),
  reference_period_days integer NOT NULL DEFAULT 30 CHECK(reference_period_days >= 30),
  starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, evidence_url text NOT NULL,
  is_active boolean NOT NULL DEFAULT false, CHECK(ends_at > starts_at)
);
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  anonymous_token_hash char(64), status varchar(20) NOT NULL DEFAULT 'active', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS cart_items (
  cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE, product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK(quantity BETWEEN 1 AND 99), PRIMARY KEY(cart_id, product_id)
);
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id), quote_id uuid REFERENCES quotes(id),
  status varchar(30) NOT NULL DEFAULT 'pending', currency char(3) NOT NULL DEFAULT 'EUR',
  subtotal_cents bigint, shipping_cents bigint, total_cents bigint, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id), product_name varchar(160) NOT NULL, quantity integer NOT NULL CHECK(quantity > 0),
  unit_price_cents bigint CHECK(unit_price_cents >= 0)
);
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES orders(id),
  provider varchar(50) NOT NULL, provider_reference varchar(160) UNIQUE, status varchar(30) NOT NULL,
  amount_cents bigint NOT NULL CHECK(amount_cents >= 0), currency char(3) NOT NULL DEFAULT 'EUR', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id, product_id)
);
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id), product_id uuid NOT NULL REFERENCES products(id),
  rating integer NOT NULL CHECK(rating BETWEEN 1 AND 5), body text NOT NULL, status varchar(20) NOT NULL DEFAULT 'pending',
  verified_purchase boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid UNIQUE NOT NULL REFERENCES orders(id),
  carrier varchar(120), tracking_number varchar(160), status varchar(30) NOT NULL DEFAULT 'pending',
  estimated_at timestamptz, delivered_at timestamptz
);
CREATE TABLE IF NOT EXISTS content_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug varchar(160) UNIQUE NOT NULL, title varchar(200) NOT NULL,
  body text NOT NULL, status varchar(20) NOT NULL DEFAULT 'draft', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS site_settings (
  key varchar(120) PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
