
import { AppointmentStatus } from "@/types";

interface StatusBadgeProps {
    status: AppointmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<string, string> = {
        pending: "bg-gray-100 text-gray-800",
        washing: "bg-blue-100 text-blue-800",
        drying: "bg-orange-100 text-orange-800",
        ready: "bg-green-100 text-green-800",
        completed: "bg-brand-100 text-brand-800",
        cancelled: "bg-red-50 text-red-700",
    };

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${styles[status]}`}>
            {status}
        </span>
    );
}
