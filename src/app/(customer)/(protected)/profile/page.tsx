"use client";

import { useState } from "react";
import { useAppointments } from "@/features/customer/hooks/useAppointments";
import { useCancelAppointment } from "@/hooks/useCancelAppointment";
import { Scissors } from "lucide-react";
import { Modal } from "@/features/customer/components/molecules/Modal";
import { Appointment } from "@/types";
import { useTranslation } from "@/i18n/LanguageContext";
import { ProfileHeader } from "@/features/customer/components/organisms/ProfileHeader";
import { AppointmentTabs } from "@/features/customer/components/organisms/AppointmentTabs";
import Link from "next/link";
import { Button } from "@/features/customer/components/atoms/Button";

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

    return (
        <div className="bg-brand-50 min-h-screen">
            <ProfileHeader />

            <div className="mx-auto max-w-3xl px-6 lg:px-8 -mt-10 pb-24">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-48 bg-white/50 rounded-[2.5rem] animate-pulse"></div>)}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm ring-1 ring-brand-100/50">
                        <div className="mx-auto h-20 w-20 bg-brand-50 rounded-full flex items-center justify-center mb-6">
                            <Scissors className="h-10 w-10 text-brand-400" />
                        </div>
                        <h3 className="text-2xl font-black text-brand-900 mb-3">{t.profile.emptyTitle}</h3>
                        <p className="text-brand-600 mb-8 max-w-sm mx-auto font-medium">{t.profile.emptySubtitle}</p>
                        <Link href="/booking">
                            <Button className="px-8 h-12 text-lg">
                                Reservar Turno
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <AppointmentTabs
                        appointments={appointments}
                        onCancel={handleCancelClick}
                    />
                )}
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

