"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { Search, Eye, Filter, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminLoader } from "@/components/molecules/AdminLoader";
import { AppointmentsTable } from "@/components/organisms/AppointmentsTable";
import { Appointment, AppointmentStatus } from "@/types";
import { useSidebar } from "@/hooks/useSidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';

const STATUS_FILTERS: { value: AppointmentStatus; label: string }[] = [
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'pending', label: 'Pendiente' },
];

export default function AdminHistoryPage() {
    const { isAdmin, loading: authLoading } = useAdminAuth({ redirectToLogin: true });

    // Filters State
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [selectedStatuses, setSelectedStatuses] = useState<AppointmentStatus[]>([]);

    const { appointments, loading: dataLoading } = useAppointments({
        isAdmin,
        startDate,
        endDate,
        searchQuery: searchTerm,
        statuses: selectedStatuses
    });

    const { openSidebar } = useSidebar();

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            redirect("/");
        }
    }, [isAdmin, authLoading]);

    const handleViewDetails = (apt: Appointment) => {
        openSidebar("appointment_details", { appointment: apt });
    };

    const toggleStatusFilter = (status: AppointmentStatus) => {
        setSelectedStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    if (authLoading) return null;

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <div className="flex flex-col gap-8 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-brand-900 mb-2">Historial Global</h1>
                    <p className="text-brand-600">Gestión y visualización de todos los turnos del sistema.</p>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar por mascota o cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-2xl border-brand-200 bg-gray-50 pl-11 pr-4 py-3 text-sm focus:border-primary-orange focus:ring-primary-orange transition-all"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="flex gap-2">
                            <div className="relative z-10">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date: Date | null) => setStartDate(date || undefined)}
                                    placeholderText="Fecha Desde"
                                    className="w-full md:w-40 rounded-2xl border-brand-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-orange focus:ring-primary-orange"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div className="relative z-10">
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date: Date | null) => setEndDate(date || undefined)}
                                    placeholderText="Fecha Hasta"
                                    className="w-full md:w-40 rounded-2xl border-brand-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-orange focus:ring-primary-orange"
                                    locale={es}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Filters */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm font-bold text-brand-700 mr-2">
                            <Filter size={16} />
                            <span>Estado:</span>
                        </div>
                        {STATUS_FILTERS.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => toggleStatusFilter(s.value)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedStatuses.includes(s.value)
                                    ? 'bg-brand-900 text-white border-brand-900'
                                    : 'bg-white text-brand-600 border-gray-200 hover:border-brand-300'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                        {selectedStatuses.length > 0 && (
                            <button
                                onClick={() => setSelectedStatuses([])}
                                className="text-xs text-red-500 font-bold hover:underline ml-auto"
                            >
                                Limpiar Filtros
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <AppointmentsTable
                appointments={appointments}
                isLoading={dataLoading}
                itemsPerPage={50} // Show all essentially, or large page
                actionRenderer={(apt) => (
                    <div className="flex justify-end pr-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleViewDetails(apt); }}
                            className="text-brand-600 hover:text-brand-900 p-2 rounded-full hover:bg-brand-50 transition-colors group flex items-center gap-2"
                            title="Ver detalles"
                        >
                            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver</span>
                            <Eye size={18} />
                        </button>
                    </div>
                )}
            />
        </main>
    );
}
