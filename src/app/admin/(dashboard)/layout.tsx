"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/organisms/AdminHeader";
import { AdminLoader } from "@/components/molecules/AdminLoader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, isAdmin, loading } = useAuth({
        redirectToLogin: true,
        loginPath: "/admin/login"
    });

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push("/admin/login");
            router.refresh();
        }
    }, [user, isAdmin, loading, router]);

    if (loading) {
        return null;
    }

    // If user is not an admin, or not logged in, show a redirecting message
    // The useEffect above will handle the actual hard redirect
    if (!user || !isAdmin) {
        return null;
    }

    return (
        <div className="bg-background-cream min-h-screen">
            <AdminHeader />
            <main className="mx-auto max-w-7xl">
                {children}
            </main>
        </div>
    );
}
