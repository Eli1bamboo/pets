"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export default function CheckoutFailurePage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const checkout = ((useTranslation().t) as any).checkout;

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
                    {checkout?.failureTitle ?? "El pago no se completó"}
                </h1>

                <p className="mt-4 text-base text-brand-500 leading-relaxed">
                    {checkout?.failureSubtitle ?? "Hubo un problema con tu pago. Podés intentar de nuevo o volver a la tienda."}
                </p>

                <div className="mt-10 flex flex-col gap-3">
                    <Link
                        href="/checkout"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 text-sm font-bold text-white hover:bg-primary-orange transition-colors shadow-lg shadow-brand-900/20"
                    >
                        <RefreshCw size={16} />
                        {checkout?.retry ?? "Intentar de nuevo"}
                    </Link>
                    <Link
                        href="/shop"
                        className="flex items-center justify-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-700 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {checkout?.backToShop ?? "Volver a la tienda"}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
