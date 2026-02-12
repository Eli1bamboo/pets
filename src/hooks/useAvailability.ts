import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAvailability(date: string) {
    const [busySlots, setBusySlots] = useState<string[]>([]);
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (!date) return;

        const fetchAvailability = async () => {
            setLoading(true);
            const selectedDateObj = new Date(date + 'T12:00:00');

            const dayOfWeek = selectedDateObj.getDay();
            const { data: hoursData, error: hoursError } = await supabase
                .from('business_hours')
                .select('*')
                .eq('day_of_week', dayOfWeek)
                .single();

            if (hoursError || !hoursData || !hoursData.is_active) {
                setAvailableHours([]);
            } else {
                const slots = [];
                let start = parseInt(hoursData.open_time.split(':')[0]);
                let end = parseInt(hoursData.close_time.split(':')[0]);

                const now = new Date();
                const isToday = date === now.toISOString().split('T')[0];
                const currentHour = now.getHours();

                for (let h = start; h < end; h++) {
                    if (isToday && h <= currentHour) continue;
                    slots.push(`${h.toString().padStart(2, '0')}:00`);
                }
                setAvailableHours(slots);
            }

            const startOfDay = new Date(`${date}T00:00:00`).toISOString();
            const endOfDay = new Date(`${date}T23:59:59`).toISOString();

            const { data, error } = await supabase
                .from("appointments")
                .select("date")
                .gte("date", startOfDay)
                .lte("date", endOfDay)
                .neq("status", "cancelled");

            if (data && !error) {
                const times = data.map(app => {
                    const d = new Date(app.date);
                    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                });
                setBusySlots(times);
            }
            setLoading(false);
        };

        fetchAvailability();
    }, [date, supabase]);

    return { busySlots, availableHours, loading };
}
