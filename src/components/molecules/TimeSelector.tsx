import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeSelectorProps {
    selectedTime: string;
    onSelect: (time: string) => void;
    busySlots: string[];
    availableHours: string[];
    loading?: boolean;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ selectedTime, onSelect, busySlots, availableHours, loading }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-900 font-bold uppercase tracking-wider text-sm mb-6">
                <div className="p-2 bg-brand-100 rounded-lg text-primary-orange">
                    <Clock className="h-5 w-5" />
                </div>
                <span>Elegí una hora</span>
            </div>

            {loading ? (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {availableHours.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-100 text-center">
                            <span className="text-2xl mb-2">😔</span>
                            <p className="text-brand-900 font-bold">No hay turnos disponibles</p>
                            <p className="text-sm text-brand-600">Por favor, seleccioná otra fecha.</p>
                        </div>
                    ) : (
                        availableHours.map((time, idx) => {
                            const isBusy = busySlots.some(slot => slot.startsWith(time));
                            const isSelected = selectedTime === time;

                            return (
                                <motion.button
                                    key={time}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    onClick={() => !isBusy && onSelect(time)}
                                    disabled={isBusy}
                                    className={`py-3 px-4 rounded-xl text-base font-bold transition-all duration-200 border relative overflow-hidden group ${isBusy
                                        ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice'
                                        : isSelected
                                            ? 'bg-brand-900 text-white border-brand-900 shadow-lg shadow-brand-900/20 scale-105 z-10'
                                            : 'bg-white text-brand-700 border-brand-100 hover:border-primary-orange hover:shadow-md hover:-translate-y-0.5'
                                        }`}
                                >
                                    {isBusy && <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-px bg-gray-300 rotate-12"></div>
                                    </div>}
                                    <span className="relative z-10">{time}</span>
                                </motion.button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
