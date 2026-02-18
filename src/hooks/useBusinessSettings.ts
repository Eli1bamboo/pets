import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { BusinessSettings } from '@/types';

export function useBusinessSettings() {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('business_settings')
                .select('*');

            if (error) throw error;

            const settingsMap: Record<string, any> = {};
            data?.forEach((s: BusinessSettings) => {
                settingsMap[s.key] = s.value;
            });

            setSettings(settingsMap);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching settings:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    const updateSetting = async (key: string, value: any) => {
        try {
            const { error } = await supabase
                .from('business_settings')
                .upsert({ key, value })
                .select();

            if (error) throw error;

            setSettings(prev => ({
                ...prev,
                [key]: value
            }));
            return { success: true };
        } catch (err: any) {
            console.error('Error updating setting:', err);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        error,
        updateSetting,
        refetch: fetchSettings
    };
}
