
import { AppointmentStatus } from "@/types";

interface StatusBadgeProps {
    status: AppointmentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const styles: Record<string, string> = {
        pending: "bg-slate-100 text-slate-700",
        washing: "bg-blue-100 text-blue-700",
        drying: "bg-orange-100 text-orange-800",
        ready: "bg-purple-100 text-purple-700",
        completed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
    };

    return (
        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${styles[status]}`}>
            {status}
        </span>
    );
}
