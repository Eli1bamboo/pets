import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useAppointmentStatus(appointmentId: number | string) {
    const [status, setStatus] = useState<string>("pending");
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (!appointmentId) return;

        const fetchStatus = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("appointments")
                .select("status")
                .eq("id", appointmentId)
                .single();

            if (!error && data) {
                setStatus(data.status);
            }
            setLoading(false);
        };

        fetchStatus();

        const channel = supabase
            .channel("appointment-status")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "appointments",
                    filter: `id=eq.${appointmentId}`,
                },
                (payload: any) => {
                    setStatus(payload.new.status);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [appointmentId, supabase]);

    return { status, loading };
}
