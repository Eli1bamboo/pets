"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopProducts } from "@/features/customer/hooks/useShopProducts";
import { ProductCard } from "@/features/customer/components/molecules/ProductCard";
import { ShopHero } from "@/features/customer/components/organisms/ShopHero";
import { useTranslation } from "@/i18n/LanguageContext";

export default function ShopPage() {
    const { products, categories, loading } = useShopProducts();
    const { language } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    const filteredProducts = useMemo(() => {
        let result = products;

        if (selectedCategory) {
            result = result.filter((p) => p.category_id === selectedCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((p) => {
                const name = language === "en" && p.name_en ? p.name_en : p.name;
                const desc = language === "en" && p.description_en ? p.description_en : p.description || "";
                return name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
            });
        }

        return result;
    }, [products, selectedCategory, search, language]);

    const shop = (useTranslation().t as any).shop;

    return (
        <div className="bg-background-cream min-h-screen">
            <ShopHero />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
                {/* ─── Filter Bar ─── */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={shop?.searchPlaceholder ?? "Buscar productos..."}
                            className="w-full rounded-2xl border border-brand-200 bg-white pl-11 pr-10 py-3 text-sm font-medium text-brand-900 placeholder:text-brand-400 focus:border-primary-orange focus:ring-primary-orange/20 focus:ring-4 transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Category filters */}
                    <div className="flex items-center gap-2 overflow-x-auto py-4 -my-4 px-1 w-full sm:w-auto scrollbar-hide">
                        {loading ? (
                            <>
                                <div className="h-10 w-20 rounded-full bg-brand-200 animate-pulse" />
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-10 rounded-full bg-brand-100 animate-pulse" style={{ width: `${72 + i * 16}px` }} />
                                ))}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === null
                                        ? "bg-brand-900 text-white shadow-lg shadow-brand-900/20"
                                        : "bg-white text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50"
                                        }`}
                                >
                                    {shop?.allCategories ?? "Todos"}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                        className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat.id
                                            ? "bg-primary-orange text-white shadow-lg shadow-primary-orange/20"
                                            : "bg-white text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50"
                                            }`}
                                    >
                                        {language === "en" && cat.name_en ? cat.name_en : cat.name}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* ─── Results count ─── */}
                {!loading && (
                    <p className="text-sm font-medium text-brand-500 mb-6">
                        {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="ml-2 text-primary-orange hover:underline"
                            >
                                {shop?.clearFilter ?? "Limpiar filtro"}
                            </button>
                        )}
                    </p>
                )}

                {/* ─── Product Grid ─── */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-3xl bg-white shadow-sm ring-1 ring-brand-100 overflow-hidden animate-pulse">
                                <div className="aspect-square bg-brand-100" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-brand-100 rounded-full w-3/4" />
                                    <div className="h-5 bg-brand-100 rounded-full w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="mx-auto w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
                            <ShoppingBag size={32} className="text-brand-400" />
                        </div>
                        <h3 className="text-xl font-bold text-brand-900">
                            {shop?.emptyTitle ?? "No hay productos"}
                        </h3>
                        <p className="mt-2 text-brand-600">
                            {shop?.emptySubtitle ?? "No encontramos productos con esos filtros."}
                        </p>
                        {(search || selectedCategory) && (
                            <button
                                onClick={() => { setSearch(""); setSelectedCategory(null); }}
                                className="mt-6 rounded-full bg-brand-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary-orange transition-colors"
                            >
                                {shop?.clearAll ?? "Ver todos los productos"}
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product, i) => (
                                <ProductCard key={product.id} product={product} delay={i * 0.05} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
