"use client";

import { useState, useEffect } from 'react'
import { User, Dog, Calendar, Clock, Save } from 'lucide-react'
import { Appointment, AppointmentStatus } from '@/types'
import { Button } from '@/components/atoms/Button'
import Sidebar from '@/components/organisms/Sidebar'

interface AppointmentSidebarProps {
    open: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onSave: (id: number, status: AppointmentStatus) => Promise<void>;
}

const STATUS_OPTIONS: { value: AppointmentStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pendiente', color: 'bg-gray-100 text-gray-800' },
    { value: 'washing', label: 'En Baño', color: 'bg-blue-100 text-blue-800' },
    { value: 'drying', label: 'En Secado', color: 'bg-orange-100 text-orange-800' },
    { value: 'ready', label: 'Listo', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completado', color: 'bg-brand-100 text-brand-800' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-50 text-red-700' },
];

export default function AppointmentSidebar({ open, onClose, appointment, onSave }: AppointmentSidebarProps) {
    const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>('pending');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (appointment) {
            setSelectedStatus(appointment.status);
        }
    }, [appointment]);

    const handleSave = async () => {
        if (!appointment) return;
        setSaving(true);
        await onSave(appointment.id, selectedStatus);
        setSaving(false);
    };

    if (!appointment) return null;

    const footer = (
        <>
            <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
            >
                Cerrar
            </Button>
            <Button
                onClick={handleSave}
                isLoading={saving}
                className="flex-1 flex items-center justify-center gap-2"
            >
                <Save size={16} />
                Guardar
            </Button>
        </>
    );

    return (
        <Sidebar
            open={open}
            onClose={onClose}
            title={`Detalles del Turno #${appointment.id}`}
            description="Información completa y gestión del turno."
            footer={footer}
        >
            <div className="space-y-8">
                {/* Client Info */}
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-base font-semibold text-brand-900 mb-4 flex items-center gap-2">
                        <User size={18} className="text-primary-orange" />
                        Cliente
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-900">{appointment.profiles?.full_name || "Sin nombre"}</p>
                    </div>
                </div>

                {/* Pet Info */}
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-base font-semibold text-brand-900 mb-4 flex items-center gap-2">
                        <Dog size={18} className="text-primary-orange" />
                        Mascota
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Nombre</p>
                            <p className="text-sm font-medium text-gray-900">{appointment.pet_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Servicio</p>
                            <p className="text-sm font-medium text-gray-900">{appointment.service}</p>
                        </div>
                    </div>
                </div>

                {/* Date Info */}
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-base font-semibold text-brand-900 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-primary-orange" />
                        Fecha y Hora
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                        <Clock className="text-brand-400" size={20} />
                        <p className="text-sm font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleString('es-AR', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>

                {/* Status Management */}
                <div>
                    <h3 className="text-base font-semibold text-brand-900 mb-4">Estado del Turno</h3>
                    <div className="space-y-3">
                        {STATUS_OPTIONS.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => setSelectedStatus(option.value)}
                                className={`cursor-pointer rounded-lg px-4 py-3 flex items-center justify-between border-2 transition-all ${selectedStatus === option.value
                                    ? `border-brand-900 bg-brand-50`
                                    : 'border-transparent bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`h-2.5 w-2.5 rounded-full ${option.color.split(' ')[0]}`} />
                                    <span className={`text-sm font-medium ${selectedStatus === option.value ? 'text-brand-900' : 'text-gray-600'}`}>
                                        {option.label}
                                    </span>
                                </div>
                                {selectedStatus === option.value && (
                                    <div className="h-2 w-2 rounded-full bg-brand-900" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
