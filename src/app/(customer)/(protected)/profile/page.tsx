"use client";

import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { useCancelAppointment } from "@/hooks/useCancelAppointment";
import { Calendar, Clock, Scissors, XCircle } from "lucide-react";
import Modal from "@/components/molecules/Modal";
import { Appointment } from "@/types";
import { useTranslation } from "@/i18n/LanguageContext";

export default function ProfilePage() {
    const { appointments, loading, refetch } = useAppointments();
    const { cancelAppointment } = useCancelAppointment();
    const [modal, setModal] = useState<{ open: boolean; title: string; message: string; type: 'warning' | 'error' | 'success'; onConfirm?: () => void }>({
        open: false, title: "", message: "", type: "warning"
    });
    const { t } = useTranslation();

    const handleCancelClick = (apt: Appointment) => {
        setModal({
            open: true,
            title: t.profile.cancelTitle,
            message: t.profile.cancelMessage.replace('{petName}', apt.pet_name),
            type: "warning",
            onConfirm: async () => {
                const result = await cancelAppointment(apt.id);
                if (result.success) {
                    refetch();
                } else {
                    setModal({
                        open: true,
                        title: t.profile.cancelErrorTitle,
                        message: result.error || t.profile.cancelErrorFallback,
                        type: "error"
                    });
                }
            }
        });
    };

    const getStatusLabel = (status: string) => {
        const s = t.status as Record<string, string>;
        return s[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-gray-100 text-gray-800 ring-gray-600/20",
            washing: "bg-blue-100 text-blue-800 ring-blue-600/20",
            drying: "bg-orange-100 text-orange-800 ring-orange-600/20",
            ready: "bg-green-100 text-green-800 ring-green-600/20",
            completed: "bg-brand-100 text-brand-800 ring-brand-600/20",
            cancelled: "bg-red-50 text-red-700 ring-red-600/10",
        };
        return colors[status] || "bg-gray-100 text-gray-800 ring-gray-600/20";
    };

    return (
        <div className="bg-brand-50 min-h-screen py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">{t.profile.title}</h2>
                    <p className="mt-2 text-lg leading-8 text-brand-700">
                        {t.profile.subtitle}
                    </p>
                </div>

                <div className="mx-auto mt-10 max-w-2xl border-t border-brand-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl shadow-sm"></div>)}
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm ring-1 ring-brand-900/5">
                            <Scissors className="mx-auto h-12 w-12 text-brand-300" />
                            <h3 className="mt-2 text-sm font-semibold text-brand-900">{t.profile.emptyTitle}</h3>
                            <p className="mt-1 text-sm text-brand-500">{t.profile.emptySubtitle}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {appointments.map((apt) => (
                                <div key={apt.id} className={`bg-white p-6 rounded-2xl shadow-sm ring-1 ring-brand-900/5 ${apt.status === 'cancelled' ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(apt.status)}`}>
                                            {getStatusLabel(apt.status)}
                                        </span>
                                        <span className="text-xs text-brand-400 font-mono">#{apt.id}</span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-brand-900 flex items-center gap-2">
                                        <Scissors size={18} className="text-brand-600" />
                                        {apt.pet_name}
                                    </h3>

                                    <div className="mt-4 space-y-2 text-sm text-brand-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-brand-400" />
                                            {new Date(apt.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-brand-400" />
                                            {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    {apt.status === 'pending' && (
                                        <div className="mt-6 border-t border-brand-100 pt-4">
                                            <button
                                                onClick={() => handleCancelClick(apt)}
                                                className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <XCircle size={14} />
                                                {t.profile.cancelButton}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Modal
                open={modal.open}
                onClose={() => setModal(prev => ({ ...prev, open: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
                confirmText={t.profile.cancelConfirm}
                cancelText={t.profile.cancelBack}
            />
        </div>
    );
}
