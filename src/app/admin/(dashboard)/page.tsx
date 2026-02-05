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

    if (loading) return <AdminLoader message="Cargando métricas de negocio..." />;

    const kpis = [
        { label: "Cortes del Mes", value: stats.completedMonth, icon: Scissors, color: "bg-primary-orange", subtext: "Completados" },
        { label: "Turnos Pendientes", value: stats.pendingTotal, icon: Clock, color: "bg-blue-500", subtext: "En espera" },
        { label: "Ingresos Estimados", value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-green-500", subtext: "Este mes" },
        { label: "Próximo Cliente", value: stats.nextAppointment?.pet_name || "Nadie", icon: Users, color: "bg-purple-500", subtext: stats.nextAppointment ? stats.nextAppointment.service : "-" }
    ];

    return (
        <div className="p-8 lg:p-12">
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black text-brand-900 mb-2 tracking-tight">
                    Panel de Control
                </h1>
                <p className="text-brand-600 text-lg">Resumen de actividad y métricas clave.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((kpi, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-900/5 ring-1 ring-brand-900/5 flex flex-col justify-between h-48 hover:scale-[1.02] transition-transform duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`${kpi.color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-900/10`}>
                                <kpi.icon size={28} strokeWidth={2.5} />
                            </div>
                            <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {kpi.subtext}
                            </span>
                        </div>
                        <div>
                            <p className="text-brand-400 text-sm font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
                            <p className="text-3xl font-black text-brand-900 tracking-tight">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-brand-900 rounded-[3rem] p-10 h-80 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-white">Actividad Reciente</h2>
                            <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors backdrop-blur-md">
                                <ArrowUpRight size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                                    <div className="h-2 w-2 rounded-full bg-green-400 mb-2"></div>
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
                    className="bg-white rounded-[3rem] p-10 shadow-xl ring-1 ring-brand-900/5 flex flex-col justify-between h-80 relative overflow-hidden"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-primary-orange/10 p-2 rounded-xl">
                                <CalendarCheck className="text-primary-orange" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-brand-900">Agenda de Hoy</h2>
                        </div>
                        {stats.nextAppointment ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-brand-900">{stats.nextAppointment.pet_name}</span>
                                        <span className="text-xs font-bold bg-white px-2 py-1 rounded-md text-brand-600 shadow-sm border border-brand-100">
                                            {new Date(stats.nextAppointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-brand-600">{stats.nextAppointment.service}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-brand-500 text-sm">No hay más turnos por hoy.</p>
                        )}
                    </div>
                    <button className="w-full py-4 rounded-2xl bg-brand-900 text-white font-bold text-sm hover:bg-brand-800 transition-colors shadow-lg shadow-brand-900/20">
                        Ver Calendario Completo
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
