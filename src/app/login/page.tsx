"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                        data: {
                            full_name: email.split('@')[0],
                            role: 'customer'
                        }
                    },
                });
                if (error) throw error;
                alert("¡Registro exitoso! Revisa tu email.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-background-cream px-6 py-12 lg:px-8 overflow-hidden">
            {/* Background Decorations (Hero-style) */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-orange/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary-teal/10 blur-3xl" />

            <div className="relative w-full max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-brand-900/10 overflow-hidden ring-1 ring-brand-900/5">

                    {/* Visual Section - Desktop */}
                    <div className="hidden lg:block relative bg-soft-peach/10 p-12 overflow-hidden">
                        <div className="absolute top-12 left-12 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-orange text-white">
                                <Scissors size={20} />
                            </div>
                            <span className="text-xl font-black tracking-tight text-brand-900">
                                Peluquería <span className="text-primary-orange">Canina</span>
                            </span>
                        </div>

                        <div className="mt-24 relative aspect-square rounded-3xl overflow-hidden shadow-xl ring-1 ring-brand-900/5">
                            <Image
                                src="/login-bg.png"
                                alt="Mascota mimada"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="mt-12">
                            <h3 className="text-3xl font-black text-brand-900 leading-tight">
                                Mima a tu <span className="text-primary-orange">mejor amigo</span>
                            </h3>
                            <p className="mt-4 text-brand-700 font-medium">
                                Más de 500 mascotas confían en nosotros para verse y sentirse increíbles.
                            </p>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute bottom-10 right-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow-lg animate-bounce">
                            <span className="text-4xl">🐾</span>
                        </div>
                    </div>

                    {/* Auth Section */}
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                        <div className="lg:hidden mb-10 flex flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-orange text-white mb-4">
                                <Scissors size={28} />
                            </div>
                            <h1 className="text-3xl font-black text-brand-900">Peluquería Canina</h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-10">
                                <span className="inline-block rounded-full bg-primary-orange/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-orange ring-1 ring-inset ring-primary-orange/20 mb-6">
                                    {isSignUp ? "Nuevo Registro" : "Acceso Clientes"}
                                </span>
                                <h2 className="text-4xl font-extrabold tracking-tight text-brand-900 leading-tight">
                                    {isSignUp ? "Crea una cuenta" : "¡Qué bueno verte!"}
                                </h2>
                                <p className="mt-3 text-brand-600 font-medium text-lg">
                                    {isSignUp ? "Comienza hoy el cuidado de tu mascota." : "Ingresa para gestionar tus turnos."}
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleAuth}>
                                <FormField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    required
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <FormField
                                    id="password"
                                    label="Contraseña"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-sm text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="pt-2">
                                    <Button type="submit" isLoading={loading} className="py-4 text-lg">
                                        {isSignUp ? "Registrar Cuenta" : "Entrar al Panel"}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-10 border-t border-brand-900/5 pt-8 text-center text-sm font-bold text-brand-500">
                                {isSignUp ? "¿Ya eres parte de la familia? " : "¿Nuevo por aquí? "}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-primary-orange hover:text-brand-900 transition-colors font-black"
                                >
                                    {isSignUp ? "Inicia sesión" : "Crea tu cuenta gratis"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
