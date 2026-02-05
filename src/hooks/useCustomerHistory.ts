import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Appointment } from "@/types";
import { User } from "@supabase/supabase-js";

export function useCustomerHistory(user: User | null) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchAppointments = useCallback(async () => {
        if (!user) return;

        try {
            const { data } = await supabase
                .from("appointments")
                .select("*")
                .eq("user_id", user.id)
                .order("date", { ascending: false });

            if (data) setAppointments(data as Appointment[]);
        } catch (error) {
            console.error("Error fetching customer history:", error);
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [fetchAppointments, user]);

    return { appointments, loading, refetch: fetchAppointments };
}
