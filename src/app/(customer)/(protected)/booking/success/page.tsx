"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Calendar, ArrowRight, Home } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function BookingSuccessPage() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("appointment_id");
    const isPending = searchParams.get("pending") === "true";
    const { t } = useTranslation();
    const bk = (t as any).bookingPayment;

    return (
        <div className="bg-background-cream min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                    className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ${isPending ? "bg-amber-100" : "bg-green-100"
                        }`}
                >
                    {isPending ? (
                        <Clock size={40} className="text-amber-500" />
                    ) : (
                        <CheckCircle size={40} className="text-green-500" />
                    )}
                </motion.div>

                <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">
                    {isPending
                        ? (bk?.pendingTitle ?? "Pago en proceso")
                        : (bk?.successTitle ?? "¡Turno confirmado!")}
                </h1>

                <p className="mt-4 text-base text-brand-500 leading-relaxed">
                    {isPending
                        ? (bk?.pendingSubtitle ?? "Tu pago está siendo procesado. Te notificaremos cuando se confirme.")
                        : (bk?.successSubtitle ?? "Tu pago fue aprobado y tu turno está reservado. ¡Te esperamos!")}
                </p>

                {appointmentId && (
                    <div className="mt-8 inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-2xl px-5 py-3">
                        <Calendar size={16} className="text-brand-500" />
                        <span className="text-sm font-bold text-brand-700">
                            {bk?.appointmentNumber ?? "Turno"} #{appointmentId}
                        </span>
                    </div>
                )}

                <div className="mt-10 flex flex-col gap-3">
                    <Link
                        href="/tracking"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 text-sm font-bold text-white hover:bg-primary-orange transition-colors shadow-lg shadow-brand-900/20"
                    >
                        {bk?.trackAppointment ?? "Seguir mi turno"}
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-700 transition-colors"
                    >
                        <Home size={16} />
                        {bk?.goHome ?? "Volver al inicio"}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
