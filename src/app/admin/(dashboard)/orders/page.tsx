"use client";

import { useState } from "react";
import { useAdminOrders } from "@/features/admin/hooks/useAdminOrders";
import { OrderStatus } from "@/types";
import { Package, ChevronDown, ChevronUp, Store, Truck } from "lucide-react";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    paid: { label: "Pagado", color: "bg-green-100 text-green-800 border-green-200" },
    preparing: { label: "Preparando", color: "bg-blue-100 text-blue-800 border-blue-200" },
    ready_for_pickup: { label: "Listo p/ retirar", color: "bg-purple-100 text-purple-800 border-purple-200" },
    shipped: { label: "Enviado", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
    delivered: { label: "Entregado", color: "bg-green-100 text-green-800 border-green-200" },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800 border-red-200" },
};

const STATUS_FLOW: OrderStatus[] = ["pending", "paid", "preparing", "ready_for_pickup", "delivered"];

export default function AdminOrdersPage() {
    const { orders, loading, updateStatus } = useAdminOrders();
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const filtered = filterStatus === "all"
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    return (
        <div className="bg-admin-bg min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-black leading-6 text-admin-primary">Pedidos</h1>
                        <p className="mt-2 text-sm text-admin-text-secondary">
                            Gestiona los pedidos de tus clientes.
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="mt-6 flex gap-2 flex-wrap">
                    {["all", ...Object.keys(STATUS_CONFIG)].map((key) => {
                        const isAll = key === "all";
                        const cfg = isAll ? null : STATUS_CONFIG[key as OrderStatus];
                        const count = isAll ? orders.length : orders.filter((o) => o.status === key).length;
                        const active = filterStatus === key;

                        return (
                            <button
                                key={key}
                                onClick={() => setFilterStatus(key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${active
                                    ? "bg-admin-primary text-white border-admin-primary"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                {isAll ? "Todos" : cfg?.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Table */}
                <div className="mt-6">
                    {loading ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Pedido</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" /></td>
                                            <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-500">No hay pedidos</h3>
                            <p className="text-gray-400 mt-1">Los pedidos de clientes aparecerán acá.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Pedido</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                                        <th className="px-6 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((order) => {
                                        const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                                        const isExpanded = expandedId === order.id;
                                        const profile = (order as any).profiles;
                                        const date = new Date(order.created_at).toLocaleDateString("es-AR", {
                                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                                        });

                                        return (
                                            <tr key={order.id} className="group">
                                                <td colSpan={6} className="p-0">
                                                    <button
                                                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                                        className="w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                                                    >
                                                        <span className="flex-none w-[15%] text-sm font-extrabold text-admin-primary">
                                                            #{order.id}
                                                        </span>
                                                        <span className="flex-none w-[25%] text-sm text-gray-600">
                                                            {profile?.full_name || "—"}
                                                        </span>
                                                        <span className="flex-none w-[15%] text-sm font-bold text-admin-primary">
                                                            ${order.total.toLocaleString()}
                                                        </span>
                                                        <span className="flex-none w-[20%] flex flex-col gap-1 items-start">
                                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusCfg.color}`}>
                                                                📦 {statusCfg.label}
                                                            </span>
                                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                                                                order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                                    order.payment_status === 'refunded' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                                                        order.payment_status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                                                            'bg-red-50 text-red-700 border-red-200'
                                                                }`}>
                                                                💳 {
                                                                    order.payment_status === 'paid' ? 'Pagado' :
                                                                        order.payment_status === 'pending' ? 'Pago Pendiente' :
                                                                            order.payment_status === 'refunded' ? 'Reembolsado' :
                                                                                order.payment_status === 'cancelled' ? 'Cancelado' :
                                                                                    'No Pagado'
                                                                }
                                                            </span>
                                                            <span className={`mt-0.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${order.fulfillment === 'delivery'
                                                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                                : 'bg-gray-50 text-gray-600 border-gray-200'
                                                                }`}>
                                                                {order.fulfillment === 'delivery' ? <Truck size={10} /> : <Store size={10} />}
                                                                {order.fulfillment === 'delivery' ? 'Envío' : 'Retiro'}
                                                            </span>
                                                        </span>
                                                        <span className="flex-1 text-sm text-gray-500">{date}</span>
                                                        <span className="flex-none">
                                                            {isExpanded
                                                                ? <ChevronUp size={16} className="text-gray-400" />
                                                                : <ChevronDown size={16} className="text-gray-400" />
                                                            }
                                                        </span>
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="px-6 pb-4 border-t border-gray-100">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                                                                {/* Items */}
                                                                <div>
                                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                                                                    <div className="space-y-2">
                                                                        {order.items?.map((item) => (
                                                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                                                <span className="text-gray-700">
                                                                                    {item.product_name} <span className="text-gray-400">x{item.quantity}</span>
                                                                                </span>
                                                                                <span className="font-bold text-gray-800">
                                                                                    ${item.subtotal.toLocaleString()}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {order.notes && (
                                                                        <p className="mt-3 text-xs text-gray-400 italic">
                                                                            Nota: {order.notes}
                                                                        </p>
                                                                    )}

                                                                    {/* Delivery address */}
                                                                    {order.fulfillment === 'delivery' && order.shipping_address && (
                                                                        <div className="mt-4 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                                                                            <h5 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                                                                <Truck size={12} /> Dirección de envío
                                                                            </h5>
                                                                            <p className="text-sm text-gray-700 font-medium">{(order.shipping_address as any)?.street}</p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {(order.shipping_address as any)?.city}
                                                                                {(order.shipping_address as any)?.state ? `, ${(order.shipping_address as any).state}` : ''}
                                                                                {(order.shipping_address as any)?.zip_code ? ` · CP ${(order.shipping_address as any).zip_code}` : ''}
                                                                            </p>
                                                                            {(order.shipping_address as any)?.notes && (
                                                                                <p className="text-xs text-gray-400 mt-1 italic">📝 {(order.shipping_address as any).notes}</p>
                                                                            )}
                                                                        </div>
                                                                    )}

                                                                    {order.shipping_fee > 0 && (
                                                                        <p className="mt-2 text-xs text-gray-500">
                                                                            Envío: <span className="font-bold">${order.shipping_fee.toLocaleString()}</span>
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                                        Progreso del Pedido
                                                                    </h4>
                                                                    {order.payment_status !== 'paid' && (
                                                                        <div className="mb-3 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                                                                            ⚠️ <strong>Atención:</strong> Podés preparar el pedido y marcarlo como listo para retirar, pero no se puede despachar (enviar o entregar) hasta confirmar el pago.
                                                                        </div>
                                                                    )}
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {STATUS_FLOW.map((s) => {
                                                                            if (s === 'paid') return null; // 'paid' is no longer a valid manual fulfillment transition

                                                                            const cfg = STATUS_CONFIG[s];
                                                                            const isCurrent = order.status === s;

                                                                            // Block completing fulfillment if unpaid (allow ready_for_pickup for in-store payments)
                                                                            const isBlocked = (s === 'shipped' || s === 'delivered') && order.payment_status !== 'paid';

                                                                            return (
                                                                                <button
                                                                                    key={s}
                                                                                    onClick={() => !isCurrent && !isBlocked && updateStatus(order.id, s)}
                                                                                    disabled={isCurrent || isBlocked}
                                                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isCurrent
                                                                                        ? `${cfg.color} cursor-default ring-2 ring-offset-1 ring-admin-primary opacity-100`
                                                                                        : isBlocked
                                                                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
                                                                                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                                                                        }`}
                                                                                    title={isBlocked ? "El pedido debe estar pagado para avanzar a este estado" : ""}
                                                                                >
                                                                                    {cfg.label}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                        <button
                                                                            onClick={() => order.status !== "cancelled" && updateStatus(order.id, "cancelled")}
                                                                            disabled={order.status === "cancelled"}
                                                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${order.status === "cancelled"
                                                                                ? "bg-red-100 text-red-800 border-red-200 cursor-default ring-2 ring-offset-1 ring-admin-primary"
                                                                                : "bg-white text-red-500 border-red-200 hover:bg-red-50"
                                                                                }`}
                                                                        >
                                                                            Cancelar
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
