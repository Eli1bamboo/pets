"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, Calendar, History, LogOut, Scissors, Menu, X } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminHeader() {
    const { signOut } = useAdminAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Turnos", href: "/admin/appointments", icon: Calendar },
        { label: "Historial", href: "/admin/history", icon: History },
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

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => signOut("/admin/login")}
                            className="text-xs font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <LogOut size={14} />
                            Salir
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
                    <button
                        onClick={() => signOut("/admin/login")}
                        className="w-full text-left text-sm font-bold text-red-400"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </header>
    );
}
