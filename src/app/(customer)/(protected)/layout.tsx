"use client";

import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Loader2 } from "lucide-react";

export default function ProtectedCustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useCustomerAuth({
        redirectToLogin: true,
        loginPath: "/login"
    });

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-cream">
                <Loader2 className="animate-spin text-brand-900" size={48} />
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
