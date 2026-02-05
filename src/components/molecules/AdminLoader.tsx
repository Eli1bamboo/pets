import { Loader2 } from "lucide-react";

interface AdminLoaderProps {
    message?: string;
    fullScreen?: boolean;
}

export function AdminLoader({ message = "Cargando...", fullScreen = false }: AdminLoaderProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            {/* Spinner removed as requested */}
            <p className="text-brand-600 font-bold animate-pulse">{message}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background-cream">
                {content}
            </div>
        );
    }

    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            {content}
        </div>
    );
}
