"use client";

import { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, signup, loading, error } = useLogin();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSignUp) {
            const result = await signup(email, password);
            if (result.success) {
                alert("¡Registro exitoso! Revisa tu email.");
            }
        } else {
            await login(email, password);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-background-cream px-6 py-4 lg:px-8 lg:py-12 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary-orange/10 blur-3xl opacity-60" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary-teal/10 blur-3xl opacity-60" />

            <div className="relative w-full max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-brand-900/10 overflow-hidden ring-1 ring-brand-900/5">

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
                    <div className="flex flex-col justify-center p-6 lg:p-20 flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="mb-4 lg:mb-12 text-center lg:text-left">
                                <h2 className="text-xl lg:text-4xl font-black tracking-tight text-brand-900 leading-tight mb-1 lg:mb-4">
                                    {isSignUp ? "Crea una cuenta" : "¡Hola de nuevo!"}
                                </h2>
                                <p className="text-brand-600 font-medium text-xs lg:text-lg">
                                    {isSignUp ? "Únete a nuestra comunidad." : "Ingresa tus datos para continuar."}
                                </p>
                            </div>

                            <form className="space-y-3 lg:space-y-6" onSubmit={handleAuth}>
                                <FormField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    required
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="scale-95 lg:scale-100 origin-left"
                                />

                                <FormField
                                    id="password"
                                    label="Contraseña"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="scale-95 lg:scale-100 origin-left"
                                />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-[10px] lg:text-sm text-red-600 font-bold bg-red-50 p-2 lg:p-4 rounded-lg lg:rounded-2xl border border-red-100 flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <div className="pt-2 lg:pt-4">
                                    <Button type="submit" isLoading={loading} className="py-3.5 lg:py-5 text-base lg:text-xl font-black rounded-xl lg:rounded-2xl shadow-xl shadow-primary-orange/10 transition-transform active:scale-[0.98]">
                                        {isSignUp ? "Cerrar Registro" : "Ingresar"}
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-6 lg:mt-12 border-t border-brand-900/5 pt-4 lg:pt-10 text-center text-[10px] lg:text-sm font-bold text-brand-500">
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
