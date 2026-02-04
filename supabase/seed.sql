-- 1. Create Test Users in Auth (for local development only)
-- These satisfy the foreign key requirements for profiles
-- Note: On a real Supabase cloud project, you should invite these emails or sign up manually.

-- 2. Initial Data for Profiles
INSERT INTO public.profiles (id, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Admin Test User', 'admin'),
  ('11111111-1111-1111-1111-111111111111', 'Regular Client John', 'customer'),
  ('22222222-2222-2222-2222-222222222222', 'Regular Client Maria', 'customer')
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Data for Appointments
INSERT INTO public.appointments (user_id, pet_name, service, date, status)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Buddy', 'Premium Cut', NOW() + INTERVAL '1 day', 'pending'),
  ('11111111-1111-1111-1111-111111111111', 'Max', 'Bath & Spa', NOW() - INTERVAL '2 hours', 'washing'),
  ('22222222-2222-2222-2222-222222222222', 'Luna', 'Full Grooming', NOW() + INTERVAL '3 days', 'pending')
ON CONFLICT DO NOTHING;

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
