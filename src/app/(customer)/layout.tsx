"use client";

import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { CustomerProvider } from "@/providers/CustomerProvider";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CustomerProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </CustomerProvider>
    );
}
