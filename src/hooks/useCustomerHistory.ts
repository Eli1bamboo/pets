import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Appointment } from "@/types";
import { User } from "@supabase/supabase-js";

export function useCustomerHistory(user: User | null) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    const fetchAppointments = useCallback(async () => {
        if (!user) return;

        try {
            const { data } = await supabase
                .from("appointments")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: false });

            if (data) setAppointments(data as Appointment[]);
            setError(null);
        } catch (err) {
            console.error("Error fetching customer history:", err);
            setError("Error al cargar el historial");
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [fetchAppointments, user]);

    return { appointments, loading, error, refetch: fetchAppointments };
}
