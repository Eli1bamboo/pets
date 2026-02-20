-- ============================================
-- Phase 3: Delivery & Fulfillment
-- ============================================

-- ─── User Addresses ─────────────────────────

CREATE TABLE user_addresses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    label TEXT DEFAULT 'Casa',
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    notes TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Only one default address per user (handled in app logic, index for perf)
CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);

-- ─── Shipping Zones ─────────────────────────

CREATE TABLE shipping_zones (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    zip_codes TEXT[],
    flat_fee NUMERIC(10,2) NOT NULL,
    free_shipping_min NUMERIC(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── RLS Policies ───────────────────────────

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

-- Users can manage their own addresses
CREATE POLICY "Users manage own addresses"
    ON user_addresses FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Shipping zones are readable by everyone, writable by admins
CREATE POLICY "Anyone can read active shipping zones"
    ON shipping_zones FOR SELECT
    USING (true);

CREATE POLICY "Admins manage shipping zones"
    ON shipping_zones FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ─── Seed default shipping zone ─────────────

INSERT INTO shipping_zones (name, zip_codes, flat_fee, free_shipping_min, is_active)
VALUES
    ('Local', ARRAY['1000','1001','1002','1003','1004','1005','1006','1007','1008','1009','1010'], 500, 15000, true),
    ('CABA', ARRAY['1400','1401','1402','1403','1404','1405','1406','1407','1408','1409','1410','1411','1412','1413','1414','1415','1416','1417','1418','1419','1420','1421','1422','1423','1424','1425','1426','1427','1428'], 800, 20000, true),
    ('GBA', ARRAY['1600','1601','1602','1603','1604','1605','1606','1607','1608','1609','1610','1611','1612','1613','1614','1615','1616','1617','1618','1619','1620','1621'], 1200, 25000, true);
