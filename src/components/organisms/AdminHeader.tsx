"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Calendar, History, LogOut, Scissors, Menu, X, Package, Globe } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useTranslation } from "@/i18n/LanguageContext";

export default function AdminHeader() {
    const { signOut } = useAdminAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { t, language, setLanguage } = useTranslation();

    const navItems = [
        { label: t.admin.header.dashboard, href: "/admin", icon: LayoutDashboard },
        { label: t.admin.header.appointments, href: "/admin/appointments", icon: Calendar },
        { label: t.admin.header.services, href: "/admin/services", icon: Package },
        { label: t.admin.header.history, href: "/admin/history", icon: History },
    ];

    return (
        <header className="bg-admin-primary text-white sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="flex items-center gap-2 font-black text-xl italic tracking-tighter">
                            <Scissors size={20} className="text-admin-accent" />
                            <span>PELUQUERIA <span className="text-admin-accent">ADMIN</span></span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-sm font-bold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <item.icon size={16} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <div className="relative">
                            <Globe size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                                className="appearance-none pl-8 pr-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 text-xs font-bold uppercase tracking-wider border-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
                            >
                                <option value="es" className="text-gray-900 bg-white">ES</option>
                                <option value="en" className="text-gray-900 bg-white">EN</option>
                            </select>
                        </div>
                        <button
                            onClick={() => signOut("/admin/login")}
                            className="text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <LogOut size={14} />
                            {t.admin.header.logout}
                        </button>
                    </div>

                    <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-admin-primary border-t border-white/10 p-4 space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block text-sm font-bold text-white/70 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <Globe size={14} className="text-white/60" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                            className="appearance-none bg-white/10 text-white/80 text-sm font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer focus:outline-none"
                        >
                            <option value="es" className="text-gray-900 bg-white">Español</option>
                            <option value="en" className="text-gray-900 bg-white">English</option>
                        </select>
                    </div>
                    <button
                        onClick={() => signOut("/admin/login")}
                        className="w-full text-left text-sm font-bold text-red-400"
                    >
                        {t.admin.header.logoutMobile}
                    </button>
                </div>
            )}
        </header>
    );
}
