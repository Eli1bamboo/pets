import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Appointment } from "@/types";
import { Calendar, Clock, User, Dog, Scissors, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AppointmentDetailsSidebarProps {
    appointment: Appointment;
}

export function AppointmentDetailsSidebar({ appointment }: AppointmentDetailsSidebarProps) {
    if (!appointment) return null;

    return (
        <div className="space-y-6">
            <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-2xl font-bold text-brand-900">
                    Detalles del Turno
                </SheetTitle>
                <SheetDescription>
                    ID: #{appointment.id.toString().slice(0, 8)}
                </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-4">
                {/* Status Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold capitalize
                    ${appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'}`}
                >
                    {appointment.status === 'completed' ? 'Completado' :
                        appointment.status === 'cancelled' ? 'Cancelado' :
                            appointment.status === 'pending' ? 'Pendiente' :
                                appointment.status}
                </div>

                {/* Date & Time */}
                <div className="flex items-start gap-3">
                    <Calendar className="text-brand-500 mt-1" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-900">Fecha y Hora</h4>
                        <p className="text-gray-600">
                            {format(new Date(appointment.date), "PPP", { locale: es })}
                        </p>
                        <p className="text-gray-500 text-sm">
                            {format(new Date(appointment.date), "p", { locale: es })} hs
                        </p>
                    </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-3">
                    <Scissors className="text-brand-500 mt-1" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-900">Servicio</h4>
                        <p className="text-gray-600">{appointment.service}</p>
                    </div>
                </div>

                {/* Pet Info */}
                <div className="flex items-start gap-3">
                    <Dog className="text-brand-500 mt-1" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-900">Mascota</h4>
                        <p className="text-gray-600 font-bold">{appointment.pet_name}</p>
                    </div>
                </div>

                {/* Client Info */}
                <div className="flex items-start gap-3">
                    <User className="text-brand-500 mt-1" size={20} />
                    <div>
                        <h4 className="font-semibold text-gray-900">Cliente</h4>
                        <p className="text-gray-600">
                            {appointment.profiles?.full_name || "Desconocido"}
                        </p>
                        {/* Assuming user_id is the only other info we have, maybe render it or nothing */}
                    </div>
                </div>

                {/* Additional Info / Footer */}
                <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
                    <AlertCircle size={12} />
                    <span>Creado el {format(new Date(appointment.created_at), "PPP p", { locale: es })}</span>
                </div>
            </div>
        </div>
    );
}
