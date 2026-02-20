import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShippingZone } from '@/types';

export function useShippingZones() {
    const [zones, setZones] = useState<ShippingZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    const fetchZones = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('shipping_zones')
            .select('*')
            .eq('is_active', true)
            .order('flat_fee', { ascending: true });

        setZones(data || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchZones(); }, [fetchZones]);

    /**
     * Find the shipping fee for a given zip code and subtotal.
     * Returns { zone, fee } or null if no zone matches.
     */
    const calculateShipping = (zipCode: string | null, subtotal: number): { zone: ShippingZone; fee: number } | null => {
        if (!zipCode) return null;

        const zone = zones.find(z => z.zip_codes.includes(zipCode));
        if (!zone) return null;

        // Free shipping if above threshold
        if (zone.free_shipping_min && subtotal >= zone.free_shipping_min) {
            return { zone, fee: 0 };
        }

        return { zone, fee: zone.flat_fee };
    };

    return { zones, loading, calculateShipping, refetch: fetchZones };
}
