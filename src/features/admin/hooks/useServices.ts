import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Service } from '@/types'
import { useRefresh } from '@/providers/AdminUIProvider'

interface UseServicesOptions {
    includeInactive?: boolean;
}

export function useServices({ includeInactive = true }: UseServicesOptions = {}) {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [supabase] = useState(() => createClient())

    // Admin context integration
    const { refreshTrigger } = useRefresh();

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("services")
                .select("*")
                .order("sort_order", { ascending: true })

            if (!includeInactive) {
                query = query.eq('is_active', true)
            }

            const { data, error } = await query

            if (error) throw error

            setServices(data || [])
        } catch (err) {
            console.error(err)
            setError("Error al cargar servicios")
        } finally {
            setLoading(false)
        }
    }, [supabase, includeInactive, refreshTrigger])

    const createService = async (service: Omit<Service, "id" | "created_at" | "updated_at">) => {
        try {
            const { error } = await supabase.from("services").insert(service)
            if (error) throw error
            await fetchServices()
            return { success: true }
        } catch (error) {
            console.error("Error creating service:", error)
            return { success: false, error }
        }
    }

    const updateService = async (id: number, updates: Partial<Service>) => {
        try {
            const { error } = await supabase.from("services").update(updates).eq("id", id)
            if (error) throw error
            await fetchServices()
            return { success: true }
        } catch (error) {
            console.error("Error updating service:", error)
            return { success: false, error }
        }
    }

    const deleteService = async (id: number) => {
        try {
            const { error } = await supabase.from("services").delete().eq("id", id)
            if (error) throw error
            await fetchServices()
            return { success: true }
        } catch (error) {
            console.error("Error deleting service:", error)
            return { success: false, error }
        }
    }

    useEffect(() => {
        fetchServices()
    }, [fetchServices])

    return { services, loading, error, refetch: fetchServices, createService, updateService, deleteService }
}
