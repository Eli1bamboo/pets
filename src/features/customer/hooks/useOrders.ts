"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Order } from "@/types";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const { data } = await supabase
            .from("orders")
            .select("*, items:order_items(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        setOrders((data as Order[]) || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return { orders, loading, refetch: fetchOrders };
}
