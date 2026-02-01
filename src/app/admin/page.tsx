"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Appointment, AppointmentStatus } from "@/types";
import { Check, Clock, Play, RotateCcw, XCircle, Loader2, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth({ redirectToLogin: true });
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [fetching, setFetching] = useState(true); // Renamed from loading to avoid conflict, or handle sequential loading
    const supabase = createClient();

    useEffect(() => {
        if (user) {
            fetchAppointments();
        }
    }, [user]); // Run when user is confirmed

    // ... fetchAppointments logic ...

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .order("date", { ascending: true });

        if (!error && data) {
            // Cast to Appointment[] because Supabase types might not be auto-generated yet
            setAppointments(data as unknown as Appointment[]);
        }
        setFetching(false);
    };

    const updateStatus = async (id: number, newStatus: AppointmentStatus) => {
        const { error } = await supabase
            .from("appointments")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            alert("Error updating status: " + error.message);
        } else {
            fetchAppointments();
        }
    };

    const getStatusBadge = (status: AppointmentStatus) => {
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
    };

    if (authLoading || fetching) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-brand-600" /></div>;

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-brand-900">Panel de Administración</h1>
                        <p className="mt-2 text-sm text-brand-700">
                            Gestión de turnos y estados de las mascotas.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <Link href="/admin/settings">
                            <Button className="flex items-center gap-2">
                                <Settings size={18} />
                                Configuración
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-brand-900 sm:pl-0">ID</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-900">Mascota</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-900">Servicio</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-900">Estado</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-900">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {appointments.map((apt) => (
                                        <tr key={apt.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-brand-900 sm:pl-0">{apt.id}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{apt.pet_name}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{apt.service}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {getStatusBadge(apt.status)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex gap-2">
                                                {apt.status === 'pending' && (
                                                    <button onClick={() => updateStatus(apt.id, 'washing')} className="text-blue-600 hover:text-blue-900" title="Pasar a Baño">
                                                        <Play size={18} />
                                                    </button>
                                                )}
                                                {apt.status === 'washing' && (
                                                    <button onClick={() => updateStatus(apt.id, 'drying')} className="text-orange-600 hover:text-orange-900" title="Pasar a Secado">
                                                        <Play size={18} />
                                                    </button>
                                                )}
                                                {apt.status === 'drying' && (
                                                    <button onClick={() => updateStatus(apt.id, 'ready')} className="text-green-600 hover:text-green-900" title="Marcar Listo">
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                {apt.status === 'ready' && (
                                                    <button onClick={() => updateStatus(apt.id, 'completed')} className="text-brand-600 hover:text-brand-900" title="Finalizar">
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                                {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                                                    <button onClick={() => updateStatus(apt.id, 'cancelled')} className="text-red-600 hover:text-red-900" title="Cancelar">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
