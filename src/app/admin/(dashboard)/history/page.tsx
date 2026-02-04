"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { Appointment } from "@/types";
import { Search, Filter, ArrowUpDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminHistoryPage() {
    const { user, isAdmin, loading: authLoading } = useAuth({ redirectToLogin: true });
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            redirect("/");
        }
    }, [isAdmin, authLoading]);

    useEffect(() => {
        if (isAdmin) {
            const fetchAllAppointments = async () => {
                // Fetch appointments with profile info
                const { data, error } = await supabase
                    .from("appointments")
                    .select(`
                        *,
                        profiles (
                            full_name
                        )
                    `)
                    .order("date", { ascending: false });

                if (data) setAppointments(data);
                setLoading(false);
            };
            fetchAllAppointments();
        }
    }, [isAdmin, supabase]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "ready": return "bg-green-100 text-green-700";
            case "washing":
            case "drying": return "bg-blue-100 text-blue-700";
            case "pending": return "bg-orange-100 text-orange-700";
            case "completed": return "bg-gray-100 text-gray-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-orange border-t-transparent"></div>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-brand-900 mb-2">Historial Global</h1>
                    <p className="text-brand-600">Gestión y visualización de todos los turnos del sistema.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar perro o dueño..."
                            className="rounded-2xl border-brand-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-primary-orange focus:ring-primary-orange w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-brand-900/5 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-50/50 border-b border-brand-900/5">
                                <th className="px-6 py-4 text-sm font-bold text-brand-700">Fecha</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-700">Perro</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-700">Cliente</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-700">Servicio</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-700 text-center">Estado</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-700 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-900/5">
                            {appointments.map((app) => (
                                <tr key={app.id} className="hover:bg-brand-50/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-brand-900">
                                            {new Date(app.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-brand-500">
                                            {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-brand-900">{app.pet_name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-brand-600">{app.profiles?.full_name || 'Desconocido'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-brand-600">{app.service}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/tracking?id=${app.id}`}
                                            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-orange hover:text-brand-900 transition-colors"
                                        >
                                            Seguimiento
                                            <ExternalLink size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {appointments.length === 0 && (
                    <div className="py-20 text-center text-brand-500">
                        No se encontraron turnos en el historial.
                    </div>
                )}
            </div>
        </main>
    );
}
