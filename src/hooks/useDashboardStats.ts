import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
    completedMonth: number;
    pendingTotal: number;
    totalRevenue: number;
    nextAppointment: any;
}

export function useDashboardStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        completedMonth: 0,
        pendingTotal: 0,
        totalRevenue: 0,
        nextAppointment: null
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchStats = useCallback(async () => {
        if (!user) return;

        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const { count: completedCount } = await supabase
                .from("appointments")
                .select("*", { count: 'exact', head: true })
                .eq("status", "completed")
                .gte("date", startOfMonth.toISOString());

            const { count: pendingCount } = await supabase
                .from("appointments")
                .select("*", { count: 'exact', head: true })
                .in("status", ["pending", "washing", "drying", "ready"]);

            const { data: nextApt } = await supabase
                .from("appointments")
                .select("*")
                .in("status", ["pending", "washing"])
                .gte("date", new Date().toISOString())
                .order("date", { ascending: true })
                .limit(1)
                .single();

            setStats({
                completedMonth: completedCount || 0,
                pendingTotal: pendingCount || 0,
                totalRevenue: (completedCount || 0) * 4500,
                nextAppointment: nextApt
            });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, refetch: fetchStats };
}
