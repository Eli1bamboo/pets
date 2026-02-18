"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";

interface CustomerContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    signOut: (redirectPath?: string) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async (userId: string, retries = 3, delay = 1000) => {
            try {
                // Timeout increased to 10s
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Profile fetch timeout")), 10000));
                const fetchPromise = supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single();

                const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

                if (error) throw error;
                if (mounted) setProfile(data);

            } catch (error) {
                console.error(`[CustomerProvider] Profile fetch attempt failed. Retries left: ${retries}`, error);
                if (retries > 0 && mounted) {
                    setTimeout(() => fetchProfile(userId, retries - 1, delay * 2), delay);
                }
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            const newUser = session?.user ?? null;
            setUser(newUser);

            if (newUser) {
                await fetchProfile(newUser.id);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }

            // Always ensure loading is false
            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async (redirectPath: string = "/") => {
        await supabase.auth.signOut();
        window.location.href = redirectPath;
    };

    return (
        <CustomerContext.Provider value={{
            user,
            profile,
            loading,
            signOut
        }}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomerContext() {
    const context = useContext(CustomerContext);
    if (context === undefined) {
        throw new Error("useCustomerContext must be used within a CustomerProvider");
    }
    return context;
}
