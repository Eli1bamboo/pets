"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-admin-bg px-6 text-center">
            <div className="bg-red-50 p-4 rounded-2xl mb-6">
                <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-admin-primary mb-2">Error del Sistema</h2>
            <p className="text-admin-text-secondary mb-8 max-w-md">
                Algo salió mal en el panel de administración. Intentá nuevamente o contactá soporte.
            </p>
            <div className="flex gap-4">
                <Button onClick={reset} variant="admin-primary">
                    Intentar de nuevo
                </Button>
                <Button onClick={() => window.location.href = "/admin"} variant="admin-outline">
                    Ir al Dashboard
                </Button>
            </div>
        </div>
    );
}
