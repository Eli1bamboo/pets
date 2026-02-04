"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Lock, User } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;

            // Verify if user is admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profile?.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error("Acceso denegado. Esta cuenta no tiene permisos de administrador.");
            }

            router.push("/admin");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-brand-900 px-6 py-12 overflow-hidden">
            {/* Professional Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-900 text-white mb-6 shadow-xl shadow-brand-900/20">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-brand-900 tracking-tight text-center">Admin Portal</h1>
                    <p className="mt-3 text-brand-600 font-medium text-center">
                        Ingresa tus credenciales para acceder al panel de gestión.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <FormField
                        id="email"
                        label="Email Profesional"
                        type="email"
                        required
                        placeholder="admin@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={User}
                    />

                    <FormField
                        id="password"
                        label="Contraseña"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={Lock}
                    />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full py-5 text-xl font-black rounded-2xl bg-brand-900 hover:bg-black transition-all shadow-xl shadow-brand-900/10"
                    >
                        Acceder al Panel
                    </Button>
                </form>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm font-bold text-brand-500 hover:text-brand-900 transition-colors"
                    >
                        &larr; Volver al sitio público
                    </button>
                </div>
            </motion.div>

            {/* Bottom Accent */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-xs font-bold tracking-widest uppercase">
                <LayoutDashboard size={14} />
                <span>Business Control Center v2.0</span>
            </div>
        </div>
    );
}
