import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Appointment, AppointmentStatus } from '@/types'
import { useRefresh } from '@/providers/AdminUIProvider'


interface UseAppointmentsOptions {
    isAdmin?: boolean;
    startDate?: Date;
    endDate?: Date;
    searchQuery?: string;
    statuses?: AppointmentStatus[];
    page?: number;
    limit?: number;
}

export function useAppointments({ isAdmin = false, startDate, endDate, searchQuery, statuses, page = 1, limit = 50 }: UseAppointmentsOptions = {}) {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [count, setCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())
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

            if (!isAdmin) {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    setLoading(false)
                    return
                }
                query = query.eq("user_id", user.id).order("created_at", { ascending: false })
            }

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
            setError("Error al cargar los turnos")
        } finally {
            setLoading(false)
        }
    }, [supabase, isAdmin, startDateKey, endDateKey, searchQuery, statusesKey, page, limit, refreshTrigger])

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
                description: `Estado cambiado a ${newStatus}`
            }
        ]);

        if (logError) console.error("Error logging:", logError);

        return { success: true };
    };

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    useEffect(() => {
        const channel = supabase
            .channel('appointments-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'appointments',
                },
                (payload) => {
                    console.log('Realtime Payload Received:', payload);
                    const updatedAppointment = payload.new as Appointment;
                    if (!updatedAppointment || updatedAppointment.id === undefined || updatedAppointment.id === null) {
                        console.warn('Realtime update received without a valid appointment ID:', payload);
                        return;
                    }
                    console.log('Updating appointment:', updatedAppointment.id, 'New Status:', updatedAppointment.status);

                    setAppointments((prev) => {
                        return prev.map((app) =>
                            app.id == updatedAppointment.id
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
