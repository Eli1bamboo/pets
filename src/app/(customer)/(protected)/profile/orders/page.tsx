"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ArrowLeft, ShoppingBag, ChevronDown, ChevronUp } from "lucide-react";
import { useOrders } from "@/features/customer/hooks/useOrders";
import { useTranslation } from "@/i18n/LanguageContext";
import { OrderStatus } from "@/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    paid: { label: "Pagado", color: "bg-green-100 text-green-800" },
    preparing: { label: "Preparando", color: "bg-blue-100 text-blue-800" },
    ready_for_pickup: { label: "Listo para retirar", color: "bg-purple-100 text-purple-800" },
    shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Entregado", color: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

export default function CustomerOrdersPage() {
    const { orders, loading } = useOrders();
    const ordersT = ((useTranslation().t) as any).orders;
    const [expandedId, setExpandedId] = useState<number | null>(null);

    return (
        <div className="bg-background-cream min-h-screen">
            <div className="mx-auto max-w-3xl px-6 lg:px-8 py-8 sm:py-12">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-primary-orange transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    {ordersT?.backToProfile ?? "Mi Perfil"}
                </Link>

                <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">
                    {ordersT?.title ?? "Mis Pedidos"}
                </h1>
                <p className="mt-2 text-base text-brand-500">
                    {ordersT?.subtitle ?? "Historial de tus compras"}
                </p>

                <div className="mt-8 space-y-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-2xl bg-white border border-brand-100 p-6 animate-pulse">
                                <div className="flex justify-between">
                                    <div className="h-5 bg-brand-100 rounded-full w-1/4" />
                                    <div className="h-5 bg-brand-100 rounded-full w-1/6" />
                                </div>
                                <div className="mt-4 h-4 bg-brand-100 rounded-full w-1/3" />
                            </div>
                        ))
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
                                <ShoppingBag size={32} className="text-brand-300" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-900">
                                {ordersT?.emptyTitle ?? "No tenés pedidos todavía"}
                            </h3>
                            <p className="mt-2 text-sm text-brand-500">
                                {ordersT?.emptySubtitle ?? "Tus compras aparecerán acá."}
                            </p>
                            <Link
                                href="/shop"
                                className="mt-6 rounded-full bg-brand-900 px-7 py-3 text-sm font-bold text-white hover:bg-primary-orange transition-colors"
                            >
                                {ordersT?.goToShop ?? "Ir a la tienda"}
                            </Link>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {orders.map((order, i) => {
                                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                const isExpanded = expandedId === order.id;
                                const date = new Date(order.created_at).toLocaleDateString("es-AR", {
                                    day: "numeric", month: "short", year: "numeric",
                                });

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="rounded-2xl bg-white border border-brand-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                            className="w-full flex items-center justify-between p-5 text-left"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                                                    <Package size={18} className="text-brand-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-brand-900">
                                                        {ordersT?.orderLabel ?? "Pedido"} #{order.id}
                                                    </p>
                                                    <p className="text-xs text-brand-400 mt-0.5">{date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusCfg.color}`}>
                                                        📦 {statusCfg.label}
                                                    </span>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                order.payment_status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                                                                    order.payment_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                        'bg-red-50 text-red-700'
                                                        }`}>
                                                        💳 {
                                                            order.payment_status === 'paid' ? 'Pagado' :
                                                                order.payment_status === 'pending' ? 'Pago Pendiente' :
                                                                    order.payment_status === 'refunded' ? 'Reembolsado' :
                                                                        order.payment_status === 'cancelled' ? 'Cancelado' :
                                                                            'No Pagado'
                                                        }
                                                    </span>
                                                </div>
                                                <span className="text-sm font-extrabold text-brand-900 ml-2">
                                                    ${order.total.toLocaleString()}
                                                </span>
                                                {isExpanded ? (
                                                    <ChevronUp size={16} className="text-brand-400 ml-1" />
                                                ) : (
                                                    <ChevronDown size={16} className="text-brand-400 ml-1" />
                                                )}
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-t border-brand-100"
                                                >
                                                    <div className="p-5 space-y-3">
                                                        {order.items?.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                                <span className="text-brand-700">
                                                                    {item.product_name} <span className="text-brand-400">x{item.quantity}</span>
                                                                </span>
                                                                <span className="font-bold text-brand-900">
                                                                    ${item.subtotal.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        <div className="border-t border-brand-100 pt-3 flex justify-between">
                                                            <span className="text-sm font-bold text-brand-500">Total</span>
                                                            <span className="text-base font-extrabold text-brand-900">
                                                                ${order.total.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {order.notes && (
                                                            <p className="text-xs text-brand-400 italic mt-2">
                                                                {ordersT?.notesLabel ?? "Nota"}: {order.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
