"use client";
import Link from "next/link";
import { Check, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageContext";

interface ServiceCardProps {
    title: string;
    price: string;
    features: string[];
    icon: LucideIcon;
    delay?: number;
}

export function ServiceCard({ title, price, features, icon: Icon, delay = 0 }: ServiceCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="group flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-brand-900/5 sm:p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-b-8 border-transparent hover:border-primary-orange"
        >
            <div>
                <div className="flex items-center gap-x-4">
                    <div className="bg-soft-peach/30 p-4 rounded-2xl text-primary-orange transition-colors group-hover:bg-primary-orange group-hover:text-white">
                        <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold leading-8 text-brand-900">{title}</h3>
                </div>
                <div className="mt-6 flex items-baseline gap-x-2">
                    <span className="text-4xl font-extrabold tracking-tight text-brand-900">${price}</span>
                    <span className="text-sm font-semibold leading-6 text-brand-500">{t.services.perSession}</span>
                </div>
                <p className="mt-4 text-base leading-7 text-brand-700">
                    {t.services.cardDescription}
                </p>
                <ul role="list" className="mt-8 space-y-4 text-sm leading-6 text-brand-700">
                    {features.map((feature) => (
                        <li key={feature} className="flex gap-x-3 items-center">
                            <div className="rounded-full bg-secondary-teal/10 p-1">
                                <Check className="h-4 w-4 flex-none text-secondary-teal" aria-hidden="true" />
                            </div>
                            <span className="font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Link
                href="/booking"
                className="mt-10 block rounded-full bg-brand-900 px-6 py-3.5 text-center text-sm font-bold text-white shadow-sm hover:bg-primary-orange transition-all hover:scale-[1.02] active:scale-95"
            >
                {t.services.ctaBook}
            </Link>
        </motion.div>
    );
}

