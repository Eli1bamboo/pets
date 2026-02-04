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
            {/* Background Decorations */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-orange/10 blur-3xl opacity-60" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary-teal/10 blur-3xl opacity-60" />

            <div className="relative w-full max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-brand-900/10 overflow-hidden ring-1 ring-brand-900/5">

                    {/* Visual Section - Desktop */}
                    <div className="hidden lg:flex flex-col bg-soft-peach/5 p-16">
                        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white">
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
                                Gestiona el cuidado de <span className="text-primary-orange">tu mascota</span>
                            </h3>
                            <p className="mt-6 text-brand-600 font-medium text-lg leading-relaxed">
                                Accede a tu panel personal para revisar el historial de sesiones, realizar nuevas reservas en segundos y seguir el progreso de tu mejor amigo en tiempo real.
                            </p>
                        </div>
                    </div>

                    {/* Auth Section */}
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-20">
                        <div className="lg:hidden mb-12 flex flex-col items-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-orange text-white mb-6 shadow-lg shadow-primary-orange/20">
                                <Scissors size={32} />
                            </div>
                            <h1 className="text-3xl font-black text-brand-900 tracking-tight">Peluquería Canina</h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl font-black tracking-tight text-brand-900 leading-tight mb-4">
                                    {isSignUp ? "Crea una cuenta" : "¡Hola de nuevo!"}
                                </h2>
                                <p className="text-brand-600 font-medium text-lg">
                                    {isSignUp ? "Únete a nuestra comunidad de dueños felices." : "Ingresa tus datos para continuar."}
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

                                <div className="pt-4">
                                    <Button type="submit" isLoading={loading} className="py-5 text-xl font-black rounded-2xl shadow-xl shadow-primary-orange/10 transition-transform active:scale-[0.98]">
                                        {isSignUp ? "Cerrar Registro" : "Ingresar"}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-12 border-t border-brand-900/5 pt-10 text-center text-sm font-bold text-brand-500">
                                {isSignUp ? "¿Ya tienes una cuenta? " : "¿No tienes cuenta aún? "}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-primary-orange hover:text-brand-900 transition-colors font-black ml-1"
                                >
                                    {isSignUp ? "Inicia sesión" : "Regístrate gratis"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
