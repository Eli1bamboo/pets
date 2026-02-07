"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { SidebarSheet, SheetContent } from "@/components/molecules/SidebarSheet";
import { AppointmentDetailsSidebar } from "./AppointmentDetailsSidebar";
import SettingsSidebar from "./SettingsSidebar";

export function SidebarContainer() {
    const { isOpen, view, data, closeSidebar } = useSidebar();



    return (
        <SidebarSheet open={isOpen} onOpenChange={(open) => !open && closeSidebar()}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                {view === "appointment_details" && (
                    <AppointmentDetailsSidebar appointment={data.appointment} />
                )}
                {view === "settings" && (
                    <SettingsSidebar />
                )}
            </SheetContent>
        </SidebarSheet>
    );
}
