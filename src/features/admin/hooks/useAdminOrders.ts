"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Order } from "@/types";

export function useAdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from("orders")
            .select("*, items:order_items(*), profiles(full_name)")
            .order("created_at", { ascending: false });

        setOrders((data as Order[]) || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateStatus = useCallback(async (orderId: number, status: string) => {
        await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId);
        await fetchOrders();
    }, [supabase, fetchOrders]);

    return { orders, loading, refetch: fetchOrders, updateStatus };
}
