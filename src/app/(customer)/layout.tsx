"use client";

import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAdmin) {
            router.push("/admin");
        }
    }, [isAdmin, loading, router]);

    // Optionally show a loader while checking for admin to avoid flash
    if (!loading && isAdmin) return null;

    return (
        <>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
