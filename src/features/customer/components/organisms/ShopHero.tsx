"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";

export function ShopHero() {
    const { t } = useTranslation();
    const shop = (t as any).shop;

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100/50 py-20 sm:py-28">
            {/* Decorative blobs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-orange/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-orange/10 px-5 py-2 text-sm font-bold text-primary-orange ring-1 ring-primary-orange/20">
                        <Sparkles size={16} />
                        {shop?.badge ?? "Productos para tu mascota"}
                    </span>
                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl lg:text-6xl">
                        {shop?.title ?? "Nuestra"}{" "}
                        <span className="text-primary-orange">{shop?.titleHighlight ?? "Tienda"}</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-brand-700">
                        {shop?.subtitle ?? "Encontrá los mejores productos para el cuidado de tu mejor amigo. Shampoos, accesorios, snacks y más."}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
