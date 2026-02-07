"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarState {
    view: "settings" | "appointment_details" | null;
    data?: any;
    isOpen: boolean;
}

interface AdminUIContextType {
    sidebar: SidebarState;
    openSidebar: (view: SidebarState["view"], data?: any) => void;
    closeSidebar: () => void;
    refreshTrigger: number;
    triggerRefresh: () => void;
}

const AdminUIContext = createContext<AdminUIContextType | undefined>(undefined);

export function AdminUIProvider({ children }: { children: ReactNode }) {
    const [sidebar, setSidebar] = useState<SidebarState>({
        view: null,
        data: null,
        isOpen: false
    });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const openSidebar = (view: SidebarState["view"], data?: any) => {
        setSidebar({ view, data, isOpen: true });
    };

    const closeSidebar = () => {
        setSidebar(prev => ({ ...prev, isOpen: false }));
    };

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <AdminUIContext.Provider value={{ sidebar, openSidebar, closeSidebar, refreshTrigger, triggerRefresh }}>
            {children}
        </AdminUIContext.Provider>
    );
}

export function useAdminUI() {
    const context = useContext(AdminUIContext);
    if (context === undefined) {
        throw new Error("useAdminUI must be used within an AdminUIProvider");
    }
    return context;
}

export function useRefresh() {
    const { refreshTrigger, triggerRefresh } = useAdminUI();
    return { refreshTrigger, triggerRefresh };
}
