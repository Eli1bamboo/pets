"use client";

import { useEffect } from "react";
import { Button } from "@/components/atoms/Button";
import { AlertTriangle } from "lucide-react";

export default function CustomerError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Customer error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
            <div className="bg-red-50 p-4 rounded-2xl mb-6">
                <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-brand-900 mb-2">Algo salió mal</h2>
            <p className="text-brand-600 mb-8 max-w-md">
                Ocurrió un error inesperado. Podés intentar nuevamente o volver al inicio.
            </p>
            <div className="flex gap-4">
                <Button onClick={reset} variant="primary">
                    Intentar de nuevo
                </Button>
                <Button onClick={() => window.location.href = "/"} variant="outline">
                    Volver al Inicio
                </Button>
            </div>
        </div>
    );
}
