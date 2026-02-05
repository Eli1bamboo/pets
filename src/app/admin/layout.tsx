"use client";

import { AdminProvider } from "@/providers/AdminProvider";
import { AdminUIProvider } from "@/providers/AdminUIProvider";

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <AdminUIProvider>
                {children}
            </AdminUIProvider>
        </AdminProvider>
    );
}
