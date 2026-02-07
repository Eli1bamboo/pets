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
