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
        <div className="flex min-h-screen bg-background-cream overflow-hidden">
            {/* Left Side: Desktop Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-primary-orange/10">
                <Image
                    src="/login-bg.png"
                    alt="Pet grooming"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white"
                    >
                        <h1 className="text-5xl font-black mb-4">Mima a tu mejor amigo</h1>
                        <p className="text-xl font-medium text-white/90">Gestión de turnos y seguimiento en un solo lugar.</p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
                <div className="absolute top-10 left-10 lg:hidden flex items-center gap-2">
                    <div className="bg-primary-orange text-white p-2 rounded-xl">
                        <Scissors size={20} />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <div className="hidden lg:flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-orange/10 text-primary-orange mb-6">
                            <Scissors size={28} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-brand-900 mb-2">
                            {isSignUp ? "Únete a la familia" : "¡Hola de nuevo!"}
                        </h2>
                        <p className="text-brand-600 font-medium">
                            {isSignUp ? "Crea tu cuenta para empezar a cuidar a tu mascota." : "Ingresa tus credenciales para acceder a tu panel."}
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
                                {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
                            </Button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm font-bold text-brand-500">
                        {isSignUp ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-primary-orange hover:text-brand-900 transition-colors"
                        >
                            {isSignUp ? "Inicia sesión ahora" : "Regístrate gratis"}
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
