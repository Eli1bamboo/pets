-- Mock Data Generator for History
-- User: turrinelias@gmail.com (927caedc-5249-4929-8716-f12837eabf3e)

WITH mock_data AS (
    SELECT
        uuid_generate_v4() as id,
        timestamp '2025-08-01 10:00:00' + (random() * (interval '180 days')) as date,
        '927caedc-5249-4929-8716-f12837eabf3e'::uuid as user_id,
        (ARRAY['Bobby', 'Rex', 'Luna', 'Simba', 'Nala'])[floor(random() * 5 + 1)] as pet_name,
        (ARRAY['Baño y Corte', 'Sólo Baño', 'Corte de Uñas', 'Baño Medicado'])[floor(random() * 4 + 1)] as service,
        (ARRAY['completed', 'cancelled', 'pending', 'ready'])[floor(random() * 4 + 1)] as status,
        now() as created_at
    FROM generate_series(1, 50)
)
INSERT INTO appointments (user_id, date, pet_name, service, status, created_at)
SELECT user_id, date, pet_name, service, status, created_at FROM mock_data;
