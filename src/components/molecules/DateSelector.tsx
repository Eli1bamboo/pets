import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DateSelectorProps {
    selectedDate: string;
    onSelect: (date: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelect }) => {
    // Generate next 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            dateStr: d.toISOString().split('T')[0], // YYYY-MM-DD
            dayName: d.toLocaleDateString('es-ES', { weekday: 'short' }),
            dayNumber: d.getDate(),
            fullDate: d
        };
    });

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-900 font-black uppercase tracking-wider text-sm mb-4">
                <CalendarIcon className="h-5 w-5 text-primary-orange" />
                <span>Elegí una fecha</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {days.map((day) => {
                    const isSelected = selectedDate === day.dateStr;
                    return (
                        <button
                            key={day.dateStr}
                            onClick={() => onSelect(day.dateStr)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${isSelected
                                ? 'bg-primary-orange text-white border-primary-orange shadow-lg scale-105'
                                : 'bg-white text-brand-700 border-brand-900/5 hover:border-soft-peach hover:bg-soft-peach/5'
                                }`}
                        >
                            <span className="text-[10px] uppercase font-black tracking-widest mb-1">{day.dayName}</span>
                            <span className="text-xl font-black">{day.dayNumber}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
