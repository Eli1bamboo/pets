"use client";

import { useState } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { Appointment, AppointmentStatus } from "@/types";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import AppointmentSidebar from "@/components/organisms/AppointmentSidebar";
import { AppointmentsTable } from "@/components/organisms/AppointmentsTable";
import { TablePagination } from "@/components/molecules/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import Modal, { ModalProps } from "@/components/molecules/Modal";

const ITEMS_PER_PAGE = 8;

export default function AdminPage() {
    const { appointments, loading: fetching, updateStatus } = useAppointments({ isAdmin: true });

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

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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
                title: "Error al actualizar",
                message: "No se pudo cambiar el estado del turno. Por favor intenta nuevamente.",
                details: typeof error === 'object' ? JSON.stringify(error) : String(error),
                type: "error"
            });
        }
        return success;
    };

    const handleOpenSidebar = (apt: Appointment) => {
        setSelectedAppointment(apt);
        setSidebarOpen(true);
    };

    const handleCancelClick = (apt: Appointment) => {
        setModalConfig({
            open: true,
            onClose: () => setModalConfig(prev => ({ ...prev, open: false })),
            title: "¿Cancelar turno?",
            message: `Vas a cancelar el turno de ${apt.pet_name} (Cliente: ${apt.profiles?.full_name || 'Desconocido'}). Esta acción no se puede deshacer.`,
            type: "warning",
            confirmText: "Sí, cancelar turno",
            cancelText: "Volver atrás",
            onConfirm: async () => {
                const success = await handleStatusUpdate(apt.id, 'cancelled');
                if (success) {
                    setSidebarOpen(false);
                }
            }
        });
    };

    // Auth loading handled by layout or ignored to show structure

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-brand-900">Panel de Administración</h1>
                        <p className="mt-2 text-sm text-brand-700">
                            Gestión de turnos y estados de las mascotas.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link href="/admin/settings">
                            <Button className="flex items-center gap-2">
                                <Settings size={18} />
                                Configuración
                            </Button>
                        </Link>
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
                />
            </div>

            <AppointmentSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                appointment={selectedAppointment}
                onSave={async (id, status) => {
                    if (status === 'cancelled') {
                        // Find the appointment to get details for the modal
                        const apt = appointments.find(a => a.id === id);
                        if (apt) {
                            handleCancelClick(apt);
                        }
                    } else {
                        const success = await handleStatusUpdate(id, status);
                        if (success) {
                            setSidebarOpen(false);
                        }
                    }
                }}
            />

            <Modal
                {...modalConfig}
            />
        </div>
    );
}
