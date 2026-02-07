
import { Appointment, AppointmentStatus } from "@/types";
import { AppointmentRow } from "@/components/molecules/AppointmentRow";

interface AppointmentsTableProps {
    appointments: Appointment[];
    isLoading: boolean;
    itemsPerPage: number;
    onStatusUpdate?: (id: number, status: AppointmentStatus) => void;
    onViewDetails?: (apt: Appointment) => void;
    onCancel?: (apt: Appointment) => void;
    // Composition: Allow parent to render custom actions
    actionRenderer?: (apt: Appointment) => React.ReactNode;
}

export function AppointmentsTable({
    appointments,
    isLoading,
    itemsPerPage,
    onStatusUpdate,
    onViewDetails,
    onCancel,
    actionRenderer
}: AppointmentsTableProps) {
    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="w-[5%] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-admin-primary sm:pl-6">ID</th>
                                    <th scope="col" className="w-[20%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Cliente</th>
                                    <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Mascota</th>
                                    <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Servicio</th>
                                    <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Fecha</th>
                                    <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Estado</th>
                                    <th scope="col" className="w-[15%] relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Acciones</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {isLoading ? (
                                    Array.from({ length: itemsPerPage }).map((_, index) => (
                                        <AppointmentRow key={`skeleton-${index}`} isLoading />
                                    ))
                                ) : (
                                    <>
                                        {appointments.map((apt) => (
                                            <AppointmentRow
                                                key={apt.id}
                                                appointment={apt}
                                                onStatusUpdate={onStatusUpdate}
                                                onViewDetails={onViewDetails}
                                                onCancel={onCancel}
                                                actionRenderer={actionRenderer}
                                            />
                                        ))}
                                        {/* Empty rows to maintain fixed height */}
                                        {Array.from({ length: Math.max(0, itemsPerPage - appointments.length) }).map((_, index) => (
                                            <AppointmentRow key={`empty-${index}`} isEmpty />
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
