"use client";

import { useAdminUI } from "@/providers/AdminUIProvider";
import { SidebarSheet, SheetContent } from "@/components/molecules/SidebarSheet";
import { AppointmentDetailsSidebar } from "./AppointmentDetailsSidebar";
import { SettingsSidebar } from "./SettingsSidebar";
import { ServiceFormSidebar } from "./ServiceFormSidebar";

export function SidebarContainer() {
    const { sidebar, closeSidebar } = useAdminUI();
    const { isOpen, view, data } = sidebar;

    return (
        <SidebarSheet open={isOpen} onOpenChange={(open) => !open && closeSidebar()}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                {view === "appointment_details" && !!data?.appointment && (
                    <AppointmentDetailsSidebar appointment={data.appointment!} />
                )}
                {view === "settings" && (
                    <SettingsSidebar />
                )}
                {view === "service_form" && (
                    <ServiceFormSidebar service={data?.service} />
                )}
            </SheetContent>
        </SidebarSheet>
    );
}
