"use client";

import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import CustomerBottomNav from "@/components/organisms/CustomerBottomNav";
import { CustomerProvider } from "@/providers/CustomerProvider";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CustomerProvider>
            <Header />
            <main className="min-h-screen bg-brand-50 pb-24 md:pb-0">{children}</main>
            <CustomerBottomNav />
            <div className="hidden md:block">
                <Footer />
            </div>
        </CustomerProvider>
    );
}
