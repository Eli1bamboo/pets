"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";

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

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                    data: {
                        full_name: email.split('@')[0], // Default name
                        role: 'customer'
                    }
                },
            });
            if (error) setError(error.message);
            else alert("¡Registro exitoso! Revisa tu email.");
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) setError(error.message);
            else {
                router.push("/");
                router.refresh();
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-brand-50 h-screen">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="mx-auto h-12 w-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                    <Scissors size={24} />
                </div>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-brand-900">
                    {isSignUp ? "Crear una cuenta" : "Iniciar sesión"}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleAuth}>
                    <FormField
                        id="email"
                        label="Email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <FormField
                        id="password"
                        label="Contraseña"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-md border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button type="submit" isLoading={loading}>
                            {isSignUp ? "Registrarse" : "Entrar"}
                        </Button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-brand-500">
                    {isSignUp ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="font-semibold leading-6 text-brand-600 hover:text-brand-500"
                    >
                        {isSignUp ? "Inicia sesión" : "Regístrate gratis"}
                    </button>
                </p>
            </div >
        </div >
    );
}
