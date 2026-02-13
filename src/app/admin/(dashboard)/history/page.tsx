"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { Search, Eye, Filter, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminLoader } from "@/components/atoms/AdminLoader";
import { AppointmentsTable } from "@/components/organisms/AppointmentsTable";
import { TablePagination } from "@/components/molecules/TablePagination";
import { usePagination } from "@/hooks/usePagination";
import { Appointment, AppointmentStatus } from "@/types";
import { useAdminUI } from "@/providers/AdminUIProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es as esLocale } from 'date-fns/locale';
import { useTranslation } from "@/i18n/LanguageContext";



export default function AdminHistoryPage() {
    const { isAdmin, loading: authLoading } = useAdminAuth({ redirectToLogin: true });

    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [selectedStatuses, setSelectedStatuses] = useState<AppointmentStatus[]>([]);

    const { openSidebar } = useAdminUI();
    const { t } = useTranslation();

    const STATUS_FILTERS: { value: AppointmentStatus; label: string }[] = [
        { value: 'completed', label: t.admin.statuses.completed },
        { value: 'cancelled', label: t.admin.statuses.cancelled },
        { value: 'pending', label: t.admin.statuses.pending },
    ];

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            redirect("/");
        }
    }, [isAdmin, authLoading]);

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const { appointments, count, loading: dataLoading, updateStatus } = useAppointments({
        isAdmin: true,
        startDate,
        endDate,
        searchQuery: searchTerm,
        statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE
    });

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: AppointmentStatus) => {
        const { success, error } = await updateStatus(id, newStatus);
        if (!success && error) {
            console.error("Failed to update status");
        }
    };


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
                    <h1 className="text-4xl font-black text-admin-primary mb-2">{t.admin.history.title}</h1>
                    <p className="text-admin-text-secondary">{t.admin.history.subtitle}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder={t.admin.history.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm focus:border-admin-accent focus:ring-admin-accent transition-all outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <div className="relative z-10">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date: Date | null) => { setStartDate(date || undefined); setCurrentPage(1); }}
                                    placeholderText={t.admin.history.dateFrom}
                                    className="w-full md:w-40 rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-admin-accent focus:ring-admin-accent outline-none"
                                    locale={esLocale}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div className="relative z-10">
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date: Date | null) => { setEndDate(date || undefined); setCurrentPage(1); }}
                                    placeholderText={t.admin.history.dateTo}
                                    className="w-full md:w-40 rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-admin-accent focus:ring-admin-accent outline-none"
                                    locale={esLocale}
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mr-2">
                            <Filter size={16} />
                            <span>{t.admin.history.filterLabel}</span>
                        </div>
                        {STATUS_FILTERS.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => { toggleStatusFilter(s.value); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedStatuses.includes(s.value)
                                    ? 'bg-admin-primary text-white border-admin-primary'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                        {selectedStatuses.length > 0 && (
                            <button
                                onClick={() => { setSelectedStatuses([]); setCurrentPage(1); }}
                                className="text-xs text-red-500 font-bold hover:underline ml-auto"
                            >
                                {t.admin.history.clearFilters}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <AppointmentsTable
                appointments={appointments}
                isLoading={dataLoading}
                itemsPerPage={ITEMS_PER_PAGE}
                actionRenderer={(apt) => (
                    <div className="flex justify-end pr-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleViewDetails(apt); }}
                            className="text-slate-600 hover:text-admin-primary p-2 rounded-full hover:bg-slate-100 transition-colors group flex items-center gap-2"
                            title={t.admin.history.viewDetails}
                        >
                            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">{t.admin.history.view}</span>
                            <Eye size={18} />
                        </button>
                    </div>
                )}
            />

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={count || 0}
                startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
                endIndex={(currentPage - 1) * ITEMS_PER_PAGE + appointments.length}
                onPageChange={handlePageChange}
                variant="admin"
            />
        </main>
    );
}
