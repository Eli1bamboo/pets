"use client";

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Dog, Calendar, Clock, Save } from 'lucide-react'
import { Appointment, AppointmentStatus } from '@/types'
import { Button } from '@/components/atoms/Button'

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

    return (
        <AnimatePresence>
            {open && appointment && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-6 bg-brand-900 text-white flex items-start justify-between shrink-0">
                            <div>
                                <h2 className="text-xl font-bold leading-6">Detalles del Turno #{appointment.id}</h2>
                                <p className="mt-2 text-sm text-brand-200">Información completa y gestión del turno.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-md text-brand-200 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
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

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 shrink-0">
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
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
