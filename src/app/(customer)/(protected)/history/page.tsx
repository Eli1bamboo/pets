"use client";

import { useCustomerContext } from "@/providers/CustomerProvider";

import { Calendar, Clock, Dog, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCustomerHistory } from "@/hooks/useCustomerHistory";
import { useTranslation } from "@/i18n/LanguageContext";
import { getStatusColor } from "@/config/appointments";


export default function HistoryPage() {
    const { user, loading: authLoading } = useCustomerContext();
    const { appointments, loading } = useCustomerHistory(user);
    const { t } = useTranslation();

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
                <h1 className="text-4xl font-black text-brand-900 mb-2">{t.history.title}</h1>
                <p className="text-brand-600">{t.history.subtitle}</p>
            </div>

            {appointments.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-brand-200 p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-brand-900">{t.history.emptyTitle}</h3>
                    <p className="mb-8 text-brand-500">{t.history.emptySubtitle}</p>
                    <Link
                        href="/booking"
                        className="inline-block rounded-full bg-primary-orange px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        {t.history.emptyAction}
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
                                    <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                                        {(t.statusHistory as Record<string, string>)[app.status] || app.status}
                                    </span>
                                    <Link
                                        href={`/tracking?id=${app.id}`}
                                        className="flex items-center gap-1 text-sm font-bold text-primary-orange hover:underline"
                                    >
                                        {t.history.viewTracking}
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
