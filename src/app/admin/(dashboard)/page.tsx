"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
    Scissors,
    CalendarCheck,
    TrendingUp,
    Clock,
    Loader2,
    ArrowUpRight,
    Users
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        completedMonth: 0,
        pendingTotal: 0,
        totalRevenue: 0,
        nextAppointment: null as any
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: completedCount } = await supabase
            .from("appointments")
            .select("*", { count: 'exact', head: true })
            .eq("status", "completed")
            .gte("date", startOfMonth.toISOString());

        const { count: pendingCount } = await supabase
            .from("appointments")
            .select("*", { count: 'exact', head: true })
            .in("status", ["pending", "washing", "drying", "ready"]);

        const { data: nextApt } = await supabase
            .from("appointments")
            .select("*")
            .in("status", ["pending", "washing"])
            .gte("date", new Date().toISOString())
            .order("date", { ascending: true })
            .limit(1)
            .single();

        setStats({
            completedMonth: completedCount || 0,
            pendingTotal: pendingCount || 0,
            totalRevenue: (completedCount || 0) * 4500,
            nextAppointment: nextApt
        });
        setLoading(false);
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
            <Loader2 className="animate-spin text-brand-900" size={48} />
            <p className="text-brand-600 font-bold animate-pulse">Cargando métricas de negocio...</p>
        </div>
    );

    const kpis = [
        { label: "Cortes del Mes", value: stats.completedMonth, icon: Scissors, color: "bg-primary-orange", subtext: "Completados" },
        { label: "Turnos Agendados", value: stats.pendingTotal, icon: CalendarCheck, color: "bg-secondary-teal", subtext: "En espera" },
        { label: "Ingresos (Est.)", value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-brand-900", subtext: "Base: $4.500" },
        { label: "Clientes Nuevos", value: "12", icon: Users, color: "bg-soft-peach", subtext: "Últimos 30 días" }
    ];

    return (
        <div className="p-8 lg:p-12">
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-black text-brand-900 tracking-tight">Dashboard</h1>
                <p className="text-brand-600 mt-3 font-medium text-lg">Resumen del rendimiento del negocio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-900/5 ring-1 ring-brand-900/5 flex flex-col justify-between"
                    >
                        <div className={`p-4 rounded-2xl ${kpi.color} text-white shadow-xl w-fit`}>
                            <kpi.icon size={28} />
                        </div>
                        <div className="mt-10">
                            <p className="text-xs font-black text-brand-400 uppercase tracking-widest">{kpi.label}</p>
                            <h3 className="text-4xl font-black text-brand-900 mt-2">{kpi.value}</h3>
                            <p className="text-sm text-brand-500 font-bold mt-2">{kpi.subtext}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-brand-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black flex items-center gap-4">
                            <Clock className="text-primary-orange" size={28} />
                            Próximo Turno
                        </h2>

                        {stats.nextAppointment ? (
                            <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                                <div>
                                    <p className="text-white/40 font-black text-xs uppercase tracking-widest">Paciente</p>
                                    <h3 className="text-4xl font-black mt-2 text-primary-orange">{stats.nextAppointment.pet_name}</h3>
                                    <p className="mt-2 text-white/60 font-bold">{stats.nextAppointment.service}</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-[2rem] border border-white/10">
                                    <p className="text-white/40 text-xs font-black uppercase mb-1">Horario</p>
                                    <p className="text-3xl font-black">
                                        {new Date(stats.nextAppointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-10 text-white/40 font-bold">No hay turnos pendientes hoy.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 shadow-xl ring-1 ring-brand-900/5 flex flex-col gap-4">
                    <h2 className="text-xl font-black text-brand-900 mb-2">Acceso Rápido</h2>
                    <button onClick={() => window.location.href = '/admin/appointments'} className="w-full bg-brand-50 p-5 rounded-2xl font-black text-brand-900 flex items-center justify-between hover:bg-brand-900 hover:text-white transition-all">
                        <span>Turnos</span>
                        <ArrowUpRight size={20} />
                    </button>
                    <button onClick={() => window.location.href = '/admin/history'} className="w-full bg-brand-50 p-5 rounded-2xl font-black text-brand-900 flex items-center justify-between hover:bg-brand-900 hover:text-white transition-all">
                        <span>Historial</span>
                        <ArrowUpRight size={20} />
                    </button>
                    <button onClick={() => window.location.href = '/admin/settings'} className="w-full bg-brand-50 p-5 rounded-2xl font-black text-brand-900 flex items-center justify-between hover:bg-brand-900 hover:text-white transition-all">
                        <span>Ajustes</span>
                        <ArrowUpRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
