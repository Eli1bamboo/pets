"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AdminUIContextType {
    isSettingsOpen: boolean;
    openSettings: () => void;
    closeSettings: () => void;
}

const AdminUIContext = createContext<AdminUIContextType | undefined>(undefined);

export function AdminUIProvider({ children }: { children: ReactNode }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    return (
        <AdminUIContext.Provider value={{ isSettingsOpen, openSettings, closeSettings }}>
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
