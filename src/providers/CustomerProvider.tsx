"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types";


interface CustomerContextType {
    user: User | null;
    profile: Profile | null;
    loading: boolean; // Auth loading
    isProfileLoading: boolean; // Profile data loading
    signOut: (redirectPath?: string) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async (userId: string, retries = 3, delay = 1000): Promise<void> => {
            console.log(`[CustomerProvider] Starting profile fetch for ${userId}. Retries left: ${retries}`);
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
                if (mounted) {
                    console.log(`[CustomerProvider] Profile fetch successful for ${userId}`);
                    setProfile(data);
                    setProfileLoading(false);
                }

            } catch (error) {
                console.error(`[CustomerProvider] Profile fetch attempt failed. Retries left: ${retries}. Error:`, error);
                if (retries > 0 && mounted) {
                    console.log(`[CustomerProvider] Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchProfile(userId, retries - 1, delay * 2);
                } else {
                    console.error(`[CustomerProvider] All retries exhausted for ${userId}`);
                    if (mounted) setProfileLoading(false);
                }
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            console.log(`[CustomerProvider] Auth state change: ${event}`);

            const newUser = session?.user ?? null;
            setUser(newUser);

            // Auth is resolved as soon as we have a user (or null)
            if (mounted) setAuthLoading(false);

            if (newUser) {
                // Only fetch if we don't have a profile or the user changed
                if (!profile || profile.id !== newUser.id) {
                    setProfileLoading(true);
                    // Don't await this, let it run in background so we don't block auth loading
                    fetchProfile(newUser.id);
                } else {
                    setProfileLoading(false);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setProfile(null);
                setProfileLoading(false);
            }
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
            loading: authLoading,
            isProfileLoading: profileLoading,
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
