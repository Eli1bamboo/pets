"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";

export default function ResetSessionPage() {
    const [status, setStatus] = useState("Iniciando limpieza...");
    const router = useRouter();
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const clearSession = async () => {
            try {
                setStatus("Cerrando sesión de Supabase...");
                await supabase.auth.signOut();
            } catch (e) {
                console.error("Error signing out:", e);
                setStatus("Error en sign out, continuando forzado...");
            }

            try {
                setStatus("Limpiando LocalStorage y Cookies...");
                window.localStorage.clear();
                window.sessionStorage.clear();

                document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
            } catch (e) {
                console.error("Error clearing storage:", e);
            }

            setStatus("Sesión limpia. Redirigiendo en 2 segundos...");
            setTimeout(() => {
                window.location.href = "/admin/login";
            }, 2000);
        };

        clearSession();
    }, [supabase]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Reseteando Sesión</h1>
            <p className="text-gray-600 font-mono text-sm mb-6">{status}</p>
            <Button onClick={() => window.location.href = "/admin/login"}>
                Ir al Login ahora
            </Button>
        </div>
    );
}
