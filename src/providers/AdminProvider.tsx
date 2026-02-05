"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";

interface AdminContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    isAdmin: boolean;
    signOut: (redirectPath?: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const syncAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", currentUser.id)
                        .single();

                    if (!error && data?.role === 'admin') {
                        setProfile(data);
                    } else {
                        setProfile(null);
                    }
                }
            } catch (err) {
                console.error("[AdminProvider] Sync error:", err);
            } finally {
                setLoading(false);
            }
        };

        syncAdmin();

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
                    if (data?.role === 'admin') {
                        setProfile(data);
                    } else {
                        setProfile(null);
                    }
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

    const signOut = async (redirectPath: string = "/admin/login") => {
        await supabase.auth.signOut();
        window.location.href = redirectPath;
    };

    return (
        <AdminContext.Provider value={{
            user,
            profile,
            loading,
            isAdmin: profile?.role === "admin",
            signOut
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdminContext must be used within an AdminProvider");
    }
    return context;
}
