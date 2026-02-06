"use client";

import { useSidebar } from "@/hooks/useSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppointmentDetailsSidebar } from "./AppointmentDetailsSidebar";

export function SidebarContainer() {
    const { isOpen, view, data, closeSidebar } = useSidebar();

    if (!isOpen) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeSidebar()}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                {view === "appointment_details" && (
                    <AppointmentDetailsSidebar appointment={data.appointment} />
                )}
                {/* Add other sidebar views here if needed */}
            </SheetContent>
        </Sheet>
    );
}
