import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserAddress } from '@/types';

export function useAddresses() {
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data } = await supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        setAddresses(data || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    const addAddress = async (address: Omit<UserAddress, 'id' | 'user_id' | 'created_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // If this is the first address or marked as default, unset other defaults
        if (address.is_default || addresses.length === 0) {
            await supabase
                .from('user_addresses')
                .update({ is_default: false })
                .eq('user_id', user.id);
        }

        const { data, error } = await supabase
            .from('user_addresses')
            .insert({
                ...address,
                user_id: user.id,
                is_default: address.is_default || addresses.length === 0,
            })
            .select()
            .single();

        if (error) return null;
        await fetchAddresses();
        return data;
    };

    const deleteAddress = async (id: number) => {
        await supabase.from('user_addresses').delete().eq('id', id);
        await fetchAddresses();
    };

    const setDefault = async (id: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', user.id);

        await supabase
            .from('user_addresses')
            .update({ is_default: true })
            .eq('id', id);

        await fetchAddresses();
    };

    const defaultAddress = addresses.find(a => a.is_default) || addresses[0] || null;

    return { addresses, loading, addAddress, deleteAddress, setDefault, defaultAddress, refetch: fetchAddresses };
}
