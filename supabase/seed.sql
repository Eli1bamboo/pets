-- 1. Create Test Users in Auth (for local development only)
-- These satisfy the foreign key requirements for profiles
-- Note: On a real Supabase cloud project, you should invite these emails or sign up manually.

-- ⚠️ IMPORTANTE: En proyectos de Supabase CLOUD (no Docker), 
-- no puedes insertar en 'profiles' sin que el usuario exista primero en 'auth.users'.
-- Crea un usuario manualmente en el panel de Supabase y usa su ID aquí.

/*
-- 2. Initial Data for Profiles (REQUIERE USUARIOS REALES EN AUTH.USERS)
INSERT INTO public.profiles (id, full_name, role)
VALUES 
  ('TU_ID_REAL_AQUÍ', 'Admin Test User', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Data for Appointments (REQUIERE EL ID ANTERIOR)
INSERT INTO public.appointments (user_id, pet_name, service, date, status)
VALUES 
  ('TU_ID_REAL_AQUÍ', 'Buddy', 'Premium Cut', NOW() + INTERVAL '1 day', 'pending')
ON CONFLICT DO NOTHING;
*/

-- 4. Verify Business Hours (already handled by migrations, but ensuring defaults)
INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_active)
VALUES 
(0, '09:00', '18:00', false),
(1, '09:00', '18:00', true),
(2, '09:00', '18:00', true),
(3, '09:00', '18:00', true),
(4, '09:00', '18:00', true),
(5, '09:00', '18:00', true),
(6, '09:00', '13:00', true)
ON CONFLICT (day_of_week) DO NOTHING;
