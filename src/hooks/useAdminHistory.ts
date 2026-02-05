import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export function useAdminHistory(isAdmin: boolean) {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchAllAppointments = useCallback(async () => {
        if (!isAdmin) return;

        try {
            const { data } = await supabase
                .from("appointments")
                .select(`
                    *,
                    profiles (
                        full_name
                    )
                `)
                .order("date", { ascending: false });

            if (data) setAppointments(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    }, [isAdmin, supabase]);

    useEffect(() => {
        fetchAllAppointments();
    }, [fetchAllAppointments]);

    return { appointments, loading, refetch: fetchAllAppointments };
}
