"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, ShoppingCart, Star, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Product } from "@/types";
import { ProductCard } from "@/features/customer/components/molecules/ProductCard";
import { useTranslation } from "@/i18n/LanguageContext";
import { useCartContext } from "@/providers/CartProvider";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const { language } = useTranslation();
    const shop = ((useTranslation().t) as any).shop;

    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [supabase] = useState(() => createClient());
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const { addToCart, openCart } = useCartContext();

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { data, error } = await supabase
                .from("products")
                .select(`*, category:product_categories(*), images:product_images(*)`)
                .eq("id", Number(id))
                .single();

            if (!error && data) {
                setProduct(data);
                // Sort images: primary first
                const sorted = [...(data.images || [])].sort((a, b) => {
                    if (a.is_primary) return -1;
                    if (b.is_primary) return 1;
                    return a.sort_order - b.sort_order;
                });
                data.images = sorted;

                // Fetch related products (same category)
                if (data.category_id) {
                    const { data: rel } = await supabase
                        .from("products")
                        .select(`*, category:product_categories(*), images:product_images(*)`)
                        .eq("is_active", true)
                        .eq("category_id", data.category_id)
                        .neq("id", data.id)
                        .limit(4);
                    setRelated(rel || []);
                }
            }
            setLoading(false);
        }
        load();
    }, [id, supabase]);

    const name = product && (language === "en" && product.name_en ? product.name_en : product.name);
    const description = product && (language === "en" && product.description_en ? product.description_en : product.description);
    const hasDiscount = product?.compare_at_price && product.compare_at_price > product.price;
    const images = product?.images || [];

    const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

    if (loading) {
        return (
            <div className="bg-background-cream min-h-screen">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="aspect-square rounded-3xl bg-brand-100" />
                        <div className="space-y-6 py-8">
                            <div className="h-6 bg-brand-100 rounded-full w-1/3" />
                            <div className="h-10 bg-brand-100 rounded-full w-2/3" />
                            <div className="h-8 bg-brand-100 rounded-full w-1/4" />
                            <div className="space-y-3 mt-8">
                                <div className="h-4 bg-brand-100 rounded-full" />
                                <div className="h-4 bg-brand-100 rounded-full w-5/6" />
                                <div className="h-4 bg-brand-100 rounded-full w-4/6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="bg-background-cream min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-brand-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-900">{shop?.notFound ?? "Producto no encontrado"}</h2>
                    <Link href="/shop" className="mt-6 inline-block rounded-full bg-brand-900 px-7 py-3 text-sm font-bold text-white hover:bg-primary-orange transition-colors">
                        {shop?.backToShop ?? "Volver a la tienda"}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-cream min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 sm:py-12">
                {/* Back link */}
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-primary-orange transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    {shop?.backToShop ?? "Volver a la tienda"}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* ─── Image Gallery ─── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-brand-50 shadow-xl shadow-brand-900/5">
                            {images.length > 0 ? (
                                <>
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={activeImage}
                                            src={images[activeImage]?.url}
                                            alt={name || ""}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full object-contain p-4"
                                        />
                                    </AnimatePresence>

                                    {images.length > 1 && (
                                        <>
                                            <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all">
                                                <ChevronLeft size={20} className="text-brand-900" />
                                            </button>
                                            <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all">
                                                <ChevronRight size={20} className="text-brand-900" />
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-brand-300">
                                    <ShoppingBag size={64} strokeWidth={1} />
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto p-1">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-primary-orange scale-105" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* ─── Product Info ─── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col"
                    >
                        {/* Category */}
                        {product.category && (
                            <span className="inline-flex self-start items-center rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 mb-4">
                                {language === "en" && product.category.name_en ? product.category.name_en : product.category.name}
                            </span>
                        )}

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-900 tracking-tight">
                            {name}
                        </h1>

                        {/* Price */}
                        <div className="mt-4 flex items-baseline gap-3">
                            <span className="text-3xl font-extrabold text-brand-900">
                                ${product.price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-lg text-brand-400 line-through">
                                    ${product.compare_at_price!.toLocaleString()}
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
                                    -{Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        {/* Stock status */}
                        <div className="mt-4">
                            {product.stock_quantity > product.low_stock_threshold ? (
                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-600">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {shop?.inStock ?? "En stock"}
                                </span>
                            ) : product.stock_quantity > 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    {shop?.lowStock ?? "¡Últimas unidades!"}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-500">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />
                                    {shop?.outOfStock ?? "Agotado"}
                                </span>
                            )}
                        </div>

                        {/* Add to cart */}
                        {product.stock_quantity > 0 && (
                            <div className="mt-6 flex items-center gap-4">
                                <div className="inline-flex items-center rounded-2xl border border-brand-200 bg-white">
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-brand-600 hover:text-brand-900 transition-colors rounded-l-2xl hover:bg-brand-50"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center text-base font-extrabold text-brand-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                                        disabled={quantity >= product.stock_quantity}
                                        className="w-12 h-12 flex items-center justify-center text-brand-600 hover:text-brand-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-2xl hover:bg-brand-50"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={async () => {
                                        setAdding(true);
                                        await addToCart(product.id, quantity);
                                        setAdding(false);
                                        openCart();
                                    }}
                                    disabled={adding}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-brand-900 py-4 text-sm font-bold text-white hover:bg-primary-orange transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-brand-900/20"
                                >
                                    <ShoppingCart size={18} />
                                    {adding ? (shop?.adding ?? "Agregando...") : (shop?.addToCart ?? "Agregar al carrito")}
                                </button>
                            </div>
                        )}

                        {/* Description */}
                        {description && (
                            <div className="mt-8 border-t border-brand-100 pt-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-brand-500 mb-3">
                                    {shop?.descriptionLabel ?? "Descripción"}
                                </h3>
                                <p className="text-base leading-7 text-brand-700 whitespace-pre-line">
                                    {description}
                                </p>
                            </div>
                        )}

                        {/* Details */}
                        <div className="mt-8 border-t border-brand-100 pt-8 grid grid-cols-2 gap-4">
                            {product.sku && (
                                <div>
                                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">SKU</span>
                                    <p className="text-sm font-bold text-brand-900 mt-1">{product.sku}</p>
                                </div>
                            )}
                            {product.weight_grams && (
                                <div>
                                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{shop?.weight ?? "Peso"}</span>
                                    <p className="text-sm font-bold text-brand-900 mt-1">{product.weight_grams}g</p>
                                </div>
                            )}
                        </div>

                        {product.is_featured && (
                            <div className="mt-6 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                                <Star size={18} className="text-yellow-500" fill="currentColor" />
                                <span className="text-sm font-bold text-yellow-800">{shop?.featuredBadge ?? "Producto destacado"}</span>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ─── Related Products ─── */}
                {related.length > 0 && (
                    <div className="mt-20 border-t border-brand-100 pt-12">
                        <h2 className="text-2xl font-extrabold text-brand-900 mb-8">
                            {shop?.relatedTitle ?? "Productos relacionados"}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {related.map((p, i) => (
                                <ProductCard key={p.id} product={p} delay={i * 0.05} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
