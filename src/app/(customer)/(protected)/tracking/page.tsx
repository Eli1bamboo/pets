"use client";

import { useState } from "react";
import { StatusTracker } from "@/features/customer/components/organisms/StatusTracker";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/features/customer/components/atoms/Button";
import { Input } from "@/features/customer/components/atoms/Input";
import { useTranslation } from "@/i18n/LanguageContext";
import { useAppointmentStatus } from "@/features/customer/hooks/useAppointmentStatus";


export default function TrackingPage() {
    const [inputId, setInputId] = useState("");
    const [appointmentId, setAppointmentId] = useState<string | null>(null);
    const { t } = useTranslation();
    const { appointment, status, loading, error } = useAppointmentStatus(appointmentId || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputId.trim()) {
            setAppointmentId(inputId);
        }
    };

    return (
        <div className="min-h-screen bg-background-cream px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <span className="text-primary-orange font-bold uppercase tracking-wider text-sm">{t.tracking.badge}</span>
                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl leading-[1.1]">
                    {t.tracking.title}
                </h2>
                <p className="mt-6 text-xl leading-8 text-brand-700">
                    {t.tracking.subtitle}
                </p>
            </div>

            <div className="mx-auto mt-12 max-w-xl">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
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
                        />
                    </div>
                    <Button
                        type="submit"
                        className="sm:w-32 h-14"
                    >
                        {t.tracking.search}
                    </Button>
                </form>

                {appointmentId && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16 bg-white p-10 rounded-[2.5rem] shadow-2xl ring-1 ring-brand-900/5"
                    >
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-600" /></div>
                        ) : error ? (
                            <div className="text-center p-8">
                                <p className="text-red-500 font-bold text-lg mb-2">⚠️ {error}</p>
                                <p className="text-brand-500">Por favor verificá el ID ingresado.</p>
                            </div>
                        ) : appointment ? (
                            <>
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-brand-900/5 pb-6 gap-4">
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-brand-900 flex items-center gap-3">
                                            {t.tracking.appointmentLabel} <span className="text-primary-orange">#{appointment.id}</span>
                                        </h3>
                                        <p className="text-brand-500 font-medium mt-1">
                                            Mascota: <span className="text-brand-700 font-bold">{appointment.pet_name}</span> • Servicio: <span className="text-brand-700 font-bold">{appointment.service}</span>
                                        </p>
                                    </div>
                                    <span className="bg-soft-peach/20 text-primary-orange px-4 py-1 rounded-full text-sm font-bold self-start md:self-center">
                                        {appointment.status === 'pending' ? 'Pendiente' :
                                            appointment.status === 'washing' ? 'En Baño' :
                                                appointment.status === 'drying' ? 'Secando' :
                                                    appointment.status === 'ready' ? 'Listo' : 'Finalizado'}
                                    </span>
                                </div>
                                <StatusTracker status={appointment.status} />
                            </>
                        ) : null}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
