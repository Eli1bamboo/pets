import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { getWeekDates, getTodayStr } from '@/utils/dateUtils';
import { useBusinessHours } from '@/hooks/useBusinessHours';
import { useWeeklyAvailability } from '@/hooks/useWeeklyAvailability';

interface DateSelectorProps {
    selectedDate: string;
    onSelect: (date: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onSelect }) => {
    const { businessHours } = useBusinessHours();
    const { fullDays } = useWeeklyAvailability();
    const todayStr = getTodayStr();
    const days = getWeekDates();

    const isDayClosed = (dayOfWeek: number) => {
        const hour = businessHours.find(bh => bh.day_of_week === dayOfWeek);
        return hour ? !hour.is_active : false;
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-brand-900 font-black uppercase tracking-wider text-sm mb-4">
                <CalendarIcon className="h-5 w-5 text-primary-orange" />
                <span>Elegí una fecha (Semana Actual)</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {days.map((day: any) => {
                    const isSelected = selectedDate === day.dateStr;
                    const isPast = day.dateStr < todayStr;
                    const closed = isDayClosed(day.fullDate.getDay());
                    const isFull = fullDays.includes(day.dateStr);
                    const isDisabled = isPast || closed || isFull;

                    return (
                        <button
                            key={day.dateStr}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onSelect(day.dateStr)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${isSelected
                                ? 'bg-primary-orange text-white border-primary-orange shadow-lg scale-105'
                                : isDisabled
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-brand-700 border-brand-900/5 hover:border-soft-peach hover:bg-soft-peach/5'
                                }`}
                        >
                            <span className="text-[10px] uppercase font-black tracking-widest mb-1">{day.dayName}</span>
                            <span className="text-xl font-black">{day.dayNumber}</span>
                            {closed && !isPast && (
                                <span className="text-[8px] font-bold text-red-300 mt-1 uppercase">Cerrado</span>
                            )}
                            {!closed && isFull && !isPast && (
                                <span className="text-[8px] font-bold text-orange-400 mt-1 uppercase">Completo</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
