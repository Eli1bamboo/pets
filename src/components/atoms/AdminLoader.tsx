

interface AdminLoaderProps {
    message?: string;
    fullScreen?: boolean;
}

import { useTranslation } from "@/i18n/LanguageContext";

export function AdminLoader({ message, fullScreen = false }: AdminLoaderProps) {
    const { t } = useTranslation();
    const displayMessage = message || t.common.loading;
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-admin-accent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-admin-accent" />
                </div>
            </div>
            {message && (
                <p className="text-admin-text-secondary text-sm font-medium animate-pulse">
                    {displayMessage}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-admin-bg">
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
