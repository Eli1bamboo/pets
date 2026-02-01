import React from 'react';
import { Button } from '../atoms/Button';
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
            <div className="flex items-center gap-2 text-brand-900 font-medium">
                <CalendarIcon className="h-5 w-5 text-brand-600" />
                <span>Selecciona una fecha</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((day) => {
                    const isSelected = selectedDate === day.dateStr;
                    return (
                        <button
                            key={day.dateStr}
                            onClick={() => onSelect(day.dateStr)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${isSelected
                                    ? 'bg-brand-600 text-white border-brand-600 ring-2 ring-brand-200'
                                    : 'bg-white text-brand-700 border-brand-200 hover:border-brand-300 hover:bg-brand-50'
                                }`}
                        >
                            <span className="text-xs uppercase font-semibold opacity-80">{day.dayName}</span>
                            <span className="text-lg font-bold">{day.dayNumber}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
