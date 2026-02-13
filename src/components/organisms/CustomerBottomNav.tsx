"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, User, Plus, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomerBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { name: "Inicio", href: "/", icon: Home },
        { name: "Seguimiento", href: "/tracking", icon: Activity },
        { name: "Historial", href: "/history", icon: Clock },
        { name: "Perfil", href: "/profile", icon: User },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
            <div className="mx-4 mb-4 rounded-3xl bg-white shadow-xl shadow-brand-900/10 border border-brand-50 relative h-20 flex items-center justify-around px-2">

                <Link
                    href="/"
                    className={cn(
                        "flex flex-col items-center justify-center w-14 gap-1 transition-colors",
                        isActive("/") ? "text-brand-500" : "text-gray-400"
                    )}
                >
                    <Home size={24} strokeWidth={isActive("/") ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Inicio</span>
                </Link>

                <Link
                    href="/tracking"
                    className={cn(
                        "flex flex-col items-center justify-center w-14 gap-1 transition-colors",
                        isActive("/tracking") ? "text-brand-500" : "text-gray-400"
                    )}
                >
                    <Activity size={24} strokeWidth={isActive("/tracking") ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Seguimiento</span>
                </Link>

                <div className="relative -top-8">
                    <Link
                        href="/booking"
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 text-white transition-transform active:scale-95 hover:bg-brand-600 border-4 border-brand-50"
                    >
                        <Plus size={32} strokeWidth={3} />
                    </Link>
                </div>

                <Link
                    href="/history"
                    className={cn(
                        "flex flex-col items-center justify-center w-14 gap-1 transition-colors",
                        isActive("/history") ? "text-brand-500" : "text-gray-400"
                    )}
                >
                    <Clock size={24} strokeWidth={isActive("/history") ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Historial</span>
                </Link>

                <Link
                    href="/profile"
                    className={cn(
                        "flex flex-col items-center justify-center w-14 gap-1 transition-colors",
                        isActive("/profile") ? "text-brand-500" : "text-gray-400"
                    )}
                >
                    <User size={24} strokeWidth={isActive("/profile") ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Perfil</span>
                </Link>

            </div>
        </div>
    );
}
