"use client";

import { useServices } from "@/hooks/useServices";
import { useAdminUI, useRefresh } from "@/providers/AdminUIProvider";
import { Service } from "@/types";
import { Plus, Package, Pencil, DollarSign } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useEffect } from "react";
import { useTranslation } from "@/i18n/LanguageContext";

const ITEMS_PER_PAGE = 8;

export default function ServicesPage() {
    const { services, loading, refetch } = useServices({ includeInactive: true });
    const { openSidebar } = useAdminUI();
    const { refreshTrigger } = useRefresh();
    const { t } = useTranslation();

    useEffect(() => {
        refetch();
    }, [refreshTrigger, refetch]);

    const handleCreate = () => {
        openSidebar("service_form", { service: undefined });
    };

    const handleEdit = (service: Service) => {
        openSidebar("service_form", { service });
    };

    return (
        <div className="bg-admin-bg min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-black leading-6 text-admin-primary">{t.admin.services.title}</h1>
                        <p className="mt-2 text-sm text-admin-text-secondary">
                            {t.admin.services.subtitle}
                        </p>
                    </div>
                    <div className="mt-4 sm:flex-none">
                        <Button
                            variant="admin-primary"
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-admin-primary hover:bg-slate-800 text-white border-none shadow-sm"
                        >
                            <Plus size={18} />
                            {t.admin.services.newService}
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 table-fixed">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="w-[35%] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-admin-primary sm:pl-6">{t.admin.services.service}</th>
                                                <th className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">{t.admin.services.price}</th>
                                                <th className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">{t.admin.services.status}</th>
                                                <th className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">{t.admin.services.order}</th>
                                                <th className="w-[20%] relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                                <tr key={i}>
                                                    <td className="py-4 pl-4 pr-3 sm:pl-6"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></td>
                                                    <td className="px-3 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
                                                    <td className="px-3 py-4"><div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse" /></td>
                                                    <td className="px-3 py-4"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse" /></td>
                                                    <td className="py-4 pl-3 pr-4 sm:pr-6"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse ml-auto" /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : services.length === 0 ? (
                    <div className="mt-8 text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-500">{t.admin.services.noServices}</h3>
                        <p className="text-gray-400 mt-1 mb-6">{t.admin.services.noServicesMsg}</p>
                        <Button variant="admin-primary" onClick={handleCreate} className="inline-flex items-center gap-2">
                            <Plus size={18} />
                            {t.admin.services.createService}
                        </Button>
                    </div>
                ) : (
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300 table-fixed">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="w-[35%] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-admin-primary sm:pl-6">{t.admin.services.service}</th>
                                                <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">{t.admin.services.price}</th>
                                                <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">{t.admin.services.status}</th>
                                                <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">{t.admin.services.order}</th>
                                                <th scope="col" className="w-[20%] relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Acciones</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {services.map((service) => (
                                                <tr
                                                    key={service.id}
                                                    className={`group hover:bg-gray-50 transition-colors cursor-pointer ${!service.is_active ? "opacity-50" : ""}`}
                                                    onClick={() => handleEdit(service)}
                                                >
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                        <div>
                                                            <p className="font-semibold text-admin-primary text-sm">{service.name}</p>
                                                            {service.name_en && (
                                                                <p className="text-xs text-gray-400 mt-0.5">{service.name_en}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-admin-primary">
                                                            <DollarSign size={14} className="text-admin-accent" />
                                                            {Number(service.price).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${service.is_active
                                                            ? "bg-green-50 text-green-700 border border-green-200"
                                                            : "bg-gray-100 text-gray-500 border border-gray-200"
                                                            }`}>
                                                            {service.is_active ? t.admin.services.active : t.admin.services.inactive}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <span className="text-sm text-gray-500 font-medium">{service.sort_order}</span>
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEdit(service);
                                                            }}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-admin-accent hover:bg-admin-accent/10 transition-colors"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - services.length) }).map((_, i) => (
                                                <tr key={`empty-${i}`}>
                                                    <td colSpan={5} className="py-4 pl-4 pr-3 sm:pl-6">&nbsp;</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
