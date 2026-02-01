"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scissors, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAdmin, loading } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-brand-50/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-brand-50">
                        <Scissors size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-brand-900">
                        Peluquería Canina
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8">
                    <Link href="/" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">
                        Inicio
                    </Link>
                    <Link href="/tracking" className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors">
                        Seguimiento
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-sm font-medium text-brand-900 font-bold hover:text-brand-700 transition-colors flex items-center gap-1">
                            Admin
                        </Link>
                    )}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {loading ? (
                        <div className="h-4 w-20 bg-brand-100 animate-pulse rounded"></div>
                    ) : user ? (
                        <Link href="/profile" className="text-sm font-medium text-brand-900 hover:underline">
                            Mi Perfil
                        </Link>
                    ) : (
                        <Link href="/login" className="text-sm font-medium text-brand-900 hover:underline">
                            Ingresar
                        </Link>
                    )}
                    <Link
                        href="/booking"
                        className="rounded-full bg-brand-900 px-5 py-2.5 text-sm font-semibold text-brand-50 shadow-sm hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 transition-all"
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
                <div className="md:hidden border-b border-brand-200 bg-brand-50">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        <Link
                            href="/"
                            className="block rounded-md px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/services"
                            className="block rounded-md px-3 py-2 text-base font-medium text-brand-700 hover:bg-brand-100 hover:text-brand-900"
                            onClick={() => setIsOpen(false)}
                        >
                            Servicios
                        </Link>
                        <Link
                            href="/tracking"
                            className="block rounded-md px-3 py-2 text-base font-medium text-brand-700 hover:bg-brand-100 hover:text-brand-900"
                            onClick={() => setIsOpen(false)}
                        >
                            Seguimiento
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="block rounded-md px-3 py-2 text-base font-bold text-brand-900 hover:bg-brand-100"
                                onClick={() => setIsOpen(false)}
                            >
                                Admin (Gestión)
                            </Link>
                        )}
                        <Link
                            href="/booking"
                            className="block rounded-md px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Reservar Turno
                        </Link>
                        {user ? (
                            <Link
                                href="/profile"
                                className="block rounded-md px-3 py-2 text-base font-medium text-brand-700 hover:bg-brand-100 hover:text-brand-900"
                                onClick={() => setIsOpen(false)}
                            >
                                Mi Perfil
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="block rounded-md px-3 py-2 text-base font-medium text-brand-700 hover:bg-brand-100 hover:text-brand-900"
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
