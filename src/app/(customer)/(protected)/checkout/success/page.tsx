"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, Clock, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useCartContext } from "@/providers/CartProvider";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const isPending = searchParams.get("pending") === "true";
    const checkout = ((useTranslation().t) as any).checkout;
    const { refetch } = useCartContext();

    // Refresh cart to reflect cleared state
    useEffect(() => {
        refetch();
    }, [refetch]);

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
                    className="mx-auto w-24 h-24 rounded-3xl bg-green-100 flex items-center justify-center mb-8"
                >
                    {isPending ? (
                        <Clock size={40} className="text-amber-500" />
                    ) : (
                        <CheckCircle size={40} className="text-green-500" />
                    )}
                </motion.div>

                <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">
                    {isPending
                        ? (checkout?.pendingTitle ?? "Pago en proceso")
                        : (checkout?.successTitle ?? "¡Pedido confirmado!")}
                </h1>

                <p className="mt-4 text-base text-brand-500 leading-relaxed">
                    {isPending
                        ? (checkout?.pendingSubtitle ?? "Tu pago está siendo procesado. Te notificaremos cuando se confirme.")
                        : (checkout?.successSubtitle ?? "Tu pago fue aprobado. Preparamos tu pedido para que lo retires.")}
                </p>

                {orderId && (
                    <div className="mt-8 inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-2xl px-5 py-3">
                        <Package size={16} className="text-brand-500" />
                        <span className="text-sm font-bold text-brand-700">
                            {checkout?.orderNumber ?? "Pedido"} #{orderId}
                        </span>
                    </div>
                )}

                <div className="mt-10 flex flex-col gap-3">
                    <Link
                        href="/profile/orders"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 text-sm font-bold text-white hover:bg-primary-orange transition-colors shadow-lg shadow-brand-900/20"
                    >
                        {checkout?.viewOrders ?? "Ver mis pedidos"}
                        <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/shop"
                        className="text-sm font-bold text-brand-500 hover:text-brand-700 transition-colors"
                    >
                        {checkout?.continueShopping ?? "Seguir comprando"}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
