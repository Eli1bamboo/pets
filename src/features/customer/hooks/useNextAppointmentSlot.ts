import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useNextAppointmentSlot() {
    const [nextSlot, setNextSlot] = useState<{ date: string; time: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        let isMounted = true;

        const findNextSlot = async () => {
            setLoading(true);
            const now = new Date();

            // Check the next 7 days
            for (let i = 0; i < 7; i++) {
                const targetDate = new Date(now);
                targetDate.setDate(now.getDate() + i);

                const dateStr = targetDate.toISOString().split('T')[0];
                const dayOfWeek = targetDate.getDay();

                // 1. Get business hours for this day
                const { data: hoursData, error: hoursError } = await supabase
                    .from('business_hours')
                    .select('*')
                    .eq('day_of_week', dayOfWeek)
                    .single();

                if (hoursError || !hoursData || !hoursData.is_active) {
                    continue; // Skip this day, closed
                }

                // 2. Determine potential slots bounds
                const start = parseInt(hoursData.open_time.split(':')[0]);
                const end = parseInt(hoursData.close_time.split(':')[0]);
                const currentHour = now.getHours();
                const isToday = i === 0;

                const potentialSlots = [];
                for (let h = start; h < end; h++) {
                    if (isToday && h <= currentHour) continue;
                    potentialSlots.push(`${h.toString().padStart(2, '0')}:00`);
                }

                if (potentialSlots.length === 0) continue; // No hours left today

                // 3. Fetch scheduled appointments for this day
                const startOfDay = new Date(`${dateStr}T00:00:00`).toISOString();
                const endOfDay = new Date(`${dateStr}T23:59:59`).toISOString();

                const { data: appointments } = await supabase
                    .from("appointments")
                    .select("date")
                    .gte("date", startOfDay)
                    .lte("date", endOfDay)
                    .neq("status", "cancelled");

                const busyTimes = appointments?.map(app => {
                    const d = new Date(app.date);
                    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                }) || [];

                // 4. Find the first potential slot that isn't busy
                const availableSlot = potentialSlots.find(slot => !busyTimes.includes(slot));

                if (availableSlot && isMounted) {
                    setNextSlot({ date: dateStr, time: availableSlot });
                    setLoading(false);
                    return; // Found our slot!
                }
            }

            if (isMounted) {
                setNextSlot(null); // No availability found in 7 days
                setLoading(false);
            }
        };

        findNextSlot();

        return () => {
            isMounted = false;
        };
    }, [supabase]);

    return { nextSlot, loading };
}
