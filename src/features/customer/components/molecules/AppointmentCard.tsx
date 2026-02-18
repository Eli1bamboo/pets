import { Appointment } from "@/types";
import { Calendar, Clock, Scissors, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/features/customer/components/atoms/Button";
import { getStatusColor } from "@/config/appointments";
import { useTranslation } from "@/i18n/LanguageContext";
import { Tooltip } from "@/components/atoms/Tooltip";

interface AppointmentCardProps {
    appointment: Appointment;
    onCancel: (appointment: Appointment) => void;
    onTrack?: (appointment: Appointment) => void;
    disableCancel?: boolean;
    cancellationWindow?: number; // hours
}

export function AppointmentCard({ appointment, onCancel, onTrack, disableCancel, cancellationWindow = 24 }: AppointmentCardProps) {
    const { t } = useTranslation();
    const isCompleted = appointment.status === 'completed' || appointment.status === 'cancelled';
    const showTracking = !!onTrack;

    // Cancellation Logic
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const hoursValues = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const hoursLeft = Math.max(0, hoursValues);

    // Can cancel if:
    // 1. Not globally disabled (e.g. historical tab)
    // 2. Status is pending
    // 3. Time left > cancellation window
    const isWithinWindow = hoursLeft >= cancellationWindow;
    const canCancel = !disableCancel && appointment.status === 'pending' && isWithinWindow;

    // Reason for disabling
    let disableReason = "";
    if (!isWithinWindow && appointment.status === 'pending') {
        disableReason = `Solo se puede cancelar con ${cancellationWindow} horas de anticipación.`;
    }

    // Status translation helper
    const getStatusLabel = (status: string) => {
        const s = t.status as Record<string, string>;
        return s[status] || status;
    };

    return (
        <div className={`bg-white p-6 rounded-[2rem] shadow-sm ring-1 ring-brand-100 hover:shadow-md transition-all duration-300 ${isCompleted ? 'opacity-80 grayscale-[0.2]' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                        <Scissors size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-brand-900 leading-tight flex items-center gap-2">
                            {appointment.pet_name}
                            <span className="text-xs font-bold text-brand-400 bg-brand-50 px-2 py-0.5 rounded-md">#{appointment.id}</span>
                        </h3>
                        <p className="text-sm font-medium text-brand-500">{appointment.service}</p>
                    </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                </span>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-brand-700 bg-brand-50/50 p-3 rounded-xl">
                    <Calendar size={18} className="text-brand-400 shrink-0" />
                    <span className="text-sm font-semibold">
                        {appointmentDate.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
                <div className="flex items-center gap-2.5 text-brand-700 bg-brand-50/50 p-3 rounded-xl">
                    <Clock size={18} className="text-brand-400 shrink-0" />
                    <span className="text-sm font-semibold">
                        {appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="pt-2 space-y-3">
                {showTracking && (
                    <Button
                        onClick={() => onTrack!(appointment)}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold shadow-brand-200 shadow-lg relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                            🔍 Seguimiento en vivo
                        </span>
                    </Button>
                )}

                {appointment.status === 'pending' && !disableCancel && (
                    <div className="w-full">
                        {canCancel ? (
                            <>
                                <button
                                    onClick={() => onCancel(appointment)}
                                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <XCircle size={16} />
                                    {t.profile.cancelButton}
                                </button>
                                <p className="text-xs text-center text-gray-400 mt-1">
                                    Tenés hasta {Math.max(0, Math.floor(hoursValues - cancellationWindow))}h para cancelar
                                </p>
                            </>
                        ) : (
                            <Tooltip content={disableReason}>
                                <button
                                    disabled
                                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-400 bg-gray-50 rounded-xl cursor-not-allowed opacity-70"
                                >
                                    <AlertCircle size={16} />
                                    No se puede cancelar
                                </button>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
