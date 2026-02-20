
import { Appointment, AppointmentStatus } from "@/types";
import { Eye, Trash2, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { cn } from '@/utils/cn';
import { APPOINTMENT_STATUSES } from "@/config/appointments";
import { useTranslation } from "@/i18n/LanguageContext";

interface AppointmentRowProps {
    appointment?: Appointment;
    isLoading?: boolean;
    isEmpty?: boolean;
    onStatusUpdate?: (id: number, status: AppointmentStatus) => void;
    onViewDetails?: (apt: Appointment) => void;
    onCancel?: (apt: Appointment) => void;
    actionRenderer?: (apt: Appointment) => React.ReactNode;
}

export function AppointmentRow({
    appointment,
    isLoading = false,
    isEmpty = false,
    onStatusUpdate,
    onViewDetails,
    onCancel,
    actionRenderer
}: AppointmentRowProps) {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <tr className="h-[67px]">

                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-brand-900 sm:pl-6">
                    <Skeleton className="h-5 w-8" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Skeleton className="h-5 w-32" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Skeleton className="h-5 w-24" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Skeleton className="h-5 w-20" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Skeleton className="h-5 w-24" />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Skeleton className="h-6 w-16 px-2 rounded-md" />
                </td>
                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end items-center gap-2">
                        <Skeleton className="h-7 w-24 rounded" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </td>
            </tr>
        );
    }

    if (isEmpty || !appointment) {
        return (
            <tr className="h-[67px]">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-transparent sm:pl-6">-</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-transparent">-</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-transparent">-</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-transparent">-</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-transparent">-</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-transparent">-</td>
                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-transparent">-</td>
            </tr>
        );
    }

    return (
        <tr className="cursor-pointer hover:bg-gray-50 transition-colors h-[67px]">
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-brand-900 sm:pl-6">{appointment.id}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.profiles?.full_name || "-"}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.pet_name}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.service}</td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(appointment.date).toLocaleDateString('es-AR')}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="flex flex-col gap-1">
                    <StatusBadge status={appointment.status} />
                    {appointment.payment_status && (
                        <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit",
                            appointment.payment_status === 'paid' && "bg-green-100 text-green-700",
                            appointment.payment_status === 'pending' && "bg-amber-100 text-amber-700",
                            appointment.payment_status === 'unpaid' && "bg-gray-100 text-gray-500",
                            appointment.payment_status === 'refunded' && "bg-purple-100 text-purple-700",
                        )}>
                            {appointment.payment_status === 'paid' ? '💳 Pagado'
                                : appointment.payment_status === 'pending' ? '⏳ Pago pendiente'
                                    : appointment.payment_status === 'refunded' ? '↩ Reembolsado'
                                        : '💳 No pagado'}
                        </span>
                    )}
                </div>
            </td>
            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end items-center gap-2">
                    {actionRenderer ? actionRenderer(appointment) : (
                        <>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-semibold cursor-pointer"
                                    value={appointment.status}
                                    onChange={(e) => onStatusUpdate?.(appointment.id, e.target.value as AppointmentStatus)}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {APPOINTMENT_STATUSES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                    <option value="cancelled" disabled hidden>{t.admin.appointments.cancelled}</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDown size={14} />
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); onViewDetails?.(appointment); }}
                                className="text-slate-400 hover:text-admin-primary p-2 rounded-full hover:bg-slate-100 transition-colors"
                                title={t.admin.appointments.viewDetails}
                            >
                                <Eye size={18} />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (appointment.status !== 'cancelled' && appointment.status !== 'completed') {
                                        onCancel?.(appointment);
                                    }
                                }}
                                disabled={appointment.status === 'cancelled' || appointment.status === 'completed'}
                                className={cn(
                                    "p-2 rounded-full transition-colors",
                                    appointment.status === 'cancelled' || appointment.status === 'completed'
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-red-400 hover:text-red-700 hover:bg-red-50"
                                )}
                                title={appointment.status === 'cancelled' || appointment.status === 'completed'
                                    ? t.admin.appointments.cannotCancel
                                    : t.admin.appointments.cancelAppointment
                                }
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
