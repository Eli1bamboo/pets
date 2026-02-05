"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
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
    const supabase = createClient();
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const syncCustomer = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    const { data } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", currentUser.id)
                        .single();
                    setProfile(data);
                }
            } catch (err) {
                console.error("[CustomerProvider] Sync error:", err);
            } finally {
                setLoading(false);
            }
        };

        syncCustomer();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                const newUser = session?.user ?? null;
                setUser(newUser);
                if (newUser) {
                    const { data } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", newUser.id)
                        .single();
                    setProfile(data);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
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
