"use client";

import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { Appointment, AppointmentStatus } from "@/types";
import { Button } from "@/components/atoms/Button";
import { AppointmentsTable } from "@/components/organisms/AppointmentsTable";
import { TablePagination } from "@/components/molecules/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { Modal, ModalProps } from "@/components/molecules/Modal";
import { Calendar, Settings } from "lucide-react";
import { getWeekRange, formatWeekRange } from "@/utils/dateUtils";
import { useAdminUI } from "@/providers/AdminUIProvider";
import { useTranslation } from "@/i18n/LanguageContext";

const ITEMS_PER_PAGE = 8;

export default function AdminPage() {
    const { start: startDate, end: endDate } = getWeekRange();
    const { openSidebar, closeSidebar } = useAdminUI();
    const { t } = useTranslation();

    const { appointments, loading: fetching, updateStatus } = useAppointments({
        isAdmin: true,
        startDate,
        endDate
    });

    const {
        currentItems: currentAppointments,
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        goToPage
    } = usePagination({
        items: appointments,
        itemsPerPage: ITEMS_PER_PAGE
    });

    const [modalConfig, setModalConfig] = useState<ModalProps>({
        open: false,
        onClose: () => setModalConfig(prev => ({ ...prev, open: false })),
        title: "",
        message: "",
        type: "info"
    });

    const handleStatusUpdate = async (id: number, newStatus: AppointmentStatus) => {
        const { success, error } = await updateStatus(id, newStatus);
        if (!success && error) {
            setModalConfig({
                open: true,
                onClose: () => setModalConfig(prev => ({ ...prev, open: false })),
                title: t.admin.appointments.updateError,
                message: t.admin.appointments.updateErrorMsg,
                details: typeof error === 'object' ? JSON.stringify(error) : String(error),
                type: "error"
            });
        }
        return success;
    };

    const handleOpenSidebar = (apt: Appointment) => {
        openSidebar("appointment_details", { appointment: apt });
    };

    const handleCancelClick = (apt: Appointment) => {
        setModalConfig({
            open: true,
            onClose: () => setModalConfig(prev => ({ ...prev, open: false })),
            title: t.admin.appointments.cancelTitle,
            message: t.admin.appointments.cancelMsg.replace('{petName}', apt.pet_name).replace('{clientName}', apt.profiles?.full_name || 'Desconocido'),
            type: "warning",
            confirmText: t.admin.appointments.cancelConfirm,
            cancelText: t.admin.appointments.cancelBack,
            onConfirm: async () => {
                const success = await handleStatusUpdate(apt.id, 'cancelled');
                if (success) {
                    closeSidebar();
                }
            }
        });
    };



    return (
        <div className="bg-admin-bg min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-black leading-6 text-admin-primary">{t.admin.appointments.title}</h1>
                        <p className="mt-2 text-sm text-admin-text-secondary">
                            {t.admin.appointments.subtitle}
                        </p>
                    </div>
                    <div className="mt-4 sm:flex-none flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-slate-700 whitespace-nowrap shadow-sm">
                            <Calendar size={18} className="text-admin-accent" />
                            <span className="text-sm font-semibold capitalize">
                                {formatWeekRange(startDate, endDate)}
                            </span>
                        </div>
                        <Button
                            onClick={() => openSidebar("settings")}
                            className="flex items-center gap-2 bg-admin-primary hover:bg-slate-800 text-white border-none shadow-sm"
                        >
                            <Settings size={18} />
                            {t.admin.appointments.settings}
                        </Button>
                    </div>
                </div>

                <AppointmentsTable
                    appointments={currentAppointments}
                    isLoading={fetching}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onStatusUpdate={handleStatusUpdate}
                    onViewDetails={handleOpenSidebar}
                    onCancel={handleCancelClick}
                />

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={appointments.length}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    onPageChange={goToPage}
                    variant="admin"
                />
            </div>

            <Modal
                {...modalConfig}
            />
        </div>
    );
}
