import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSelectorProps {
    selectedTime: string;
    onSelect: (time: string) => void;
    busySlots: string[];
    availableHours: string[];
    loading?: boolean;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTime, onSelect, busySlots, availableHours, loading }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-900 font-medium">
                <Clock className="h-5 w-5 text-brand-600" />
                <span>Selecciona una hora</span>
            </div>

            {loading ? (
                <div className="text-sm text-brand-500 animate-pulse">Cargando disponibilidad...</div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {availableHours.length === 0 ? (
                        <div className="col-span-full text-sm text-red-500 italic p-4 bg-red-50 rounded-lg text-center">
                            No hay turnos disponibles para este día.
                        </div>
                    ) : (
                        availableHours.map((time) => {
                            const isBusy = busySlots.some(slot => slot.startsWith(time));
                            const isSelected = selectedTime === time;

                            return (
                                <button
                                    key={time}
                                    onClick={() => !isBusy && onSelect(time)}
                                    disabled={isBusy}
                                    className={`py-2 px-3 rounded-md text-sm font-semibold transition-all border ${isBusy
                                        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed decoration-slice'
                                        : isSelected
                                            ? 'bg-brand-600 text-white border-brand-600 ring-2 ring-brand-200'
                                            : 'bg-white text-brand-700 border-brand-200 hover:border-brand-300 hover:bg-brand-50'
                                        }`}
                                >
                                    {time}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
