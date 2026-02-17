import React from 'react';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { getWeekDates, getTodayStr } from '@/utils/dateUtils';
import { useBusinessHours } from '@/hooks/useBusinessHours';
import { useWeeklyAvailability } from '@/hooks/useWeeklyAvailability';
import { motion } from 'framer-motion';

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
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-brand-900 font-bold uppercase tracking-wider text-sm">
                    <div className="p-2 bg-brand-100 rounded-lg text-primary-orange">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <span>Elegí una fecha</span>
                </div>
                <span className="text-xs font-medium text-brand-500 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">Semana Actual</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {days.map((day, idx) => {
                    const isSelected = selectedDate === day.dateStr;
                    const isPast = day.dateStr < todayStr;
                    const closed = isDayClosed(day.fullDate.getDay());
                    const isFull = fullDays.includes(day.dateStr);
                    const isDisabled = isPast || closed || isFull;

                    return (
                        <motion.button
                            key={day.dateStr}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            disabled={isDisabled}
                            onClick={() => !isDisabled && onSelect(day.dateStr)}
                            className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-200 group overflow-hidden ${isSelected
                                ? 'bg-brand-900 text-white border-brand-900 shadow-xl shadow-brand-900/20 scale-105 z-10'
                                : isDisabled
                                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                    : 'bg-white text-brand-700 border-brand-100 hover:border-primary-orange hover:shadow-md hover:-translate-y-1'
                                }`}
                        >
                            <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isSelected ? 'text-brand-300' : 'text-brand-400'}`}>{day.dayName}</span>
                            <span className="text-xl sm:text-2xl font-black">{day.dayNumber}</span>

                            {/* Status Indicators */}
                            <div className="mt-2 h-4 flex items-center justify-center">
                                {closed && !isPast && (
                                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-tight bg-red-50 px-1.5 py-0.5 rounded">Cerrado</span>
                                )}
                                {!closed && isFull && !isPast && (
                                    <span className="text-[9px] font-bold text-orange-400 uppercase tracking-tight bg-orange-50 px-1.5 py-0.5 rounded">Lleno</span>
                                )}
                                {!isDisabled && !isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                                {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-orange" />
                                )}
                            </div>

                            {/* Selection Effect */}
                            {isSelected && (
                                <motion.div
                                    layoutId="selectedDate"
                                    className="absolute inset-0 border-2 border-primary-orange rounded-2xl pointer-events-none"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
