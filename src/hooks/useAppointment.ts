import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Appointment } from "@/types";

export function useAppointment(id?: number) {
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(false);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (!id) return;

        const fetchAppointment = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("appointments")
                .select("*, profiles(full_name)")
                .eq("id", id)
                .single();

            if (!error && data) {
                setAppointment(data as unknown as Appointment);
            }
            setLoading(false);
        };

        fetchAppointment();

        const channel = supabase
            .channel(`appointment-${id}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "appointments",
                    filter: `id=eq.${id}`,
                },
                (payload) => {
                    const updated = payload.new as Appointment;
                    setAppointment((prev) => {
                        if (!prev) return updated;
                        return { ...prev, ...updated };
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, supabase]);

    return { appointment, loading };
}
