"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useCart } from "@/features/customer/hooks/useCart";

interface CartContextType {
    items: ReturnType<typeof useCart>["items"];
    loading: boolean;
    cartId: number | null;
    cartCount: number;
    cartTotal: number;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refetch: () => Promise<void>;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const cart = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <CartContext.Provider
            value={{
                ...cart,
                isCartOpen,
                openCart: () => setIsCartOpen(true),
                closeCart: () => setIsCartOpen(false),
                toggleCart: () => setIsCartOpen((v) => !v),
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCartContext must be used within CartProvider");
    return ctx;
}
