import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Appointment, AppointmentStatus } from '@/types'
import { useRefresh } from '@/providers/AdminUIProvider'

interface UseAppointmentsOptions {
    startDate?: Date;
    endDate?: Date;
    searchQuery?: string;
    statuses?: AppointmentStatus[];
    page?: number;
    limit?: number;
    refreshTrigger?: number;
}

export function useAppointments({ startDate, endDate, searchQuery, statuses, page = 1, limit = 50 }: UseAppointmentsOptions = {}) {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [count, setCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())

    // Admin context integration for automatic refreshing
    const { refreshTrigger } = useRefresh();

    const statusesKey = statuses?.join(",") ?? "";
    const startDateKey = startDate?.toISOString() ?? "";
    const endDateKey = endDate?.toISOString() ?? "";

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("appointments")
                .select("*, profiles(full_name)", { count: 'exact' })
                .order("date", { ascending: true })

            if (startDate) {
                query = query.gte("date", startDate.toISOString());
            }
            if (endDate) {
                query = query.lte("date", endDate.toISOString());
            }

            if (statuses && statuses.length > 0) {
                query = query.in("status", statuses);
            }

            if (searchQuery) {
                query = query.ilike('pet_name', `%${searchQuery}%`);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            if (page > 0 && limit > 0) {
                query = query.range(from, to);
            }

            const { data, error, count: totalCount } = await query

            if (!error && data) {
                setAppointments(data as Appointment[])
                if (totalCount !== null) setCount(totalCount);
                setError(null)
            }
        } catch (err) {
            console.error(err)
            setError("Error loading appointments")
        } finally {
            setLoading(false)
        }
    }, [supabase, startDateKey, endDateKey, searchQuery, statusesKey, page, limit, refreshTrigger])

    const updateStatus = async (id: number, newStatus: AppointmentStatus) => {
        setAppointments(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));

        const { error } = await supabase
            .from("appointments")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            console.error("Error updating status:", error);
            fetchAppointments();
            return { success: false, error };
        }

        const { error: logError } = await supabase.from("appointment_logs").insert([
            {
                appointment_id: id,
                description: `Status changed to ${newStatus}`
            }
        ]);

        if (logError) console.error("Error logging:", logError);

        return { success: true };
    };

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    // Real-time updates for Admin
    useEffect(() => {
        const channel = supabase
            .channel('admin-appointments-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'appointments',
                },
                (payload) => {
                    const updatedAppointment = payload.new as Appointment;
                    if (!updatedAppointment?.id) return;

                    setAppointments((prev) => {
                        return prev.map((app) =>
                            app.id === updatedAppointment.id
                                ? { ...app, ...updatedAppointment }
                                : app
                        )
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return { appointments, count, loading, error, refetch: fetchAppointments, updateStatus }
}
