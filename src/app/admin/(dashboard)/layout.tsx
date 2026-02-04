"use client";

import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/organisms/AdminHeader";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAdmin, loading } = useAuth({
        redirectToLogin: true,
        loginPath: "/admin/login"
    });

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <Loader2 className="animate-spin text-brand-900" size={48} />
            </div>
        );
    }

    if (user && !isAdmin) {
        window.location.href = "/";
        return null;
    }

    if (!user || !isAdmin) return null;

    return (
        <div className="bg-background-cream min-h-screen">
            <AdminHeader />
            <main className="mx-auto max-w-7xl">
                {children}
            </main>
        </div>
    );
}
