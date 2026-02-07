
import { AppointmentStatus } from "@/types";
import { getStatusColor } from "@/config/appointments";

interface StatusBadgeProps {
    status: AppointmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const colorClass = getStatusColor(status);

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${colorClass}`}>
            {status}
        </span>
    );
}
