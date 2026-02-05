import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Appointment, AppointmentStatus } from '@/types'


interface UseAppointmentsOptions {
    isAdmin?: boolean;
    startDate?: Date;
    endDate?: Date;
}

export function useAppointments({ isAdmin = false, startDate, endDate }: UseAppointmentsOptions = {}) {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [supabase] = useState(() => createClient())

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("appointments")
                .select("*, profiles(full_name)")
                .order("date", { ascending: true })

            if (!isAdmin) {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    setLoading(false)
                    return
                }
                query = query.eq("user_id", user.id).order("created_at", { ascending: false })
            }

            // Apply Date Filters if provided
            if (startDate) {
                query = query.gte("date", startDate.toISOString());
            }
            if (endDate) {
                query = query.lte("date", endDate.toISOString());
            }

            const { data, error } = await query

            if (!error && data) {
                setAppointments(data as unknown as Appointment[])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [supabase, isAdmin, startDate?.toISOString(), endDate?.toISOString()]) // Dependencies use primitive strings to avoid loops

    const updateStatus = async (id: number, newStatus: AppointmentStatus) => {
        // Optimistic update
        setAppointments(prev => prev.map(app =>
            app.id === id ? { ...app, status: newStatus } : app
        ));

        const { error } = await supabase
            .from("appointments")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            console.error("Error updating status:", error);
            // Revert on error
            fetchAppointments();
            return { success: false, error };
        }

        return { success: true };
    };

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    return { appointments, loading, refetch: fetchAppointments, updateStatus }
}
