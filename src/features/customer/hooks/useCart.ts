"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { CartItem } from "@/types";

export function useCart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [cartId, setCartId] = useState<number | null>(null);
    const [supabase] = useState(() => createClient());

    // Fetch or create cart
    const fetchCart = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        // Get existing cart
        let { data: cart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (!cart) {
            // Create a new cart
            const { data: newCart } = await supabase
                .from("carts")
                .insert({ user_id: user.id })
                .select("id")
                .single();
            cart = newCart;
        }

        if (cart) {
            setCartId(cart.id);
            // Fetch cart items with product details
            const { data: cartItems } = await supabase
                .from("cart_items")
                .select(`*, product:products(*, images:product_images(*))`)
                .eq("cart_id", cart.id)
                .order("created_at", { ascending: true });

            setItems((cartItems as CartItem[]) || []);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add to cart (or increment if exists)
    const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
        if (!cartId) {
            // Need to create cart first
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: newCart } = await supabase
                .from("carts")
                .insert({ user_id: user.id })
                .select("id")
                .single();

            if (!newCart) return;
            setCartId(newCart.id);

            await supabase
                .from("cart_items")
                .insert({ cart_id: newCart.id, product_id: productId, quantity });
        } else {
            // Check if item already in cart
            const existing = items.find((i) => i.product_id === productId);
            if (existing) {
                await supabase
                    .from("cart_items")
                    .update({ quantity: existing.quantity + quantity })
                    .eq("id", existing.id);
            } else {
                await supabase
                    .from("cart_items")
                    .insert({ cart_id: cartId, product_id: productId, quantity });
            }
        }
        await fetchCart();
    }, [cartId, items, supabase, fetchCart]);

    // Update quantity
    const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            await supabase.from("cart_items").delete().eq("id", itemId);
        } else {
            await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
        }
        await fetchCart();
    }, [supabase, fetchCart]);

    // Remove item
    const removeItem = useCallback(async (itemId: number) => {
        await supabase.from("cart_items").delete().eq("id", itemId);
        await fetchCart();
    }, [supabase, fetchCart]);

    // Clear cart
    const clearCart = useCallback(async () => {
        if (!cartId) return;
        await supabase.from("cart_items").delete().eq("cart_id", cartId);
        await fetchCart();
    }, [cartId, supabase, fetchCart]);

    // Computed values
    const cartCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
    const cartTotal = useMemo(() =>
        items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0),
        [items]
    );

    return {
        items,
        loading,
        cartId,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refetch: fetchCart,
    };
}
