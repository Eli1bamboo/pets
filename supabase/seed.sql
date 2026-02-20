-- ============================================
-- DEVELOPMENT MOCK DATA SEED
-- ============================================
-- NOTE: This file is run automatically after `supabase db reset`.
-- It populates the database with realistic state to test the UI.
-- DO NOT RUN IN PRODUCTION.
-- ============================================

-- ============================================
-- 1. Business Hours
-- ============================================
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


-- ============================================
-- 2. Auth Users (Mock Accounts)
-- ============================================
-- Hardcoded UUIDs so we can reliably link data

-- admin@example.com
INSERT INTO auth.users (id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@example.com',
    extensions.crypt('123456', extensions.gen_salt('bf')), now(), now(), now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '{"sub":"11111111-1111-1111-1111-111111111111","email":"admin@example.com"}', 'email', now(), now(), now()
) ON CONFLICT (provider, id) DO NOTHING;


-- customer@example.com
INSERT INTO auth.users (id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'customer@example.com',
    crypt('123456', gen_salt('bf')), now(), now(), now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '{"sub":"22222222-2222-2222-2222-222222222222","email":"customer@example.com"}', 'email', now(), now(), now()
) ON CONFLICT (provider, id) DO NOTHING;


-- ============================================
-- 3. Profiles
-- ============================================
-- Trigger created them, we just update them

UPDATE public.profiles 
SET full_name = 'Admin Usuario', phone = '+123456789', is_admin = true
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE public.profiles 
SET full_name = 'Cliente Frecuente', phone = '+987654321', is_admin = false
WHERE id = '22222222-2222-2222-2222-222222222222';


-- ============================================
-- 4. User Addresses
-- ============================================

INSERT INTO public.user_addresses (user_id, label, street, city, state, zip_code, notes, is_default)
VALUES 
('22222222-2222-2222-2222-222222222222', 'Casa', 'Av. Rivadavia 1234, Piso 3A', 'Ciudad Autónoma de Buenos Aires', 'CABA', '1033', 'Tocar timbre 3A', true),
('22222222-2222-2222-2222-222222222222', 'Oficina', 'San Martín 4500', 'Lanús', 'Buenos Aires', '1824', 'Dejar en recepción', false);


-- ============================================
-- 5. Services
-- ============================================
INSERT INTO public.services (name, name_en, price, is_active, sort_order)
VALUES
('Baño y Cepillado', 'Bath & Brush', 15000, true, 1),
('Corte de Pelo', 'Haircut', 25000, true, 2),
('Baño Sanitario', 'Medical Bath', 18000, true, 3),
('Corte de Uñas', 'Nail Trimming', 5000, true, 4)
ON CONFLICT (name) DO NOTHING;


-- ============================================
-- 6. Appointments
-- ============================================

-- Past Completed
INSERT INTO public.appointments (id, user_id, pet_name, service, date, status, price, mp_payment_id, payment_status, created_at)
VALUES 
(1, '22222222-2222-2222-2222-222222222222', 'Rex', 'Baño y Cepillado', (now() - interval '14 days')::date + time '10:00', 'completed', 15000, 'mp_12345', 'paid', now() - interval '16 days'),
(2, '22222222-2222-2222-2222-222222222222', 'Luna', 'Corte de Pelo', (now() - interval '30 days')::date + time '14:00', 'completed', 25000, 'mp_45678', 'paid', now() - interval '33 days');

-- Past Cancelled
INSERT INTO public.appointments (id, user_id, pet_name, service, date, status, price, mp_payment_id, payment_status, created_at)
VALUES 
(3, '22222222-2222-2222-2222-222222222222', 'Max', 'Baño Sanitario', (now() - interval '7 days')::date + time '11:00', 'cancelled', 18000, null, 'unpaid', now() - interval '9 days');

-- Upcoming Pending
INSERT INTO public.appointments (id, user_id, pet_name, service, date, status, price, mp_payment_id, payment_status, created_at)
VALUES 
(4, '22222222-2222-2222-2222-222222222222', 'Rex', 'Baño y Cepillado', (now() + interval '2 days')::date + time '09:00', 'pending', 15000, null, 'pending', now());

-- Upcoming Confirmed/Paid
INSERT INTO public.appointments (id, user_id, pet_name, service, date, status, price, mp_payment_id, payment_status, created_at)
VALUES 
(5, '22222222-2222-2222-2222-222222222222', 'Luna', 'Corte de Pelo', (now() + interval '5 days')::date + time '16:00', 'confirmed', 25000, 'mp_88888', 'paid', now());


-- Restart ID sequence
SELECT setval('public.appointments_id_seq', 10);


-- ============================================
-- 7. Orders (Products)
-- ============================================

-- Order 1: Delivered
INSERT INTO public.orders (id, user_id, status, subtotal, shipping_fee, total, fulfillment, shipping_address, mp_payment_id, mp_status, notes, created_at)
VALUES 
(1, '22222222-2222-2222-2222-222222222222', 'delivered', 23000, 800, 23800, 'delivery', '{"street": "Av. Rivadavia 1234, Piso 3A", "city": "Ciudad Autónoma de Buenos Aires", "state": "CABA", "zip_code": "1033", "notes": "Tocar timbre 3A"}', 'mp_o_111', 'approved', null, now() - interval '20 days');

INSERT INTO public.order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
VALUES 
(1, 1, 'Shampoo Hipoalergénico', 12000, 1, 12000),
(1, 2, 'Acondicionador Desenredante', 11000, 1, 11000);

-- Order 2: Ready for Pickup
INSERT INTO public.orders (id, user_id, status, subtotal, shipping_fee, total, fulfillment, shipping_address, mp_payment_id, mp_status, notes, created_at)
VALUES 
(2, '22222222-2222-2222-2222-222222222222', 'ready', 45000, 0, 45000, 'pickup', null, 'mp_o_222', 'approved', 'Pasará el viernes a la tarde', now() - interval '1 day');

INSERT INTO public.order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
VALUES 
(2, 12, 'Correa Extensible 5m', 25000, 1, 25000),
(2, 28, 'Orejas de Cerdo Horneadas x2', 12000, 1, 12000),
(2, 24, 'Bocaditos de Pollo', 6500, 1, 6500),
(2, 30, 'Golosinas Light', 1500, 1, 1500);

-- Order 3: Combined with Upcoming Appointment #5
INSERT INTO public.orders (id, user_id, status, subtotal, shipping_fee, total, fulfillment, shipping_address, mp_payment_id, mp_status, notes, created_at)
VALUES 
(3, '22222222-2222-2222-2222-222222222222', 'pending', 7000, 0, 7000, 'pickup', null, 'mp_88888', 'approved', 'Retiro junto con turno #5', now());

INSERT INTO public.order_items (order_id, product_id, product_name, product_price, quantity, subtotal)
VALUES 
(3, 22, 'Snacks Dentales Menta', 7000, 1, 7000);


-- Restart ID sequence
SELECT setval('public.orders_id_seq', 10);
