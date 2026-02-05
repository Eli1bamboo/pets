"use client";

import { AdminProvider } from "@/providers/AdminProvider";

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            {children}
        </AdminProvider>
    );
}
