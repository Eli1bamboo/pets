"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scissors, LogOut } from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading, signOut } = useCustomerAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-brand-900/5 bg-background-cream/80 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-orange text-white shadow-lg transition-transform group-hover:rotate-12 group-hover:scale-110 duration-300">
                        <Scissors size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-brand-900">
                        Peluquería <span className="text-primary-orange">Canina</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-10">
                    <Link href="/" className="text-sm font-bold text-brand-700 hover:text-primary-orange transition-colors">
                        Inicio
                    </Link>
                    {user && (
                        <Link href="/history" className="text-sm font-bold text-brand-700 hover:text-primary-orange transition-colors">
                            Mi Historial
                        </Link>
                    )}
                    <Link href="/tracking" className="text-sm font-bold text-brand-700 hover:text-primary-orange transition-colors">
                        Seguimiento
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-6">
                    {loading ? (
                        <div className="h-5 w-24 bg-brand-900/5 animate-pulse rounded-full"></div>
                    ) : user ? (
                        <div className="flex items-center gap-4">
                            <Link href="/profile" className="text-sm font-bold text-brand-900 hover:text-primary-orange transition-colors">
                                Mi Perfil
                            </Link>
                            <button
                                onClick={() => signOut("/")}
                                className="text-brand-600 hover:text-red-500 transition-colors p-1"
                                title="Cerrar sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm font-bold text-brand-900 hover:text-primary-orange transition-colors underline-offset-4 hover:underline">
                            Ingresar
                        </Link>
                    )}
                    <Link
                        href="/booking"
                        className="rounded-full bg-brand-900 px-7 py-3 text-sm font-black text-white shadow-xl hover:bg-primary-orange transition-all hover:scale-105 active:scale-95"
                    >
                        Reservar Turno
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-brand-700 hover:bg-brand-100 hover:text-brand-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
                    >
                        <span className="sr-only">Abrir menú</span>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden border-b border-brand-900/5 bg-background-cream">
                    <div className="space-y-1 px-4 pb-6 pt-2">
                        <Link
                            href="/"
                            className="block rounded-xl px-4 py-3 text-base font-bold text-brand-900 hover:bg-primary-orange/10 hover:text-primary-orange transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/tracking"
                            className="block rounded-xl px-4 py-3 text-base font-bold text-brand-900 hover:bg-primary-orange/10 hover:text-primary-orange transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Seguimiento
                        </Link>
                        <Link
                            href="/booking"
                            className="block rounded-xl px-4 py-3 text-base font-bold text-brand-900 hover:bg-primary-orange/10 hover:text-primary-orange transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Reservar Turno
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    href="/history"
                                    className="block rounded-xl px-4 py-3 text-base font-bold text-brand-900 hover:bg-primary-orange/10 hover:text-primary-orange transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Mi Historial
                                </Link>
                                <Link
                                    href="/profile"
                                    className="block rounded-xl px-4 py-3 text-base font-bold text-brand-900 hover:bg-primary-orange/10 hover:text-primary-orange transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Mi Perfil
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut("/");
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left flex items-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 transition-all"
                                >
                                    <LogOut size={18} />
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block rounded-xl px-4 py-3 text-base font-bold text-brand-900 hover:bg-primary-orange/10 hover:text-primary-orange transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
