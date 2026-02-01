import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useCancelAppointment() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const cancelAppointment = async (id: number): Promise<boolean> => {
        if (!confirm("¿Estás seguro de que quieres cancelar este turno?")) return false

        setLoading(true)
        const { error } = await supabase
            .from("appointments")
            .update({ status: "cancelled" })
            .eq("id", id)

        setLoading(false)

        if (error) {
            alert("Error al cancelar: " + error.message)
            return false
        }
        return true
    }

    return { cancelAppointment, isCancelling: loading }
}
