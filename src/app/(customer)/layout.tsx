"use client";

import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
