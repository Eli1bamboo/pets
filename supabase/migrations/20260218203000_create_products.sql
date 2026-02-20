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

-- Seed Products (30 items)
INSERT INTO public.products (category_id, name, name_en, description, description_en, price, compare_at_price, sku, stock_quantity, low_stock_threshold, is_active, is_featured, weight_grams, sort_order)
VALUES
    -- 1: Higiene
    (1, 'Shampoo Hipoalergénico', 'Hypoallergenic Shampoo', 'Shampoo suave para pieles sensibles', 'Mild shampoo for sensitive skin', 12000.00, 15000.00, 'HIG-001', 50, 5, true, true, 500, 1),
    (1, 'Acondicionador Desenredante', 'Detangling Conditioner', 'Acondicionador para pelaje largo', 'Conditioner for long coats', 11000.00, null, 'HIG-002', 30, 5, true, false, 500, 2),
    (1, 'Toallitas Húmedas', 'Pet Wipes', 'Toallitas de limpieza rápida', 'Quick cleaning wipes', 5500.00, null, 'HIG-003', 100, 10, true, false, 200, 3),
    (1, 'Perfume Floral', 'Floral Perfume', 'Perfume desodorizante', 'Deodorizing perfume', 8000.00, 9500.00, 'HIG-004', 25, 5, true, true, 100, 4),
    (1, 'Cepillo Saca Pelos', 'Deshedding Brush', 'Cepillo para quitar pelo muerto', 'Brush to remove loose hair', 15000.00, null, 'HIG-005', 40, 5, true, true, 150, 5),
    (1, 'Pasta Dental Canina', 'Dog Toothpaste', 'Sabor a carne', 'Beef flavored toothpaste', 6000.00, null, 'HIG-006', 45, 5, true, false, 100, 6),
    (1, 'Limpiador de Oídos', 'Ear Cleaner', 'Gotas para la higiene auricular', 'Ear hygiene drops', 7500.00, null, 'HIG-007', 35, 5, true, false, 120, 7),
    (1, 'Jabón Pulguicida', 'Flea Soap', 'Jabón en barra antipulgas', 'Flea bar soap', 4500.00, null, 'HIG-008', 60, 10, true, false, 100, 8),
    (1, 'Talco Desodorante', 'Deodorizing Powder', 'Talco en seco', 'Dry powder', 5000.00, null, 'HIG-009', 55, 5, true, false, 150, 9),
    (1, 'Cortauñas Profesional', 'Pro Nail Clipper', 'Alicate de acero', 'Steel nail clipper', 13500.00, 16000.00, 'HIG-010', 20, 3, true, true, 200, 10),

    -- 2: Accesorios
    (2, 'Collar Reflectante M', 'Reflective Collar M', 'Collar seguro para la noche', 'Safe collar for the night', 9500.00, null, 'ACC-001', 40, 5, true, true, 100, 11),
    (2, 'Correa Extensible 5m', 'Retractable Leash 5m', 'Hasta 5 metros de largo', 'Up to 5 meters long', 25000.00, 30000.00, 'ACC-002', 20, 3, true, true, 300, 12),
    (2, 'Cama Ortopédica G', 'Orthopedic Bed L', 'Cama viscoelástica para perros grandes', 'Memory foam bed for large dogs', 85000.00, 95000.00, 'ACC-003', 10, 2, true, true, 3000, 13),
    (2, 'Plato Antideslizante Acero', 'Anti-slip Steel Bowl', 'Comedero de acero inoxidable', 'Stainless steel bowl', 12000.00, null, 'ACC-004', 50, 5, true, false, 400, 14),
    (2, 'Juguete Mordillo Goma', 'Rubber Chew Toy', 'Resistente para mordidas fuertes', 'Durable for heavy chewers', 8500.00, null, 'ACC-005', 60, 10, true, false, 250, 15),
    (2, 'Arnés Antitirones', 'No-Pull Harness', 'Para paseos sin estrés', 'For stress-free walks', 32000.00, null, 'ACC-006', 15, 3, true, true, 350, 16),
    (2, 'Pelota de Tenis x3', 'Tennis Balls x3', 'Pack de 3 pelotas', 'Pack of 3 balls', 5000.00, null, 'ACC-007', 100, 10, true, false, 150, 17),
    (2, 'Pretal de Paseo', 'Walking Harness', 'Diseño ergonómico', 'Ergonomic design', 18000.00, 22000.00, 'ACC-008', 25, 5, true, false, 200, 18),
    (2, 'Bebedero Portátil', 'Portable Water Bottle', 'Ideal para el parque', 'Ideal for the park', 14000.00, null, 'ACC-009', 30, 5, true, false, 250, 19),
    (2, 'Chapita Identificatoria', 'ID Tag', 'Para grabar', 'Ready for engraving', 3000.00, null, 'ACC-010', 200, 20, true, false, 50, 20),

    -- 3: Snacks & Premios
    (3, 'Hueso de Cuero G', 'Rawhide Bone L', 'Ideal para entretener', 'Great for entertaining', 4500.00, null, 'SNK-001', 80, 10, true, false, 150, 21),
    (3, 'Snacks Dentales Menta', 'Mint Dental Sticks', 'Cuidado oral diario', 'Daily oral care', 7000.00, null, 'SNK-002', 60, 10, true, true, 200, 22),
    (3, 'Galletas Sabor Carne 500g', 'Beef Cookies 500g', 'Galletitas crujientes', 'Crunchy cookies', 8500.00, 10000.00, 'SNK-003', 40, 5, true, true, 500, 23),
    (3, 'Bocaditos de Pollo', 'Chicken Bites', 'Premios para entrenamiento', 'Training treats', 6500.00, null, 'SNK-004', 50, 5, true, false, 150, 24),
    (3, 'Tiras de Carne Seca', 'Jerky Strips', '100% naturales', '100% natural', 11000.00, null, 'SNK-005', 30, 5, true, true, 250, 25),
    (3, 'Huesitos Sabor Queso', 'Cheese Flavored Bones', 'Para razas pequeñas', 'For small breeds', 5500.00, null, 'SNK-006', 70, 10, true, false, 180, 26),
    (3, 'Sticks de Salmón', 'Salmon Sticks', 'Altos en Omega 3', 'High in Omega 3', 9000.00, 11500.00, 'SNK-007', 25, 5, true, false, 150, 27),
    (3, 'Orejas de Cerdo Horneadas x2', 'Baked Pig Ears x2', 'Masticable natural', 'Natural chew', 12000.00, null, 'SNK-008', 40, 5, true, false, 120, 28),
    (3, 'Alfajor para Perros', 'Dog Alfajor', 'Premio especial', 'Special treat', 2500.00, null, 'SNK-009', 100, 10, true, false, 80, 29),
    (3, 'Golosinas Light', 'Light Treats', 'Bajas en calorías', 'Low calorie', 6800.00, null, 'SNK-010', 45, 5, true, false, 200, 30)
ON CONFLICT (sku) DO NOTHING;
