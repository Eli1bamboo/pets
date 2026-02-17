"use client";

import { useState, useMemo, useEffect } from "react";
import { Appointment } from "@/types";
import { AppointmentCard } from "@/features/customer/components/molecules/AppointmentCard";
import { CalendarSearch, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/LanguageContext";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/features/customer/components/atoms/Button";

interface AppointmentTabsProps {
    appointments: Appointment[];
    onCancel: (apt: Appointment) => void;
}

export function AppointmentTabs({ appointments, onCancel }: AppointmentTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();

    // Initialize from URL or default to 'upcoming'
    const initialTab = searchParams.get('tab') === 'history' ? 'history' : 'upcoming';
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>(initialTab);
    const [visibleHistoryCount, setVisibleHistoryCount] = useState(4);

    // Sync state if URL changes externally (e.g. back button)
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') === 'history' ? 'history' : 'upcoming';
        setActiveTab(tabFromUrl);
    }, [searchParams]);

    const handleTabChange = (tab: 'upcoming' | 'history') => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams);
        if (tab === 'history') {
            params.set('tab', 'history');
        } else {
            params.delete('tab');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Reset dates at midnight for comparison
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const upcoming = useMemo(() => appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && apt.status !== 'cancelled' && apt.status !== 'completed';
    }), [appointments, today]);

    const history = useMemo(() => appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate < today || apt.status === 'cancelled' || apt.status === 'completed';
    }), [appointments, today]);

    const displayedAppointments = useMemo(() => {
        return activeTab === 'upcoming'
            ? upcoming
            : history.slice(0, visibleHistoryCount);
    }, [activeTab, upcoming, history, visibleHistoryCount]);

    const handleLoadMore = () => {
        setVisibleHistoryCount(prev => Math.min(prev + 4, history.length));
    };

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex justify-center">
                <div className="bg-white p-1.5 rounded-full shadow-sm ring-1 ring-brand-100 inline-flex">
                    <button
                        onClick={() => handleTabChange('upcoming')}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${activeTab === 'upcoming'
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'text-brand-500 hover:bg-brand-50'
                            }`}
                    >
                        {t.profile.tabs?.upcoming || "Próximos Turnos"}
                    </button>
                    <button
                        onClick={() => handleTabChange('history')}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${activeTab === 'history'
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'text-brand-500 hover:bg-brand-50'
                            }`}
                    >
                        {t.profile.tabs?.history || "Historial"}
                    </button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {displayedAppointments.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm ring-1 ring-brand-100/50">
                            <div className="mx-auto h-16 w-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
                                <CalendarSearch className="h-8 w-8 text-brand-300" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-900 mb-2">
                                {activeTab === 'upcoming' ? t.profile.emptyTitle : t.profile.emptyHistoryTitle}
                            </h3>
                            <p className="text-brand-500 max-w-xs mx-auto mb-8">
                                {activeTab === 'upcoming'
                                    ? t.profile.emptySubtitle
                                    : t.profile.emptyHistorySubtitle}
                            </p>

                            {activeTab === 'upcoming' && (
                                <div className="mt-6 flex justify-center w-full">
                                    <Link href="/booking" className="inline-block relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-300 to-brand-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                        <Button
                                            size="lg"
                                            className="relative gap-2 px-8 py-4 text-base shadow-xl shadow-brand-200 hover:shadow-2xl hover:shadow-brand-300 transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                                        >
                                            <CalendarSearch className="w-5 h-5" />
                                            {t.hero.ctaBooking}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {displayedAppointments.map((apt) => (
                                    <AppointmentCard
                                        key={apt.id}
                                        appointment={apt}
                                        onCancel={onCancel}
                                    />
                                ))}
                            </div>

                            {/* Load More Button */}
                            {activeTab === 'history' && visibleHistoryCount < history.length && (
                                <div className="flex justify-center pt-8 pb-4">
                                    <Button
                                        onClick={handleLoadMore}
                                        variant="secondary"
                                        className="group min-w-[200px] font-bold gap-2 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        Ver más turnos
                                        <ChevronDown size={20} className="transition-transform duration-300 group-hover:translate-y-1" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
