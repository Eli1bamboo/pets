"use client";

import { CustomerHeader } from "@/components/organisms/CustomerHeader";
import { CustomerFooter } from "@/components/organisms/CustomerFooter";
import { CustomerBottomNav } from "@/components/organisms/CustomerBottomNav";
import { CustomerProvider } from "@/providers/CustomerProvider";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CustomerProvider>
            <CustomerHeader />
            <main className="min-h-screen theme-customer bg-brand-50 pb-24 md:pb-0">{children}</main>
            <CustomerBottomNav />
            <div className="hidden md:block">
                <CustomerFooter />
            </div>
        </CustomerProvider>
    );
}
