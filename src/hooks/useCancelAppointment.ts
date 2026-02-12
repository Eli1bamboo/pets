import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useCancelAppointment() {
    const [loading, setLoading] = useState(false)
    const [supabase] = useState(() => createClient())

    const cancelAppointment = async (id: number): Promise<{ success: boolean; error?: string }> => {
        setLoading(true)
        const { error } = await supabase
            .from("appointments")
            .update({ status: "cancelled" })
            .eq("id", id)

        setLoading(false)

        if (error) {
            return { success: false, error: error.message }
        }
        return { success: true }
    }

    return { cancelAppointment, isCancelling: loading }
}
