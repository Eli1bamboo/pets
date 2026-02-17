"use client";
import Link from "next/link";
import { Check, LucideIcon, ArrowRight } from "lucide-react";
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
            className="group flex flex-col justify-between rounded-[2rem] bg-white p-8 shadow-xl shadow-brand-900/5 ring-1 ring-brand-900/5 sm:p-10 hover:shadow-2xl hover:shadow-brand-900/10 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-200 via-primary-orange to-brand-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div>
                <div className="flex items-center gap-x-4 mb-6">
                    <div className="bg-brand-50 p-3.5 rounded-2xl text-primary-orange transition-colors group-hover:bg-primary-orange group-hover:text-white shadow-sm ring-1 ring-brand-100">
                        <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold leading-8 text-brand-900">{title}</h3>
                </div>
                <div className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-4xl font-extrabold tracking-tight text-brand-900">${price}</span>
                    <span className="text-sm font-semibold leading-6 text-brand-500">{t.services.perSession}</span>
                </div>
                <p className="mt-4 text-base leading-7 text-brand-700">
                    {t.services.cardDescription}
                </p>
                <div className="my-8 h-px bg-brand-100" />
                <ul role="list" className="space-y-4 text-sm leading-6 text-brand-700">
                    {features.map((feature) => (
                        <li key={feature} className="flex gap-x-3 items-start">
                            <div className="rounded-full bg-green-100/50 p-1 mt-0.5">
                                <Check className="h-4 w-4 flex-none text-green-600" aria-hidden="true" />
                            </div>
                            <span className="font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Link
                href="/booking"
                className="mt-8 flex items-center justify-between w-full rounded-2xl bg-brand-50 px-6 py-4 text-center text-sm font-bold text-brand-900 shadow-sm hover:bg-brand-900 hover:text-white transition-all group-hover:scale-[1.02] active:scale-95 group/btn"
            >
                <span>{t.services.ctaBook}</span>
                <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
        </motion.div>
    );
}

