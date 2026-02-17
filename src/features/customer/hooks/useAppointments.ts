import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Appointment, AppointmentStatus } from '@/types'

interface UseAppointmentsOptions {
    startDate?: Date;
    endDate?: Date;
    statuses?: AppointmentStatus[];
    page?: number;
    limit?: number;
}

export function useAppointments({ startDate, endDate, statuses, page = 1, limit = 50 }: UseAppointmentsOptions = {}) {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())

    const statusesKey = statuses?.join(",") ?? "";
    const startDateKey = startDate?.toISOString() ?? "";
    const endDateKey = endDate?.toISOString() ?? "";

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            let query = supabase
                .from("appointments")
                .select("*, profiles(full_name)")
                .eq("user_id", user.id)
                .order("date", { ascending: false })

            if (startDate) {
                query = query.gte("date", startDate.toISOString());
            }
            if (endDate) {
                query = query.lte("date", endDate.toISOString());
            }

            if (statuses && statuses.length > 0) {
                query = query.in("status", statuses);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            if (page > 0 && limit > 0) {
                query = query.range(from, to);
            }

            const { data, error } = await query

            if (!error && data) {
                setAppointments(data as Appointment[])
                setError(null)
            }
        } catch (err) {
            console.error(err)
            setError("Error loading appointments")
        } finally {
            setLoading(false)
        }
    }, [supabase, startDateKey, endDateKey, statusesKey, page, limit])

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    return { appointments, loading, error, refetch: fetchAppointments }
}
