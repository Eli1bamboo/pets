import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Appointment } from '@/types'

export function useAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchAppointments = useCallback(async () => {
        try {
            // No strict need to set loading true on refetch if we want to keep data visible, 
            // but for consistency with initial load let's keep it or make it optional. 
            // The original code set loading false at the end.
            // Let's only set loading true if it was explicitly asked or rely on initial state.
            // Actually, usually refetching shouldn't blank the screen. 
            // But let's stick to the original logic flavor but optimized.

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from("appointments")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (!error && data) {
                // Supabase returns data as any[] usually unless typed, casting is fine here as we did before
                setAppointments(data as unknown as Appointment[])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    return { appointments, loading, refetch: fetchAppointments }
}
