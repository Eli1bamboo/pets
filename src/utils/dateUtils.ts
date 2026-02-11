
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export interface WeekDay {
    dateStr: string;
    dayName: string;
    dayNumber: string;
    fullDate: Date;
}

export const getWeekRange = (dateStr?: string | null) => {
    const date = dateStr && isValid(parseISO(dateStr)) ? parseISO(dateStr) : new Date();
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    end.setHours(23, 59, 59, 999);

    return { start, end, current: date };
};

export const formatWeekRange = (start: Date, end: Date) => {
    const startFormat = format(start, "d 'de' MMMM", { locale: es });
    const endFormat = format(end, "d 'de' MMMM", { locale: es });
    return `${startFormat} - ${endFormat}`;
};

export const getNextWeek = (date: Date) => format(addWeeks(date, 1), 'yyyy-MM-dd');
export const getPrevWeek = (date: Date) => format(subWeeks(date, 1), 'yyyy-MM-dd');
export const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');

export const getWeekDates = (): WeekDay[] => {
    const { start } = getWeekRange();
    return Array.from({ length: 7 }, (_, i) => {
        const d = addWeeks(start, 0);
        d.setDate(start.getDate() + i);
        return {
            dateStr: format(d, 'yyyy-MM-dd'),
            dayName: format(d, 'eee', { locale: es }),
            dayNumber: format(d, 'd'),
            fullDate: d
        };
    });
};
