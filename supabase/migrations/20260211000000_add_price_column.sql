-- Add price column to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 0;

-- Backfill existing appointments with prices based on service name
UPDATE appointments SET price = 4500 WHERE service = 'Baño y Secado' AND (price IS NULL OR price = 0);
UPDATE appointments SET price = 6500 WHERE service = 'Corte Completo' AND (price IS NULL OR price = 0);
UPDATE appointments SET price = 8000 WHERE service = 'Spa de Deslanado' AND (price IS NULL OR price = 0);
