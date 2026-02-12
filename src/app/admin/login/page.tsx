"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Lock, User, Eye, EyeOff } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminLogin } from "@/hooks/useAdminLogin";
import { AdminLoader } from "@/components/molecules/AdminLoader";
import { useTranslation } from "@/i18n/LanguageContext";


export default function AdminLoginPage() {
    const { isAdmin, loading: authLoading } = useAdminAuth();
    const { adminLogin, loading, error } = useAdminLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        if (!authLoading && isAdmin) {
            router.push("/admin");
        }
    }, [isAdmin, authLoading, router]);

    if (authLoading || isRedirecting) return <AdminLoader fullScreen message={t.admin.login.loadingPortal} />;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await adminLogin(email, password);
        if (result.success) {
            setIsRedirecting(true);
            router.push("/admin");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-slate-900 px-6 py-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-slate-200"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-admin-primary mb-6 border border-slate-200">
                        <Lock size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-admin-primary tracking-tight text-center">{t.admin.login.title}</h1>
                    <p className="mt-2 text-admin-text-secondary text-sm text-center">
                        {t.admin.login.subtitle}
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <FormField
                        id="email"
                        label={t.admin.login.emailLabel}
                        type="email"
                        required
                        placeholder="admin@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={User}
                        variant="admin"
                    />

                    <FormField
                        id="password"
                        label={t.admin.login.passwordLabel}
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={Lock}
                        rightIcon={showPassword ? EyeOff : Eye}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        variant="admin"
                    />

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full h-12 text-base font-semibold"
                        variant="admin-primary"
                    >
                        {t.admin.login.submit}
                    </Button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                    <button
                        onClick={() => router.push("/")}
                        className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        {t.admin.login.backToPublic}
                    </button>
                </div>
            </motion.div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-500/40 text-xs font-bold tracking-widest uppercase">
                <LayoutDashboard size={14} />
                <span>{t.admin.login.version}</span>
            </div>
        </div>
    );
}
