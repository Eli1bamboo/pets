"use client";

import { AdminProvider } from "@/providers/AdminProvider";
import { AdminUIProvider } from "@/providers/AdminUIProvider";
import { SidebarContainer } from "@/features/admin/components/organisms/SidebarContainer";

export default function RootAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminProvider>
            <AdminUIProvider>
                <div className="theme-admin min-h-screen">
                    {children}
                    <SidebarContainer />
                </div>
            </AdminUIProvider>
        </AdminProvider >
    );
}
