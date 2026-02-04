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
            <div className="flex items-center gap-2 text-brand-900 font-black uppercase tracking-wider text-sm mb-4">
                <Clock className="h-5 w-5 text-primary-orange" />
                <span>Elegí una hora</span>
            </div>

            {loading ? (
                <div className="flex justify-center p-4">
                    <div className="h-6 w-32 bg-brand-900/5 animate-pulse rounded-full"></div>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {availableHours.length === 0 ? (
                        <div className="col-span-full text-sm text-red-500 font-bold p-6 bg-red-50 rounded-[1.5rem] text-center border-2 border-red-100">
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
                                    className={`py-3 px-4 rounded-2xl text-base font-bold transition-all duration-200 border-2 ${isBusy
                                        ? 'bg-brand-900/5 text-brand-300 border-transparent cursor-not-allowed opacity-50'
                                        : isSelected
                                            ? 'bg-primary-orange text-white border-primary-orange shadow-lg scale-105'
                                            : 'bg-white text-brand-700 border-brand-900/5 hover:border-soft-peach hover:bg-soft-peach/5'
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
