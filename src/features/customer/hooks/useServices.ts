import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Service } from '@/types'

export function useServices() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())

    const fetchServices = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("services")
                .select("*")
                .eq('is_active', true)
                .order("sort_order", { ascending: true })

            if (error) throw error

            setServices(data || [])
        } catch (err) {
            console.error(err)
            setError("Error loading services")
        } finally {
            setLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchServices()
    }, [fetchServices])

    return { services, loading, error, refetch: fetchServices }
}
