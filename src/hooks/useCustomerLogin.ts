import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useCustomerLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        full_name: email.split('@')[0],
                        role: 'customer'
                    }
                },
            });
            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    return { login, signup, loading, error };
}
