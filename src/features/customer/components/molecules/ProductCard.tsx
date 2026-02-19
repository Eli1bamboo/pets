"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { useTranslation } from "@/i18n/LanguageContext";
import { useCartContext } from "@/providers/CartProvider";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    delay?: number;
}

export function ProductCard({ product, delay = 0 }: ProductCardProps) {
    const { language } = useTranslation();
    const { addToCart, openCart } = useCartContext();
    const [adding, setAdding] = useState(false);

    const name = language === "en" && product.name_en ? product.name_en : product.name;
    const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
    const inStock = product.stock_quantity > 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!inStock || adding) return;
        setAdding(true);
        await addToCart(product.id, 1);
        setAdding(false);
        openCart();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay }}
        >
            <Link
                href={`/shop/${product.id}`}
                className="group flex flex-col rounded-3xl bg-white shadow-lg shadow-brand-900/5 border border-brand-100 overflow-hidden hover:shadow-xl hover:shadow-brand-900/10 transition-all duration-300 hover:-translate-y-1"
            >
                {/* Image */}
                <div className="relative aspect-square bg-brand-50 overflow-hidden">
                    {primaryImage ? (
                        <img
                            src={primaryImage.url}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-300">
                            <ShoppingBag size={48} strokeWidth={1} />
                        </div>
                    )}

                    {/* Quick add button */}
                    {inStock && (
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-brand-900 px-3.5 py-2 text-[11px] font-bold text-white shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-orange active:scale-95 disabled:opacity-50"
                        >
                            <ShoppingCart size={14} />
                            {adding ? "..." : "Agregar"}
                        </button>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.is_featured && (
                            <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                <Star size={10} fill="currentColor" /> Destacado
                            </span>
                        )}
                        {hasDiscount && (
                            <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                                -{Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)}%
                            </span>
                        )}
                    </div>

                    {/* Category badge */}
                    {product.category && (
                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-brand-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {language === "en" && product.category.name_en ? product.category.name_en : product.category.name}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="p-5">
                    <h3 className="text-base font-bold text-brand-900 line-clamp-2 group-hover:text-primary-orange transition-colors">
                        {name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-brand-900">
                            ${product.price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-brand-400 line-through">
                                ${product.compare_at_price!.toLocaleString()}
                            </span>
                        )}
                    </div>
                    {product.stock_quantity <= product.low_stock_threshold && product.stock_quantity > 0 && (
                        <p className="mt-2 text-xs font-bold text-amber-600">¡Últimas unidades!</p>
                    )}
                    {product.stock_quantity === 0 && (
                        <p className="mt-2 text-xs font-bold text-red-500">Agotado</p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
