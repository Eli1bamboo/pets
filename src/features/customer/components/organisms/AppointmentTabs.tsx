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

// ... imports

export function AppointmentTabs({ appointments, onCancel }: AppointmentTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();

    // Initialize from URL
    const tabParam = searchParams.get('tab');
    const initialTab = (tabParam === 'history' || tabParam === 'current') ? tabParam : 'upcoming';
    const [activeTab, setActiveTab] = useState<'upcoming' | 'current' | 'history'>(initialTab);
    const [visibleHistoryCount, setVisibleHistoryCount] = useState(4);

    // Sync state if URL changes externally
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        const newTab = (tabFromUrl === 'history' || tabFromUrl === 'current') ? tabFromUrl : 'upcoming';
        setActiveTab(newTab);
    }, [searchParams]);

    const handleTabChange = (tab: 'upcoming' | 'current' | 'history') => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams);
        if (tab === 'upcoming') {
            params.delete('tab');
        } else {
            params.set('tab', tab);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleTrack = (apt: Appointment) => {
        router.push(`/tracking?id=${apt.id}`);
    };

    // Reset dates at midnight for comparison
    const now = new Date();
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const isActive = (apt: Appointment) => {
        const aptDate = new Date(apt.date);
        const isToday = aptDate.getDate() === now.getDate() && aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear();

        // 1. Must be TODAY to be "In Progress" (filters out stale data from history)
        if (!isToday) return false;

        const timeDiff = now.getTime() - aptDate.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        // Status-based active (washing/drying/ready)
        if (['washing', 'drying', 'ready'].includes(apt.status)) return true;

        // Time-based active (if pending)
        if (apt.status === 'pending') {
            // -0.25 < hoursDiff < 2
            return hoursDiff >= -0.25 && hoursDiff <= 2;
        }
        return false;
    };

    const upcoming = useMemo(() => appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        // Exclude those captured by "current"
        return !isActive(apt) && apt.status === 'pending' && aptDate >= new Date(Date.now() - 2 * 60 * 60 * 1000); // Rough check to keep recent pending in history? No.
    }).filter(apt => apt.status === 'pending' && new Date(apt.date) >= today) // Re-apply strict upcoming
        .filter(apt => !isActive(apt)) // Ensure disjoint interaction
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [appointments, today, now]);

    const current = useMemo(() => appointments.filter(isActive)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [appointments, now]); // Remount on 'now' change isn't automatic, but good enough for static render.

    const history = useMemo(() => appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return apt.status === 'completed' || apt.status === 'cancelled' || (aptDate < today && apt.status === 'pending' && !isActive(apt));
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [appointments, today, now]);

    const displayedAppointments = useMemo(() => {
        switch (activeTab) {
            case 'upcoming': return upcoming;
            case 'current': return current;
            case 'history': return history.slice(0, visibleHistoryCount);
            default: return upcoming;
        }
    }, [activeTab, upcoming, current, history, visibleHistoryCount]);

    const handleLoadMore = () => {
        setVisibleHistoryCount(prev => Math.min(prev + 4, history.length));
    };

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <div className="flex justify-center w-full overflow-x-auto">
                <div className="bg-white p-1.5 rounded-full shadow-sm ring-1 ring-brand-100 inline-flex flex-nowrap min-w-max">
                    <button
                        onClick={() => handleTabChange('upcoming')}
                        className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${activeTab === 'upcoming'
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'text-brand-500 hover:bg-brand-50'
                            }`}
                    >
                        {t.profile.tabs?.upcoming || "Próximos"}
                    </button>
                    <button
                        onClick={() => handleTabChange('current')}
                        className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${activeTab === 'current'
                            ? 'bg-brand-500 text-white shadow-md'
                            : 'text-brand-500 hover:bg-brand-50'
                            }`}
                    >
                        En Curso
                    </button>
                    <button
                        onClick={() => handleTabChange('history')}
                        className={`px-4 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap ${activeTab === 'history'
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
                                {activeTab === 'upcoming' ? t.profile.emptyTitle : activeTab === 'current' ? "No tenés servicios activos en este momento." : t.profile.emptyHistoryTitle}
                            </h3>
                            <p className="text-brand-500 max-w-xs mx-auto mb-8">
                                {activeTab === 'upcoming'
                                    ? t.profile.emptySubtitle
                                    : activeTab === 'current'
                                        ? "Tus mascotas no se están bañando en este momento."
                                        : t.profile.emptyHistorySubtitle}
                            </p>

                            {(activeTab === 'upcoming' || activeTab === 'current') && (
                                <div className="mt-6 flex justify-center w-full">
                                    {activeTab === 'upcoming' ? (
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
                                    ) : (
                                        <Button
                                            onClick={() => handleTabChange('upcoming')}
                                            variant="secondary"
                                            className="gap-2 px-8 py-3 font-bold rounded-full shadow-sm hover:shadow-md transition-all"
                                        >
                                            Ver Próximos
                                        </Button>
                                    )}
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
                                        onTrack={activeTab === 'current' ? handleTrack : undefined}
                                        disableCancel={activeTab === 'current'}
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
