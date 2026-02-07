"use client";

import { useState, useEffect } from "react";
import { useBusinessHours } from "@/hooks/useBusinessHours";
import { Save, Calendar } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { BusinessHours } from "@/types";
import { useSidebar } from "@/hooks/useSidebar";
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/molecules/SidebarSheet";

const DAYS_NAMES = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
];

export default function SettingsSidebar() {
    const { closeSidebar } = useSidebar();
    const { businessHours, loading: settingsLoading, saveSettings } = useBusinessHours();
    const [localHours, setLocalHours] = useState<BusinessHours[]>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial load effect to sync state
    useEffect(() => {
        if (businessHours.length > 0) {
            setLocalHours(businessHours);
        }
    }, [businessHours]);

    const handleClose = () => {
        // Reset local changes to last saved state
        if (businessHours.length > 0) {
            setLocalHours(businessHours);
        }
        closeSidebar();
    };

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
            // Optional: Close after success? User might want to keep editing.
        } else {
            setMessage({ type: 'error', text: 'Error al guardar: ' + (error as any).message });
        }
    };

    return (
        <div className="h-full flex flex-col">
            <SheetHeader className="mb-6">
                <SheetTitle>Configuración del Sitio</SheetTitle>
                <SheetDescription>
                    Define los días y horarios de atención.
                </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto space-y-6">
                {message && (
                    <div className={`p-4 rounded-lg border text-sm font-medium ${message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2 text-gray-900 font-bold text-sm">
                        <Calendar className="text-brand-600" size={16} />
                        Horarios Disponibles
                    </div>
                    <div className="divide-y divide-gray-100">
                        {settingsLoading ? (
                            <div className="p-8 text-center text-brand-400 text-sm">Cargando horarios...</div>
                        ) : (
                            localHours.map((bh) => (
                                <div key={bh.id} className={`p-4 flex flex-col gap-3 transition-colors ${!bh.is_active ? 'bg-gray-50' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <span className={`font-bold ${bh.is_active ? 'text-brand-900' : 'text-gray-500'}`}>
                                            {DAYS_NAMES[bh.day_of_week]}
                                        </span>
                                        <button
                                            onClick={() => handleToggle(bh.id)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 ${bh.is_active ? 'bg-brand-600' : 'bg-gray-200'}`}
                                        >
                                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${bh.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {bh.is_active && (
                                        <div className="grid grid-cols-2 gap-3 pl-1">
                                            <div className="space-y-1">
                                                <label className="text-xs text-brand-500 font-bold uppercase">Abre</label>
                                                <input
                                                    type="time"
                                                    value={bh.open_time.substring(0, 5)}
                                                    onChange={(e) => handleTimeChange(bh.id, 'open_time', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-200 text-sm focus:border-brand-500 focus:ring-brand-500 py-1.5"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-brand-500 font-bold uppercase">Cierra</label>
                                                <input
                                                    type="time"
                                                    value={bh.close_time.substring(0, 5)}
                                                    onChange={(e) => handleTimeChange(bh.id, 'close_time', e.target.value)}
                                                    className="block w-full rounded-lg border-gray-200 text-sm focus:border-brand-500 focus:ring-brand-500 py-1.5"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                <Button
                    variant="outline"
                    onClick={handleClose}
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
        </div>
    );
}
