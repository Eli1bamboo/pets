
import { Appointment, AppointmentStatus } from "@/types";
import { Eye, Trash2, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/atoms/Skeleton";
import { StatusBadge } from "@/components/atoms/StatusBadge";

interface AppointmentRowProps {
    appointment?: Appointment;
    isLoading?: boolean;
    isEmpty?: boolean;
    onStatusUpdate?: (id: number, status: AppointmentStatus) => void;
    onViewDetails?: (apt: Appointment) => void;
    onCancel?: (apt: Appointment) => void;
    actionRenderer?: (apt: Appointment) => React.ReactNode;
}

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'washing', label: 'En Baño' },
    { value: 'drying', label: 'En Secado' },
    { value: 'ready', label: 'Listo' },
    { value: 'completed', label: 'Completado' },
];

export function AppointmentRow({
    appointment,
    isLoading = false,
    isEmpty = false,
    onStatusUpdate,
    onViewDetails,
    onCancel,
    actionRenderer
}: AppointmentRowProps) {

    // Skeleton Row
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

    // Empty Placeholder Row
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

    // Data Row
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
                <StatusBadge status={appointment.status} />
            </td>
            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end items-center gap-2">
                    {/* Status Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-brand-500 text-xs font-semibold cursor-pointer"
                            value={appointment.status}
                            onChange={(e) => onStatusUpdate?.(appointment.id, e.target.value as AppointmentStatus)}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                            <option value="cancelled" disabled hidden>Cancelado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    {/* Details Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails?.(appointment); }}
                        className="text-brand-600 hover:text-brand-900 p-2 rounded-full hover:bg-brand-50 transition-colors"
                        title="Ver detalles"
                    >
                        <Eye size={18} />
                    </button>

                    {/* Cancel Button */}
                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onCancel?.(appointment); }}
                            className="text-red-400 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                            title="Cancelar Turno"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}
