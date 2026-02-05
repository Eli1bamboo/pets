import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAdminLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const adminLogin = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            // Simple check to ensure we don't allow non-admins into the panel
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profile?.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error("Acceso denegado. Esta cuenta no tiene permisos de administrador.");
            }

            return { success: true };
        } catch (err: any) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { adminLogin, loading, error };
}
