"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Dog, Scissors } from "lucide-react";
import { Button } from "../atoms/Button";
import { useTranslation } from "@/i18n/LanguageContext";

interface BookingSummaryProps {
    petName: string;
    serviceName: string;
    servicePrice: string;
    date: string;
    time: string;
    onConfirm: () => void;
    isSubmitting: boolean;
    canConfirm: boolean;
}

export function BookingSummary({
    petName,
    serviceName,
    servicePrice,
    date,
    time,
    onConfirm,
    isSubmitting,
    canConfirm
}: BookingSummaryProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-900/5 ring-1 ring-brand-900/5 p-6 md:p-8 sticky top-24">
            <h3 className="text-xl font-bold text-brand-900 mb-6">{t.booking ? t.booking.summaryTitle : "Resumen del Turno"}</h3>

            <div className="space-y-6">
                {/* Pet */}
                <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${petName ? 'bg-brand-100 text-primary-orange' : 'bg-gray-50 text-gray-300'}`}>
                        <Dog size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-0.5">{t.booking ? t.booking.petNameLabel : "Mascota"}</p>
                        <p className={`font-semibold ${petName ? 'text-brand-900' : 'text-gray-400 italic'}`}>
                            {petName || "Ingresá el nombre"}
                        </p>
                    </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${serviceName ? 'bg-brand-100 text-primary-orange' : 'bg-gray-50 text-gray-300'}`}>
                        <Scissors size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-0.5">{t.booking ? t.booking.serviceLabel : "Servicio"}</p>
                        <div className="flex justify-between items-baseline">
                            <p className={`font-semibold ${serviceName ? 'text-brand-900' : 'text-gray-400 italic'}`}>
                                {serviceName || "Seleccioná un servicio"}
                            </p>
                            {servicePrice && serviceName && (
                                <span className="text-sm font-bold text-brand-600">${Number(servicePrice).toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${date ? 'bg-brand-100 text-primary-orange' : 'bg-gray-50 text-gray-300'}`}>
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-0.5">{t.booking ? t.booking.dateLabel : "Fecha"}</p>
                        <p className={`font-semibold ${date ? 'text-brand-900' : 'text-gray-400 italic'}`}>
                            {date || "Seleccioná una fecha"}
                        </p>
                    </div>
                </div>

                {/* Time */}
                <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl transition-colors ${time ? 'bg-brand-100 text-primary-orange' : 'bg-gray-50 text-gray-300'}`}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-0.5">{t.booking ? t.booking.timeLabel : "Hora"}</p>
                        <p className={`font-semibold ${time ? 'text-brand-900' : 'text-gray-400 italic'}`}>
                            {time || "Seleccioná una hora"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="my-8 h-px bg-brand-100" />

            <div className="flex justify-between items-center mb-8">
                <span className="text-brand-600 font-medium">Total Estimado</span>
                <span className="text-3xl font-extrabold text-brand-900">
                    ${servicePrice ? Number(servicePrice).toLocaleString() : '0'}
                </span>
            </div>

            <Button
                onClick={onConfirm}
                isLoading={isSubmitting}
                disabled={!canConfirm}
                size="lg"
                className="w-full text-lg h-14"
            >
                {t.booking ? t.booking.confirm : "Confirmar Reserva"}
            </Button>

            {!canConfirm && (
                <p className="text-xs text-center text-brand-400 mt-4">
                    Completá todos los pasos para confirmar
                </p>
            )}
        </div>
    );
}
