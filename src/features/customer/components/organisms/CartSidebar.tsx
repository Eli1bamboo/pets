"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartContext } from "@/providers/CartProvider";
import { useTranslation } from "@/i18n/LanguageContext";

export function CartSidebar() {
    const { items, loading, cartCount, cartTotal, isCartOpen, closeCart, updateQuantity, removeItem } = useCartContext();
    const { language } = useTranslation();
    const cart = ((useTranslation().t) as any).cart;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-brand-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-900 rounded-xl flex items-center justify-center">
                                    <ShoppingBag size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-brand-900">
                                        {cart?.title ?? "Tu Carrito"}
                                    </h2>
                                    <p className="text-xs font-medium text-brand-500">
                                        {cartCount} {cartCount === 1
                                            ? (cart?.itemSingular ?? "producto")
                                            : (cart?.itemPlural ?? "productos")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeCart}
                                className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex gap-4 animate-pulse">
                                            <div className="w-20 h-20 rounded-2xl bg-brand-100 flex-shrink-0" />
                                            <div className="flex-1 space-y-2 py-1">
                                                <div className="h-4 bg-brand-100 rounded-full w-3/4" />
                                                <div className="h-4 bg-brand-100 rounded-full w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mb-6">
                                        <ShoppingBag size={32} className="text-brand-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-900">
                                        {cart?.emptyTitle ?? "Tu carrito está vacío"}
                                    </h3>
                                    <p className="mt-2 text-sm text-brand-500">
                                        {cart?.emptySubtitle ?? "Explorá nuestra tienda y encontrá productos para tu mascota."}
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={closeCart}
                                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary-orange transition-colors"
                                    >
                                        {cart?.goToShop ?? "Ir a la tienda"}
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {items.map((item) => {
                                            const product = item.product;
                                            if (!product) return null;
                                            const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
                                            const name = language === "en" && product.name_en ? product.name_en : product.name;

                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: 50 }}
                                                    className="flex gap-4 p-3 rounded-2xl bg-brand-50/50 hover:bg-brand-50 transition-colors"
                                                >
                                                    {/* Image */}
                                                    <Link
                                                        href={`/shop/${product.id}`}
                                                        onClick={closeCart}
                                                        className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-brand-100"
                                                    >
                                                        {primaryImage ? (
                                                            <img
                                                                src={primaryImage.url}
                                                                alt={name}
                                                                className="w-full h-full object-contain p-1"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-brand-300">
                                                                <ShoppingBag size={24} strokeWidth={1} />
                                                            </div>
                                                        )}
                                                    </Link>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={`/shop/${product.id}`}
                                                            onClick={closeCart}
                                                            className="text-sm font-bold text-brand-900 line-clamp-2 hover:text-primary-orange transition-colors"
                                                        >
                                                            {name}
                                                        </Link>
                                                        <p className="mt-1 text-sm font-extrabold text-brand-900">
                                                            ${(product.price * item.quantity).toLocaleString()}
                                                        </p>

                                                        {/* Quantity + Remove */}
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="inline-flex items-center rounded-lg border border-brand-200 bg-white">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="w-8 h-8 flex items-center justify-center text-brand-600 hover:text-brand-900 transition-colors"
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span className="w-8 text-center text-sm font-bold text-brand-900">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    disabled={item.quantity >= product.stock_quantity}
                                                                    className="w-8 h-8 flex items-center justify-center text-brand-600 hover:text-brand-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-lg text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-brand-100 bg-brand-50/30">
                                {/* Subtotal */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-brand-600">
                                        {cart?.subtotal ?? "Subtotal"}
                                    </span>
                                    <span className="text-xl font-extrabold text-brand-900">
                                        ${cartTotal.toLocaleString()}
                                    </span>
                                </div>

                                {/* Checkout button */}
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="flex items-center justify-center gap-2 w-full rounded-2xl bg-brand-900 py-4 text-sm font-bold text-white hover:bg-primary-orange transition-colors shadow-lg shadow-brand-900/20"
                                >
                                    {cart?.checkout ?? "Ir a pagar"}
                                    <ArrowRight size={16} />
                                </Link>

                                {/* Continue shopping */}
                                <button
                                    onClick={closeCart}
                                    className="w-full mt-3 text-center text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors"
                                >
                                    {cart?.continueShopping ?? "Seguir comprando"}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
