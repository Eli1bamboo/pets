import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageContext";
import { Button } from "../atoms/Button";
import { useNextAppointmentSlot } from "@/features/customer/hooks/useNextAppointmentSlot";

export function HomeHero() {
    const { t, language } = useTranslation();
    const { nextSlot, loading } = useNextAppointmentSlot();

    const getNextSlotText = () => {
        if (!nextSlot) return t.hero.nextAppointment.unavailable;

        const slotDate = new Date(nextSlot.date + 'T12:00:00');
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        if (nextSlot.date === todayStr) {
            return `${t.hero.nextAppointment.availableToday} ${nextSlot.time}hs`;
        } else if (nextSlot.date === tomorrowStr) {
            return `${t.hero.nextAppointment.availableTomorrow} ${nextSlot.time}hs`;
        } else {
            const formatter = new Intl.DateTimeFormat(language === 'es' ? 'es-AR' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return `${t.hero.nextAppointment.availableOn} ${formatter.format(slotDate)} ${nextSlot.time}hs`;
        }
    };

    return (
        <section className="relative overflow-hidden bg-background-cream pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-200/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-orange/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/50 text-brand-800 text-sm font-semibold mb-6 ring-1 ring-brand-200"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-primary-orange"></span>
                            {t.hero.badge}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-900 leading-[1.1] mb-6"
                        >
                            {t.hero.title} <span className="text-primary-orange relative inline-block">
                                {t.hero.titleHighlight}
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                                </svg>
                            </span> {t.hero.titleEnd}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg sm:text-xl text-brand-700 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
                        >
                            {t.hero.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Link href="/booking" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-xl shadow-brand-500/20">
                                    <CalendarCheck className="mr-2 h-5 w-5" />
                                    {t.hero.ctaBooking}
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2 text-brand-600 font-medium px-4">
                                <ShieldCheck className="h-5 w-5 text-secondary-teal" />
                                <span className="text-sm">Profesionales verificados</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-brand-500 font-medium"
                        >
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full bg-brand-200" />
                                        {/* Placeholder for avatars, in real app use Image */}
                                    </div>
                                ))}
                            </div>
                            <p>+500 mascotas felices</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative mx-auto w-full max-w-[500px] lg:max-w-none"
                    >
                        <div className="aspect-square relative rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-brand-900/10 bg-white">
                            <Image
                                src="/hero-dog.png"
                                alt="Perro feliz en la peluquería"
                                fill
                                className="object-cover object-center"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* Floating Badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-brand-100 flex items-center gap-4"
                            >
                                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <CalendarCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">{t.hero.nextAppointment.title}</p>
                                    <div className="text-brand-900 font-bold min-h-[24px] flex items-center">
                                        {loading ? (
                                            <span className="inline-block h-5 w-32 animate-pulse bg-brand-100 rounded"></span>
                                        ) : (
                                            getNextSlotText()
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-teal/10 rounded-full blur-2xl -z-10" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-orange/10 rounded-full blur-2xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
