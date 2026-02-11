"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
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
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        let mounted = true;

        const syncAdminSession = async (session: Session | null) => {
            try {
                const currentUser = session?.user ?? null;

                if (currentUser) {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", currentUser.id)
                        .single();

                    if (mounted) {
                        if (!error && data?.role === 'admin') {
                            setUser(currentUser);
                            setProfile(data);
                        } else {
                            console.warn("[AdminProvider] Not an admin or profile missing");
                            setUser(null);
                            setProfile(null);
                        }
                    }
                } else {
                    if (mounted) {
                        setUser(null);
                        setProfile(null);
                    }
                }
            } catch (err) {
                console.error("[AdminProvider] Session sync error:", err);
                if (mounted) {
                    setUser(null);
                    setProfile(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            syncAdminSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.id !== user?.id) {
                setLoading(true);
                syncAdminSession(session);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

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
