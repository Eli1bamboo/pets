import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Service } from "@/types";

interface UseServicesOptions {
    includeInactive?: boolean;
}

export function useServices({ includeInactive = false }: UseServicesOptions = {}) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            let query = supabase
                .from("services")
                .select("*")
                .order("sort_order", { ascending: true });

            if (!includeInactive) {
                query = query.eq("is_active", true);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;
            setServices((data as Service[]) || []);
            setError(null);
        } catch (err) {
            console.error("[useServices] Error:", err);
            setError("Error loading services");
        } finally {
            setLoading(false);
        }
    }, [supabase, includeInactive]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const createService = async (data: Omit<Service, "id" | "created_at">) => {
        try {
            const { error: insertError } = await supabase
                .from("services")
                .insert(data);

            if (insertError) throw insertError;
            await fetchServices();
            return { success: true };
        } catch (err) {
            console.error("[useServices] Create error:", err);
            return { success: false, error: String(err) };
        }
    };

    const updateService = async (id: number, data: Partial<Omit<Service, "id" | "created_at">>) => {
        try {
            const { error: updateError } = await supabase
                .from("services")
                .update(data)
                .eq("id", id);

            if (updateError) throw updateError;
            await fetchServices();
            return { success: true };
        } catch (err) {
            console.error("[useServices] Update error:", err);
            return { success: false, error: String(err) };
        }
    };

    const deleteService = async (id: number) => {
        try {
            const { error: updateError } = await supabase
                .from("services")
                .update({ is_active: false })
                .eq("id", id);

            if (updateError) throw updateError;
            await fetchServices();
            return { success: true };
        } catch (err) {
            console.error("[useServices] Delete error:", err);
            return { success: false, error: String(err) };
        }
    };

    return { services, loading, error, refetch: fetchServices, createService, updateService, deleteService };
}
