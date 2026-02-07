
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getWeekDates } from '@/utils/dateUtils';

export function useWeeklyAvailability() {
    const [fullDays, setFullDays] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const days = getWeekDates();

    useEffect(() => {
        const fetchWeeklyStatus = async () => {
            setLoading(true);
            const startStr = days[0].dateStr + 'T00:00:00';
            const endStr = days[6].dateStr + 'T23:59:59';

            const { data: appointments, error: appError } = await supabase
                .from('appointments')
                .select('date')
                .gte('date', new Date(startStr).toISOString())
                .lte('date', new Date(endStr).toISOString())
                .neq('status', 'cancelled');

            const { data: hours, error: hoursError } = await supabase
                .from('business_hours')
                .select('*');

            if (appError || hoursError || !appointments || !hours) {
                setLoading(false);
                return;
            }

            const full: string[] = [];

            days.forEach(day => {
                const dayOfWeek = day.fullDate.getDay();
                const config = hours.find(h => h.day_of_week === dayOfWeek);

                if (config && config.is_active) {
                    const startH = parseInt(config.open_time.split(':')[0]);
                    const endH = parseInt(config.close_time.split(':')[0]);
                    const maxCapacity = endH - startH;

                    const dayAppointments = appointments.filter(app => {
                        const appDate = new Date(app.date).toISOString().split('T')[0];
                        return appDate === day.dateStr;
                    });

                    if (dayAppointments.length >= maxCapacity) {
                        full.push(day.dateStr);
                    }
                }
            });

            setFullDays(full);
            setLoading(false);
        };

        fetchWeeklyStatus();
    }, [supabase]);

    return { fullDays, loading };
}
