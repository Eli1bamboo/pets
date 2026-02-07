import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BusinessHours } from '@/types';

export function useBusinessHours() {
    const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    const fetchBusinessHours = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('business_hours')
            .select('*')
            .order('day_of_week', { ascending: true });

        if (!error && data) {
            setBusinessHours(data as BusinessHours[]);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchBusinessHours();
    }, [fetchBusinessHours]);

    const updateBusinessHour = async (id: number, updates: Partial<BusinessHours>) => {
        const { error } = await supabase
            .from('business_hours')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating business hours:', error);
            return { success: false, error };
        }

        setBusinessHours(prev =>
            prev.map(bh => bh.id === id ? { ...bh, ...updates } : bh)
        );

        return { success: true };
    };

    const saveSettings = async (hours: BusinessHours[]) => {
        setLoading(true);

        const { error } = await supabase
            .from('business_hours')
            .upsert(hours, { onConflict: 'day_of_week' });

        if (error) {
            console.error('Error saving settings:', error);
            setLoading(false);
            return { success: false, error };
        }

        setBusinessHours(hours);
        setLoading(false);
        return { success: true };
    };

    return {
        businessHours,
        loading,
        updateBusinessHour,
        saveSettings,
        refetch: fetchBusinessHours
    };
}
