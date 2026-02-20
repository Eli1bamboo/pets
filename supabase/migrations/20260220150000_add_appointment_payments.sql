-- ============================================
-- Phase 4: MercadoPago for Service Payments
-- ============================================

-- Add payment tracking columns to appointments
ALTER TABLE public.appointments
    ADD COLUMN IF NOT EXISTS mp_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS mp_preference_id TEXT,
    ADD COLUMN IF NOT EXISTS mp_status TEXT,
    ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded'));

-- Index for querying by payment status
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status
    ON public.appointments(payment_status);
