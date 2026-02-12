-- Create services table for dynamic service management
CREATE TABLE IF NOT EXISTS public.services (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_en TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    description TEXT,
    description_en TEXT,
    features TEXT[] DEFAULT '{}',
    features_en TEXT[] DEFAULT '{}',
    icon TEXT DEFAULT 'scissors',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Everyone can read active services
DROP POLICY IF EXISTS "Public can read active services" ON public.services;
CREATE POLICY "Public can read active services" ON public.services
    FOR SELECT USING (is_active = true OR public.is_admin());

-- Admins can insert services
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
CREATE POLICY "Admins can insert services" ON public.services
    FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update services
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
CREATE POLICY "Admins can update services" ON public.services
    FOR UPDATE USING (public.is_admin());

-- Admins can delete services
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
CREATE POLICY "Admins can delete services" ON public.services
    FOR DELETE USING (public.is_admin());

-- Seed the 3 existing services
INSERT INTO public.services (name, name_en, price, description, description_en, features, features_en, icon, is_active, sort_order)
VALUES
    ('Baño y Secado', 'Bath & Dry', 4500, 'Cuidado especializado con productos de primera calidad.', 'Specialized care with top-quality products.',
     ARRAY['Shampoo Hipoalergénico', 'Secado con Turbina', 'Corte de Uñas', 'Limpieza de Oídos'],
     ARRAY['Hypoallergenic Shampoo', 'Turbo Drying', 'Nail Trimming', 'Ear Cleaning'],
     'bath', true, 1),
    ('Corte Completo', 'Full Grooming', 6500, 'Cuidado especializado con productos de primera calidad.', 'Specialized care with top-quality products.',
     ARRAY['Todo lo del Baño', 'Corte de Raza / Tijera', 'Perfume Finalizador', 'Moño o Pañuelo'],
     ARRAY['Everything from Bath', 'Breed Cut / Scissors', 'Finishing Perfume', 'Bow or Bandana'],
     'scissors', true, 2),
    ('Spa de Deslanado', 'De-shedding Spa', 8000, 'Cuidado especializado con productos de primera calidad.', 'Specialized care with top-quality products.',
     ARRAY['Baño profundo', 'Técnica de deslanado', 'Hidratación de almohadillas', 'Reducción de caída de pelo'],
     ARRAY['Deep bath', 'De-shedding technique', 'Pad moisturizing', 'Hair fall reduction'],
     'wind', true, 3)
ON CONFLICT (name) DO NOTHING;
