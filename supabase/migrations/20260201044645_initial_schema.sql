-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    full_name TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    pet_name TEXT NOT NULL,
    service TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'washing', 'drying', 'ready', 'completed', 'cancelled'))
);

-- 3. Create Business Hours Table
CREATE TABLE IF NOT EXISTS public.business_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME NOT NULL DEFAULT '09:00',
    close_time TIME NOT NULL DEFAULT '18:00',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(day_of_week)
);

-- 4. Initial Data for Business Hours
INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_active)
VALUES 
(0, '09:00', '18:00', false), -- Sunday closed
(1, '09:00', '18:00', true),  -- Monday
(2, '09:00', '18:00', true),  -- Tuesday
(3, '09:00', '18:00', true),  -- Wednesday
(4, '09:00', '18:00', true),  -- Thursday
(5, '09:00', '18:00', true),  -- Friday
(6, '09:00', '13:00', true)   -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

-- 6. Helper Function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 7. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 8. Appointments Policies
CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (
        auth.uid() = user_id OR public.is_admin()
    );

CREATE POLICY "Users can insert own appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
    FOR UPDATE USING (
        auth.uid() = user_id OR public.is_admin()
    );

-- 9. Business Hours Policies
CREATE POLICY "Allow public read access" ON public.business_hours
    FOR SELECT USING (true);

CREATE POLICY "Admins can update business hours" ON public.business_hours
    FOR ALL USING (public.is_admin());
