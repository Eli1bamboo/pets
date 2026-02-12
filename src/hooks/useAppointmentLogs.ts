import { createClient } from "@/utils/supabase/client";
import { useState, useCallback, useEffect } from "react";
import { AppointmentLog } from "@/types";

export function useAppointmentLogs(appointmentId?: number) {
    const [logs, setLogs] = useState<AppointmentLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [supabase] = useState(() => createClient());

    const fetchLogs = useCallback(async () => {
        if (!appointmentId) return;
        setLoading(true);
        const { data, error } = await supabase
            .from("appointment_logs")
            .select("*")
            .eq("appointment_id", appointmentId)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setLogs(data as AppointmentLog[]);
        }
        setLoading(false);
    }, [appointmentId, supabase]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        if (!appointmentId) return;

        const channel = supabase
            .channel(`logs-${appointmentId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "appointment_logs",
                    filter: `appointment_id=eq.${appointmentId}`,
                },
                (payload) => {
                    setLogs((prev) => [payload.new as AppointmentLog, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [appointmentId, supabase]);

    const addLog = async (description: string) => {
        if (!appointmentId) return;
        await supabase.from("appointment_logs").insert([
            { appointment_id: appointmentId, description }
        ]);
    };

    return { logs, loading, fetchLogs, addLog };
}
