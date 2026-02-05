"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminProvider } from "@/providers/AdminProvider";
import AdminHeader from "@/components/organisms/AdminHeader";
import { AdminLoader } from "@/components/molecules/AdminLoader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminContent>{children}</AdminContent>
    );
}

function AdminContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isAdmin, loading, profile } = useAdminAuth({
        redirectToLogin: true,
        loginPath: "/admin/login"
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                router.push("/admin/login");
            }
        }, 12000);
        return () => clearTimeout(timer);
    }, [loading, router]);

    if (loading) {
        return <AdminLoader fullScreen message="Verificando credenciales..." />;
    }

    if (!user || !isAdmin) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background-cream p-6 text-center">
                <h1 className="text-4xl font-black text-brand-900 mb-4">Acceso Denegado</h1>
                <p className="text-brand-600 mb-8 max-w-md font-medium">
                    No tienes permisos para acceder a esta área. Si crees que esto es un error, intenta cerrar sesión y volver a entrar.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-brand-200 text-brand-900 rounded-2xl font-bold hover:bg-brand-300 transition-colors"
                    >
                        Volver al Inicio
                    </button>
                    <button
                        onClick={() => router.push("/admin/login")}
                        className="px-6 py-3 bg-brand-900 text-white rounded-2xl font-bold hover:bg-black transition-colors"
                    >
                        Ir al Login
                    </button>
                </div>
            </div>
        );
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
