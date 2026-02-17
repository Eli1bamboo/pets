import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Appointment } from '@/types';

export function useAppointmentStatus(appointmentId: number | string) {
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [status, setStatus] = useState<string>("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (!appointmentId) return;

        const fetchStatus = async () => {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from("appointments")
                .select("*")
                .eq("id", appointmentId)
                .single();

            if (error) {
                console.error("Error fetching appointment:", error);
                setError("Turno no encontrado");
                setAppointment(null);
            } else if (data) {
                setAppointment(data as Appointment);
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
                (payload) => {
                    const updated = payload.new as Appointment;
                    setStatus(updated.status);
                    setAppointment((prev) => prev ? { ...prev, status: updated.status } : null);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [appointmentId, supabase]);

    return { status, appointment, loading, error };
}
