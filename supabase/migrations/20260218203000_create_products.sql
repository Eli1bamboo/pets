-- ============================================
-- Phase 1: Product Catalog & Inventory System
-- ============================================

-- Product categories
CREATE TABLE IF NOT EXISTS public.product_categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'package',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id BIGINT REFERENCES public.product_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),
    sku TEXT UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    weight_grams INT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product images (max 6 per product, enforced at app level)
CREATE TABLE IF NOT EXISTS public.product_images (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inventory audit log
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    change_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('sale', 'restock', 'adjustment', 'return', 'damage')),
    reference_id TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- RLS Policies
-- ============================================

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Product Categories: public read active, admin full access
DROP POLICY IF EXISTS "Public can read active categories" ON public.product_categories;
CREATE POLICY "Public can read active categories" ON public.product_categories
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert categories" ON public.product_categories;
CREATE POLICY "Admins can insert categories" ON public.product_categories
    FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update categories" ON public.product_categories;
CREATE POLICY "Admins can update categories" ON public.product_categories
    FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete categories" ON public.product_categories;
CREATE POLICY "Admins can delete categories" ON public.product_categories
    FOR DELETE USING (public.is_admin());

-- Products: public read active, admin full access
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products" ON public.products
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (public.is_admin());

-- Product Images: public read, admin write
DROP POLICY IF EXISTS "Public can read product images" ON public.product_images;
CREATE POLICY "Public can read product images" ON public.product_images
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert product images" ON public.product_images;
CREATE POLICY "Admins can insert product images" ON public.product_images
    FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update product images" ON public.product_images;
CREATE POLICY "Admins can update product images" ON public.product_images
    FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete product images" ON public.product_images;
CREATE POLICY "Admins can delete product images" ON public.product_images
    FOR DELETE USING (public.is_admin());

-- Inventory Logs: admin only
DROP POLICY IF EXISTS "Admins can read inventory logs" ON public.inventory_logs;
CREATE POLICY "Admins can read inventory logs" ON public.inventory_logs
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert inventory logs" ON public.inventory_logs;
CREATE POLICY "Admins can insert inventory logs" ON public.inventory_logs
    FOR INSERT WITH CHECK (public.is_admin());

-- ============================================
-- Seed Categories
-- ============================================

INSERT INTO public.product_categories (name, name_en, slug, icon, sort_order)
VALUES
    ('Higiene', 'Hygiene', 'higiene', 'sparkles', 1),
    ('Accesorios', 'Accessories', 'accesorios', 'collar', 2),
    ('Snacks & Premios', 'Snacks & Treats', 'snacks-premios', 'cookie', 3)
ON CONFLICT (name) DO NOTHING;
