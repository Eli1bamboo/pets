"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
    Scissors,
    CalendarCheck,
    TrendingUp,
    Clock,
    ArrowUpRight,
    Users
} from "lucide-react";
import { motion } from "framer-motion";
import { AdminLoader } from "@/components/molecules/AdminLoader";

export default function AdminDashboard() {
    const { stats, loading } = useDashboardStats();

    if (loading) return null;

    const kpis = [
        { label: "Cortes del Mes", value: stats.completedMonth, icon: Scissors, color: "bg-admin-accent", subtext: "Completados" },
        { label: "Turnos Pendientes", value: stats.pendingTotal, icon: Clock, color: "bg-blue-600", subtext: "En espera" },
        { label: "Ingresos Estimados", value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-emerald-600", subtext: "Este mes" },
        { label: "Próximo Cliente", value: stats.nextAppointment?.pet_name || "Nadie", icon: Users, color: "bg-violet-600", subtext: stats.nextAppointment ? stats.nextAppointment.service : "-" }
    ];

    return (
        <div className="p-8 lg:p-12">
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black text-admin-primary mb-2 tracking-tight">
                    Panel de Control
                </h1>
                <p className="text-admin-text-secondary text-lg">Resumen de actividad y métricas clave.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((kpi, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-between h-48 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`${kpi.color} h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-sm`}>
                                <kpi.icon size={24} strokeWidth={2.5} />
                            </div>
                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {kpi.subtext}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
                            <p className="text-3xl font-black text-admin-primary tracking-tight">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 h-80 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-white">Actividad Reciente</h2>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                                    <div className="h-2 w-2 rounded-full bg-emerald-400 mb-2"></div>
                                    <p className="text-white/60 text-xs mb-1">Hace {i}h</p>
                                    <p className="text-white font-bold text-sm">Corte Completado</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 flex flex-col justify-between h-80 relative overflow-hidden"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-slate-100 p-2 rounded-xl">
                                <CalendarCheck className="text-admin-primary" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-admin-primary">Agenda de Hoy</h2>
                        </div>
                        {stats.nextAppointment ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-admin-primary">{stats.nextAppointment.pet_name}</span>
                                        <span className="text-xs font-bold bg-white px-2 py-1 rounded-md text-slate-600 shadow-sm border border-slate-100">
                                            {new Date(stats.nextAppointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">{stats.nextAppointment.service}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">No hay más turnos por hoy.</p>
                        )}
                    </div>
                    <button className="w-full py-4 rounded-2xl bg-admin-primary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                        Ver Calendario Completo
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
