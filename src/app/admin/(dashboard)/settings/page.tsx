"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { ArrowLeft, Save, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { BusinessHours } from "@/types";
import { AdminLoader } from "@/components/molecules/AdminLoader";

const DAYS_NAMES = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
];

export default function AdminSettingsPage() {
    const { loading: authLoading } = useAuth({ redirectToLogin: true });
    const { businessHours, loading: settingsLoading, saveSettings } = useBusinessHours();
    const [localHours, setLocalHours] = useState<BusinessHours[]>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (businessHours.length > 0) {
            setLocalHours(businessHours);
        }
    }, [businessHours]);

    const handleToggle = (id: number) => {
        setLocalHours(prev => prev.map(bh =>
            bh.id === id ? { ...bh, is_active: !bh.is_active } : bh
        ));
    };

    const handleTimeChange = (id: number, field: 'open_time' | 'close_time', value: string) => {
        setLocalHours(prev => prev.map(bh =>
            bh.id === id ? { ...bh, [field]: value } : bh
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        const { success, error } = await saveSettings(localHours);
        setSaving(false);

        if (success) {
            setMessage({ type: 'success', text: 'Configuración guardada correctamente.' });
        } else {
            setMessage({ type: 'error', text: 'Error al guardar: ' + (error as any).message });
        }
    };

    if (authLoading || settingsLoading) {
        return <AdminLoader message="Cargando configuración..." />;
    }

    return (
        <div className="bg-brand-50 min-h-screen py-10">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-brand-100 rounded-full transition-colors text-brand-600">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-900">Configuración del Sitio</h1>
                            <p className="text-brand-600">Define los días y horarios de atención.</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} isLoading={saving} className="flex items-center gap-2">
                        <Save size={18} />
                        Guardar Cambios
                    </Button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden ring-1 ring-brand-900/5">
                    <div className="px-6 py-6 border-b border-brand-100 flex items-center gap-2 text-brand-900 font-semibold">
                        <Calendar className="text-brand-600" size={20} />
                        Horarios Disponibles
                    </div>
                    <div className="divide-y divide-brand-100">
                        {localHours.map((bh) => (
                            <div key={bh.id} className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${!bh.is_active ? 'bg-gray-50' : ''}`}>
                                <div className="flex items-center gap-4 min-w-[150px]">
                                    <button
                                        onClick={() => handleToggle(bh.id)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 ${bh.is_active ? 'bg-brand-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${bh.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                    <span className={`font-medium ${bh.is_active ? 'text-brand-900' : 'text-gray-500'}`}>
                                        {DAYS_NAMES[bh.day_of_week]}
                                    </span>
                                </div>

                                {bh.is_active ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-brand-500 font-medium uppercase">Desde</span>
                                            <input
                                                type="time"
                                                value={bh.open_time.substring(0, 5)}
                                                onChange={(e) => handleTimeChange(bh.id, 'open_time', e.target.value)}
                                                className="block w-full rounded-md border-0 py-1.5 text-brand-900 ring-1 ring-inset ring-brand-300 focus:ring-2 focus:ring-brand-600 sm:text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-brand-500 font-medium uppercase">Hasta</span>
                                            <input
                                                type="time"
                                                value={bh.close_time.substring(0, 5)}
                                                onChange={(e) => handleTimeChange(bh.id, 'close_time', e.target.value)}
                                                className="block w-full rounded-md border-0 py-1.5 text-brand-900 ring-1 ring-inset ring-brand-300 focus:ring-2 focus:ring-brand-600 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Cerrado</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
