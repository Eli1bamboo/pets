import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageContext";

export function HomeHero() {
    const { t } = useTranslation();

    return (
        <div className="relative isolate overflow-hidden bg-background-cream pt-14">
            <div className="mx-auto max-w-7xl px-6 py-12 sm:py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <span className="rounded-full bg-primary-orange/20 px-4 py-1.5 text-sm font-semibold leading-6 text-primary-orange ring-1 ring-inset ring-primary-orange/20">
                            {t.hero.badge}
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl font-bold tracking-tight text-brand-900 sm:text-7xl leading-[1.1]"
                    >
                        {t.hero.title} <span className="text-primary-orange">{t.hero.titleHighlight}</span> {t.hero.titleEnd}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-xl leading-8 text-brand-700 max-w-lg"
                    >
                        {t.hero.subtitle}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex flex-wrap items-center gap-6"
                    >
                        <Link
                            href="/booking"
                            className="rounded-full bg-primary-orange px-10 py-4 text-lg font-bold text-white shadow-lg hover:bg-soft-peach hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <CalendarCheck size={22} />
                            {t.hero.ctaBooking}
                        </Link>
                        <Link href="/tracking" className="text-lg font-semibold leading-6 text-brand-900 flex items-center gap-2 hover:text-primary-orange transition-colors">
                            <Search size={22} />
                            {t.hero.ctaTracking}
                        </Link>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                    className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow relative"
                >
                    <div className="relative w-full aspect-square max-w-[500px] mx-auto overflow-hidden rounded-3xl bg-soft-peach/30 shadow-2xl ring-1 ring-brand-900/5">
                        <Image
                            src="/hero-dog.png"
                            alt="Mascota feliz"
                            fill
                            className="object-cover object-bottom"
                            priority
                        />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-teal/20 rounded-full blur-3xl -z-10" />
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-orange/20 rounded-full blur-3xl -z-10" />
                </motion.div>
            </div>
        </div>
    );
}
