export const APPOINTMENT_STATUSES = [
    { value: 'pending', label: 'Pendiente', color: 'bg-slate-100 text-slate-700' },
    { value: 'washing', label: 'En Baño', color: 'bg-blue-100 text-blue-700' },
    { value: 'drying', label: 'En Secado', color: 'bg-orange-100 text-orange-800' },
    { value: 'ready', label: 'Listo', color: 'bg-purple-100 text-purple-700' },
    { value: 'completed', label: 'Completado', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
] as const;

export type AppointmentStatusType = typeof APPOINTMENT_STATUSES[number]['value'];

export const getStatusLabel = (status: string) =>
    APPOINTMENT_STATUSES.find(s => s.value === status)?.label || status;

export const getStatusColor = (status: string) =>
    APPOINTMENT_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';

export const SERVICES_PRICE_MAP: Record<string, number> = {
    'Baño y Secado': 4500,
    'Corte Completo': 6500,
    'Spa de Deslanado': 8000,
};
