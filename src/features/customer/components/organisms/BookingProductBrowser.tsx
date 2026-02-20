"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ShoppingBag, ShoppingCart, Package } from "lucide-react";
import { useShopProducts } from "@/features/customer/hooks/useShopProducts";
import { useCartContext } from "@/providers/CartProvider";
import { useTranslation } from "@/i18n/LanguageContext";
import { Product } from "@/types";

function MiniProductCard({ product }: { product: Product }) {
    const { language } = useTranslation();
    const { addToCart } = useCartContext();
    const [adding, setAdding] = useState(false);

    const name = language === "en" && product.name_en ? product.name_en : product.name;
    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
    const inStock = product.stock_quantity > 0;

    const handleAdd = async () => {
        if (!inStock || adding) return;
        setAdding(true);
        await addToCart(product.id, 1);
        setAdding(false);
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-brand-100 hover:border-brand-300 transition-all group">
            {/* Image */}
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0">
                {primaryImage ? (
                    <img src={primaryImage.url} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-300">
                        <ShoppingBag size={16} strokeWidth={1} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-900 line-clamp-1">{name}</p>
                <p className="text-xs font-extrabold text-brand-600 mt-0.5">${product.price.toLocaleString()}</p>
            </div>

            {/* Add */}
            <button
                onClick={handleAdd}
                disabled={!inStock || adding}
                className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-900 text-white text-[11px] font-bold hover:bg-primary-orange transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ShoppingCart size={12} />
                {adding ? "..." : !inStock ? "Agotado" : "Agregar"}
            </button>
        </div>
    );
}

export function BookingProductBrowser() {
    const { products, categories, loading } = useShopProducts();
    const { cartCount } = useCartContext();
    const { t, language } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const bookingProducts = (t as any).bookingProducts;

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

    if (loading || products.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-br from-brand-50 to-orange-50/30 border border-brand-200 overflow-hidden"
        >
            {/* Toggle header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-brand-100/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-orange/10 flex items-center justify-center">
                        <Package size={20} className="text-primary-orange" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-brand-900">
                            {bookingProducts?.title ?? "Agregá productos a tu servicio"}
                        </p>
                        <p className="text-xs text-brand-500 mt-0.5">
                            {bookingProducts?.subtitle ?? "Retiralos cuando busques a tu mascota"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {cartCount > 0 && (
                        <span className="flex items-center gap-1 bg-primary-orange text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            <ShoppingCart size={10} /> {cartCount}
                        </span>
                    )}
                    {isOpen ? (
                        <ChevronUp size={18} className="text-brand-400" />
                    ) : (
                        <ChevronDown size={18} className="text-brand-400" />
                    )}
                </div>
            </button>

            {/* Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5">
                            {/* Category pills */}
                            {categories.length > 1 && (
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${!selectedCategory
                                            ? "bg-brand-900 text-white"
                                            : "bg-white text-brand-600 border border-brand-200 hover:border-brand-400"
                                            }`}
                                    >
                                        {bookingProducts?.allCategories ?? "Todos"}
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat.id
                                                ? "bg-brand-900 text-white"
                                                : "bg-white text-brand-600 border border-brand-200 hover:border-brand-400"
                                                }`}
                                        >
                                            {language === "en" && cat.name_en ? cat.name_en : cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Product grid */}
                            <div className="grid grid-cols-1 gap-2 max-h-[320px] overflow-y-auto pr-1">
                                {filteredProducts.map(product => (
                                    <MiniProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <p className="text-center text-sm text-brand-400 py-6">
                                    {bookingProducts?.noProducts ?? "No hay productos en esta categoría"}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
