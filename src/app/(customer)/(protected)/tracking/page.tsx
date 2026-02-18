"use client";

import { useState, useEffect } from "react";
import { StatusTracker } from "@/features/customer/components/organisms/StatusTracker";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/features/customer/components/atoms/Button";
import { Input } from "@/features/customer/components/atoms/Input";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAppointmentStatus } from "@/features/customer/hooks/useAppointmentStatus";
import { useSearchParams } from "next/navigation";


export default function TrackingPage() {
    const searchParams = useSearchParams();
    const initialId = searchParams.get("id");
    const [inputId, setInputId] = useState(initialId || "");
    const [appointmentId, setAppointmentId] = useState<string | null>(initialId);
    const { t } = useTranslation();
    const { appointment, status, loading, error } = useAppointmentStatus(appointmentId || "");

    useEffect(() => {
        const idFromUrl = searchParams.get("id");
        if (idFromUrl && idFromUrl !== appointmentId) {
            setAppointmentId(idFromUrl);
            setInputId(idFromUrl);
        }
    }, [searchParams, appointmentId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputId.trim()) {
            setAppointmentId(inputId);
        }
    };

    // Determine the current image based on status, default to 'pending' if no appointment or 'pending'
    const currentImage = appointment?.status
        ? `/images/tracking/${appointment.status}.png`
        : "/images/tracking/pending.png"; // Default image

    return (
        <div className="min-h-screen bg-background-cream px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

            <div className="w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <span className="text-primary-orange font-bold uppercase tracking-wider text-xs sm:text-sm">{t.tracking.badge}</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-brand-900 leading-tight">
                        {t.tracking.title}
                    </h2>
                    <p className="mt-2 text-lg text-brand-600 font-medium">
                        {t.tracking.subtitle}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-xl shadow-brand-900/5 ring-1 ring-brand-900/5 mb-10">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-auto">
                            <Input
                                id="appointment-id"
                                name="id"
                                type="number"
                                required
                                placeholder={t.tracking.placeholder}
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                leftIcon={Search}
                                className="border-0 shadow-none focus:ring-0 bg-transparent text-lg h-12 sm:h-14"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="sm:w-32 h-12 sm:h-14 rounded-xl shadow-lg shadow-brand-500/20"
                        >
                            {t.tracking.search}
                        </Button>
                    </form>
                </div>

                {/* Content Area */}
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin text-brand-500 w-12 h-12" />
                        </div>
                    ) : error ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
                        >
                            <p className="text-red-600 font-bold text-lg mb-1">⚠️ {error}</p>
                            <p className="text-red-400">Por favor verificá el número de orden.</p>
                        </motion.div>
                    ) : appointment ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-8"
                        >
                            {/* Premium Status Card */}
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-brand-900/10 ring-1 ring-brand-900/5 border border-white/50 backdrop-blur-sm relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8 pb-6 border-b border-gray-100">
                                    {/* Left: Circular Status Image */}
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden bg-brand-50 border-4 border-white shadow-lg ring-1 ring-brand-100 shrink-0">
                                        <img
                                            src={currentImage}
                                            alt={appointment.status}
                                            className="w-full h-full object-cover scale-110"
                                        />
                                    </div>

                                    {/* Right: Info */}
                                    <div className="flex-1 text-center sm:text-left pt-4">
                                        <h3 className="text-4xl font-black text-brand-900 leading-none mb-2">
                                            {appointment.pet_name}
                                        </h3>
                                        <p className="text-brand-500 font-medium text-xl">
                                            {appointment.service} • <span className="opacity-70">#{appointment.id}</span>
                                        </p>
                                    </div>
                                </div>

                                <StatusTracker status={appointment.status} />


                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-64 text-brand-300 p-8 border-2 border-dashed border-brand-100 rounded-[2.5rem]">
                            <Search className="w-12 h-12 mb-4 opacity-50" />
                            <p className="font-medium text-lg">Ingresá tu número de turno</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
