"use client";

import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { LogOut, User } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export function ProfileHeader() {
    const { user, profile } = useCustomerAuth();
    const { t } = useTranslation();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const displayName = profile?.full_name || user?.email?.split("@")[0] || "Usuario";

    return (
        <div className="bg-gradient-to-r from-brand-100 to-white pb-24 pt-12 px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 text-2xl font-bold ring-4 ring-white shadow-sm">
                            {profile?.full_name ? getInitials(profile.full_name) : <User />}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-brand-900">
                                {t.profile.welcome}, <span className="text-brand-600">{displayName}!</span>
                            </h1>
                            <p className="text-brand-500 text-sm font-medium">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
