"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { Appointment } from "@/types";
import { Calendar, Clock, Dog, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
    const { user, loading: authLoading } = useAuth({ redirectToLogin: true });
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (user) {
            const fetchAppointments = async () => {
                const { data, error } = await supabase
                    .from("appointments")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("date", { ascending: false });

                if (data) setAppointments(data);
                setLoading(false);
            };
            fetchAppointments();
        }
    }, [user, supabase]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "ready": return "bg-green-100 text-green-700 border-green-200";
            case "washing":
            case "drying": return "bg-blue-100 text-blue-700 border-blue-200 animate-pulse";
            case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
            case "completed": return "bg-gray-100 text-gray-600 border-gray-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
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
        <main className="mx-auto max-w-4xl px-6 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-brand-900 mb-2">Mi Historial</h1>
                <p className="text-brand-600">Revisa tus turnos pasados y el estado de los actuales.</p>
            </div>

            {appointments.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-brand-200 p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-900">No tienes turnos aún</h3>
                    <p className="mb-8 text-brand-500">Cuando reserves tu primer servicio, aparecerá aquí.</p>
                    <Link
                        href="/booking"
                        className="inline-block rounded-full bg-primary-orange px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        Reservar mi primer turno
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((app) => (
                        <div
                            key={app.id}
                            className="group relative overflow-hidden rounded-3xl border border-brand-900/5 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary-orange/20"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-primary-orange group-hover:bg-primary-orange group-hover:text-white transition-colors">
                                        <Dog size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-brand-900">{app.pet_name}</h3>
                                        <p className="text-brand-600 font-medium">{app.service}</p>
                                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-brand-500">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {new Date(app.date).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
                                    <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${getStatusStyles(app.status)}`}>
                                        {app.status === 'pending' ? 'Pendiente' :
                                            app.status === 'washing' ? 'Lavando' :
                                                app.status === 'drying' ? 'Secando' :
                                                    app.status === 'ready' ? '¡Listo!' :
                                                        app.status === 'completed' ? 'Completado' : 'Cancelado'}
                                    </span>
                                    <Link
                                        href={`/tracking?id=${app.id}`}
                                        className="flex items-center gap-1 text-sm font-bold text-primary-orange hover:underline"
                                    >
                                        Ver seguimiento
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
