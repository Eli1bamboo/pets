"use client";
import Link from "next/link";
import { Check, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
    title: string;
    price: string;
    features: string[];
    icon: LucideIcon;
    delay?: number;
}

export default function ServiceCard({ title, price, features, icon: Icon, delay = 0 }: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-brand-900/10 sm:p-10 hover:shadow-2xl transition-[box-shadow] duration-300"
        >
            <div>
                <div className="flex items-center gap-x-4">
                    <div className="bg-brand-100 p-3 rounded-2xl text-brand-600 transition-colors group-hover:bg-brand-200">
                        <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold leading-8 text-brand-900">{title}</h3>
                </div>
                <div className="mt-4 flex items-baseline gap-x-2">
                    <span className="text-4xl font-bold tracking-tight text-brand-900">${price}</span>
                    <span className="text-sm font-semibold leading-6 text-brand-500">/sesión</span>
                </div>
                <p className="mt-6 text-base leading-7 text-brand-700">
                    Ideal para mantener a tu mascota limpia y feliz.
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-brand-700">
                    {features.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                            <Check className="h-6 w-5 flex-none text-brand-500" aria-hidden="true" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>
            <Link
                href="/booking"
                className="mt-8 block rounded-full bg-brand-600 px-3.5 py-2.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all hover:scale-105 active:scale-95"
            >
                Reservar turno
            </Link>
        </motion.div>
    );
}

