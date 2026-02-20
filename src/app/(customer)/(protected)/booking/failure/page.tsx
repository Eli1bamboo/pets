"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function BookingFailurePage() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("appointment_id");
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
                    className="mx-auto w-24 h-24 rounded-3xl bg-red-100 flex items-center justify-center mb-8"
                >
                    <XCircle size={40} className="text-red-500" />
                </motion.div>

                <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">
                    {bk?.failureTitle ?? "El pago no se completó"}
                </h1>

                <p className="mt-4 text-base text-brand-500 leading-relaxed">
                    {bk?.failureSubtitle ?? "Hubo un problema con el pago de tu turno. Tu reserva sigue activa, podés intentar pagar de nuevo."}
                </p>

                <div className="mt-10 flex flex-col gap-3">
                    <Link
                        href="/booking"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 text-sm font-bold text-white hover:bg-primary-orange transition-colors shadow-lg shadow-brand-900/20"
                    >
                        <RefreshCw size={16} />
                        {bk?.retry ?? "Intentar de nuevo"}
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {bk?.goHome ?? "Volver al inicio"}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
