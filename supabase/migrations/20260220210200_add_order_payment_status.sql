-- Add payment_status column to orders table
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded', 'cancelled'));

-- Create an index to quickly find orders by payment status
CREATE INDEX IF NOT EXISTS idx_orders_payment_status
    ON public.orders(payment_status);

-- Data migration: Migrate existing 'paid' statuses from the fulfillment 'status' column to 'payment_status'
UPDATE public.orders
SET payment_status = 'paid'
WHERE status = 'paid';

-- Backwards compatibility: Reset fulfillment status to pending if it was stuck on 'paid'
-- Since 'paid' is now strictly a payment_status, the fulfillment status should be 'pending'
UPDATE public.orders
SET status = 'pending'
WHERE status = 'paid';
