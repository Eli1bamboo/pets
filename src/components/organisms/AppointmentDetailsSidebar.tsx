import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/molecules/SidebarSheet";
import { Appointment, AppointmentStatus } from "@/types";
import { Calendar, Clock, User, Dog, Save, History, Activity } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useState, useEffect } from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { useSidebar } from "@/hooks/useSidebar";
import { useRefresh } from "@/providers/AdminUIProvider";
import { useAppointmentLogs } from "@/hooks/useAppointmentLogs";
import { useAppointment } from "@/hooks/useAppointment";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/atoms/Skeleton";

interface AppointmentDetailsSidebarProps {
    appointment: Appointment;
}

const STATUS_OPTIONS: { value: AppointmentStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pendiente', color: 'bg-slate-100 text-slate-700' },
    { value: 'washing', label: 'En Baño', color: 'bg-blue-100 text-blue-700' },
    { value: 'drying', label: 'En Secado', color: 'bg-orange-100 text-orange-800' },
    { value: 'ready', label: 'Listo', color: 'bg-purple-100 text-purple-700' },
    { value: 'completed', label: 'Completado', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-700' },
];

export function AppointmentDetailsSidebar({ appointment: initialAppointment }: AppointmentDetailsSidebarProps) {
    const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>('pending');
    const [saving, setSaving] = useState(false);
    const { updateStatus } = useAppointments({}); // Get updater
    const { closeSidebar } = useSidebar();
    const { triggerRefresh } = useRefresh();

    // Fetch live data to handle real-time updates and avoid stale state
    const { appointment: liveAppointment, loading: aptLoading } = useAppointment(initialAppointment?.id);
    const appointment = liveAppointment || initialAppointment; // Fallback to initial if loading or error, though hook handles it.

    const { logs, loading: logsLoading } = useAppointmentLogs(appointment?.id);

    useEffect(() => {
        if (appointment) {
            setSelectedStatus(appointment.status);
        }
    }, [appointment]);

    if (!appointment) return null;

    const handleSave = async () => {
        setSaving(true);
        await updateStatus(appointment.id, selectedStatus);
        setSaving(false);
        triggerRefresh();
        closeSidebar();
    };

    return (
        <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4 mb-6">
                <SheetTitle className="text-2xl font-bold text-admin-primary">
                    Detalles del Turno
                </SheetTitle>
                <SheetDescription>
                    ID: #{appointment.id.toString().slice(0, 8)} | Fecha: {new Date(appointment.date).toLocaleDateString('es-AR')}
                </SheetDescription>
            </SheetHeader>

            <div className="space-y-8 flex-1 overflow-y-auto pr-1">
                {/* Client Info */}
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-base font-semibold text-admin-primary mb-4 flex items-center gap-2">
                        <User size={18} className="text-admin-accent" />
                        Cliente
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{appointment.profiles?.full_name || "Sin nombre"}</p>
                    </div>
                </div>


                {/* Pet Info */}
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-base font-semibold text-admin-primary mb-4 flex items-center gap-2">
                        <Dog size={18} className="text-admin-accent" />
                        Mascota
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Nombre</p>
                            <p className="text-sm font-medium text-slate-900">{appointment.pet_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Servicio</p>
                            <p className="text-sm font-medium text-slate-900">{appointment.service}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Logs */}
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-base font-semibold text-admin-primary mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-admin-accent" />
                        Actividad
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
                        {logsLoading ? (
                            <div className="relative pl-7 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 h-[240px] overflow-hidden">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-200 ring-1 ring-slate-200" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-3/4 bg-slate-200" />
                                            <Skeleton className="h-3 w-1/2 bg-slate-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="relative pl-7 space-y-6 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 min-h-full">
                                    {/* Creation Log + Logs */}
                                    {[
                                        ...logs,
                                        {
                                            id: 'creation',
                                            appointment_id: appointment.id,
                                            description: 'Turno solicitado',
                                            created_at: appointment.created_at
                                        }
                                    ]
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .map((log) => (
                                            <div key={log.id} className="relative">
                                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-admin-accent ring-1 ring-slate-200" />
                                                <p className="text-sm text-slate-900 font-medium">{log.description}</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {format(new Date(log.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Management */}
                <div>
                    <h3 className="text-base font-semibold text-admin-primary mb-4">Estado del Turno</h3>
                    <div className="space-y-3">
                        {STATUS_OPTIONS.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => setSelectedStatus(option.value)}
                                className={`cursor-pointer rounded-lg px-4 py-3 flex items-center justify-between border transition-all ${selectedStatus === option.value
                                    ? `border-admin-primary bg-slate-100`
                                    : 'border-transparent bg-white hover:bg-slate-50 border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`h-2.5 w-2.5 rounded-full ${option.color.split(' ')[0]}`} />
                                    <span className={`text-sm font-medium ${selectedStatus === option.value ? 'text-admin-primary' : 'text-slate-600'}`}>
                                        {option.label}
                                    </span>
                                </div>
                                {selectedStatus === option.value && (
                                    <div className="h-2 w-2 rounded-full bg-admin-primary" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-6 mt-4 flex gap-3 bg-white sticky bottom-0 z-10">
                <Button
                    variant="admin-outline"
                    onClick={closeSidebar}
                    className="flex-1"
                >
                    Cerrar
                </Button>
                <Button
                    variant="admin-primary"
                    onClick={handleSave}
                    isLoading={saving}
                    className="flex-1 flex items-center justify-center gap-2"
                >
                    <Save size={16} />
                    Guardar
                </Button>
            </div>
        </div>
    );
}
