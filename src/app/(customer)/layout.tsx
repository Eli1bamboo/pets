"use client";

import { CustomerHeader } from "@/features/customer/components/organisms/CustomerHeader";
import { CustomerFooter } from "@/features/customer/components/organisms/CustomerFooter";
import { CustomerBottomNav } from "@/features/customer/components/organisms/CustomerBottomNav";
import { CartSidebar } from "@/features/customer/components/organisms/CartSidebar";
import { CustomerProvider } from "@/providers/CustomerProvider";
import { CartProvider } from "@/providers/CartProvider";
import { Suspense } from "react";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CustomerProvider>
            <CartProvider>
                <CustomerHeader />
                <CartSidebar />
                <main className="min-h-screen theme-customer bg-brand-50 pb-24 md:pb-0">{children}</main>
                <Suspense fallback={null}>
                    <CustomerBottomNav />
                </Suspense>
                <div className="hidden md:block">
                    <CustomerFooter />
                </div>
            </CartProvider>
        </CustomerProvider>
    );
}
