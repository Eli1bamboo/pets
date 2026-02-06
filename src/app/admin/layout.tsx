"use client";

import { AdminProvider } from "@/providers/AdminProvider";
import { AdminUIProvider } from "@/providers/AdminUIProvider";
import { SidebarContainer } from "@/components/organisms/SidebarContainer";

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <AdminUIProvider>
                {children}
                <SidebarContainer />
            </AdminUIProvider>
        </AdminProvider >
    );
}
