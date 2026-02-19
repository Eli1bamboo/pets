"use client";

import { useState } from "react";
import { useProducts } from "@/features/admin/hooks/useProducts";
import { useCategories } from "@/features/admin/hooks/useCategories";
import { useInventory } from "@/features/admin/hooks/useInventory";
import { useAdminUI, useRefresh } from "@/providers/AdminUIProvider";
import { Product } from "@/types";
import {
    Plus,
    ShoppingBag,
    Pencil,
    DollarSign,
    AlertTriangle,
    Package,
    Layers,
    BarChart3,
} from "lucide-react";
import { Button } from "@/features/admin/components/atoms/Button";
import { useEffect } from "react";

type TabKey = "products" | "categories" | "inventory";

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("products");
    const { products, loading, refetch } = useProducts({ includeInactive: true });
    const { categories, loading: catLoading, refetch: refetchCats, createCategory, updateCategory, deleteCategory } = useCategories();
    const { logs, lowStockProducts, loading: invLoading, adjustStock } = useInventory();
    const { openSidebar } = useAdminUI();
    const { refreshTrigger } = useRefresh();

    useEffect(() => {
        refetch();
        refetchCats();
    }, [refreshTrigger, refetch, refetchCats]);

    const handleCreate = () => {
        openSidebar("product_form", { product: undefined });
    };

    const handleEdit = (product: Product) => {
        openSidebar("product_form", { product });
    };

    const tabs = [
        { key: "products" as TabKey, label: "Productos", icon: ShoppingBag, count: products.length },
        { key: "categories" as TabKey, label: "Categorías", icon: Layers, count: categories.length },
        { key: "inventory" as TabKey, label: "Inventario", icon: BarChart3, count: lowStockProducts.length > 0 ? lowStockProducts.length : undefined },
    ];

    // ── Category management state ──
    const [newCatName, setNewCatName] = useState("");
    const [newCatSlug, setNewCatSlug] = useState("");
    const [editingCatId, setEditingCatId] = useState<number | null>(null);
    const [editingCatName, setEditingCatName] = useState("");

    // ── Inventory adjustment state ──
    const [adjProductId, setAdjProductId] = useState<number | "">("");
    const [adjQuantity, setAdjQuantity] = useState<string>("");
    const [adjReason, setAdjReason] = useState<string>("restock");
    const [adjLoading, setAdjLoading] = useState(false);

    const handleCreateCategory = async () => {
        if (!newCatName.trim()) return;
        const slug = newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        await createCategory({ name: newCatName.trim(), name_en: null, slug, icon: 'package', sort_order: categories.length + 1, is_active: true });
        setNewCatName("");
        setNewCatSlug("");
    };

    const handleUpdateCategory = async (id: number) => {
        if (!editingCatName.trim()) return;
        await updateCategory(id, { name: editingCatName.trim() });
        setEditingCatId(null);
        setEditingCatName("");
    };

    const handleAdjustStock = async () => {
        if (!adjProductId || !adjQuantity) return;
        setAdjLoading(true);
        await adjustStock(Number(adjProductId), Number(adjQuantity), adjReason as any);
        setAdjProductId("");
        setAdjQuantity("");
        setAdjLoading(false);
    };

    return (
        <div className="bg-admin-bg min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-black leading-6 text-admin-primary">Productos</h1>
                        <p className="mt-2 text-sm text-admin-text-secondary">
                            Gestiona tu catálogo de productos, categorías e inventario.
                        </p>
                    </div>
                    {activeTab === "products" && (
                        <div className="mt-4 sm:flex-none">
                            <Button
                                variant="primary"
                                onClick={handleCreate}
                                className="flex items-center gap-2 bg-admin-primary hover:bg-slate-800 text-white border-none shadow-sm"
                            >
                                <Plus size={18} />
                                Nuevo Producto
                            </Button>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b border-gray-200">
                    <nav className="-mb-px flex gap-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-bold transition-colors ${activeTab === tab.key
                                        ? "border-admin-primary text-admin-primary"
                                        : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${tab.key === "inventory" && lowStockProducts.length > 0
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* ═══════════ PRODUCTS TAB ═══════════ */}
                {activeTab === "products" && (
                    loading ? (
                        <div className="mt-8 flow-root">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 table-fixed">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="w-[30%] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-admin-primary sm:pl-6">Producto</th>
                                            <th className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Categoría</th>
                                            <th className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Precio</th>
                                            <th className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Stock</th>
                                            <th className="w-[10%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Estado</th>
                                            <th className="w-[15%] relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Acciones</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                            <tr key={i}>
                                                <td className="py-4 pl-4 pr-3 sm:pl-6"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></td>
                                                <td className="px-3 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></td>
                                                <td className="px-3 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
                                                <td className="px-3 py-4"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse" /></td>
                                                <td className="px-3 py-4"><div className="h-5 w-14 bg-gray-200 rounded-full animate-pulse" /></td>
                                                <td className="py-4 pl-3 pr-4 sm:pr-6"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse ml-auto" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="mt-8 text-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
                            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-500">No hay productos</h3>
                            <p className="text-gray-400 mt-1 mb-6">Agrega tu primer producto para comenzar a vender.</p>
                            <Button variant="primary" onClick={handleCreate} className="inline-flex items-center gap-2">
                                <Plus size={18} />
                                Crear Producto
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-8 flow-root">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 table-fixed">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="w-[30%] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-admin-primary sm:pl-6">Producto</th>
                                            <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Categoría</th>
                                            <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Precio</th>
                                            <th scope="col" className="w-[15%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Stock</th>
                                            <th scope="col" className="w-[10%] px-3 py-3.5 text-left text-sm font-semibold text-admin-primary">Estado</th>
                                            <th scope="col" className="w-[15%] relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Acciones</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {products.map((product) => {
                                            const isLowStock = product.stock_quantity <= product.low_stock_threshold;
                                            const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0];
                                            return (
                                                <tr
                                                    key={product.id}
                                                    className={`group hover:bg-gray-50 transition-colors cursor-pointer ${!product.is_active ? "opacity-50" : ""}`}
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                                        <div className="flex items-center gap-3">
                                                            {primaryImage ? (
                                                                <img src={primaryImage.url} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-gray-200" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                    <Package size={18} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-semibold text-admin-primary text-sm">{product.name}</p>
                                                                {product.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <span className="text-sm text-gray-600">{product.category?.name || "—"}</span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-admin-primary">
                                                            <DollarSign size={14} className="text-admin-accent" />
                                                            {Number(product.price).toLocaleString()}
                                                        </span>
                                                        {product.compare_at_price && (
                                                            <span className="ml-2 text-xs text-gray-400 line-through">${Number(product.compare_at_price).toLocaleString()}</span>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <span className={`inline-flex items-center gap-1 text-sm font-bold ${isLowStock ? "text-red-600" : "text-gray-700"
                                                            }`}>
                                                            {isLowStock && <AlertTriangle size={14} />}
                                                            {product.stock_quantity}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${product.is_active
                                                            ? "bg-green-50 text-green-700 border border-green-200"
                                                            : "bg-gray-100 text-gray-500 border border-gray-200"
                                                            }`}>
                                                            {product.is_active ? "Activo" : "Inactivo"}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-3 pr-4 sm:pr-6 text-right">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-admin-accent hover:bg-admin-accent/10 transition-colors"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - products.length) }).map((_, i) => (
                                            <tr key={`empty-${i}`}>
                                                <td colSpan={6} className="py-4 pl-4 pr-3 sm:pl-6">&nbsp;</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                )}

                {/* ═══════════ CATEGORIES TAB ═══════════ */}
                {activeTab === "categories" && (
                    <div className="mt-8">
                        {/* Create category */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h3 className="text-sm font-bold text-admin-primary mb-4">Nueva Categoría</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    placeholder="Nombre de categoría"
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent"
                                />
                                <input
                                    type="text"
                                    value={newCatSlug}
                                    onChange={(e) => setNewCatSlug(e.target.value)}
                                    placeholder="slug (auto)"
                                    className="w-40 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent"
                                />
                                <Button variant="primary" onClick={handleCreateCategory} className="bg-admin-primary hover:bg-slate-800 text-white border-none">
                                    <Plus size={16} /> Agregar
                                </Button>
                            </div>
                        </div>

                        {/* Category list */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {catLoading ? (
                                <div className="p-8 text-center text-gray-400">Cargando categorías...</div>
                            ) : categories.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">No hay categorías. Crea una arriba.</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Slug</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Orden</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 w-24"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categories.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-3">
                                                    {editingCatId === cat.id ? (
                                                        <input
                                                            type="text"
                                                            value={editingCatName}
                                                            onChange={(e) => setEditingCatName(e.target.value)}
                                                            onKeyDown={(e) => e.key === "Enter" && handleUpdateCategory(cat.id)}
                                                            className="px-3 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="font-semibold text-admin-primary text-sm">{cat.name}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500">{cat.slug}</td>
                                                <td className="px-6 py-3 text-sm text-gray-500">{cat.sort_order}</td>
                                                <td className="px-6 py-3">
                                                    <button
                                                        onClick={() => updateCategory(cat.id, { is_active: !cat.is_active })}
                                                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${cat.is_active
                                                            ? "bg-green-50 text-green-700 border border-green-200"
                                                            : "bg-gray-100 text-gray-500 border border-gray-200"
                                                            }`}
                                                    >
                                                        {cat.is_active ? "Activa" : "Inactiva"}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex gap-2">
                                                        {editingCatId === cat.id ? (
                                                            <button onClick={() => handleUpdateCategory(cat.id)} className="text-xs font-bold text-admin-accent">Guardar</button>
                                                        ) : (
                                                            <button onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }} className="p-1.5 rounded text-gray-400 hover:text-admin-accent hover:bg-admin-accent/10 transition-colors">
                                                                <Pencil size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════ INVENTORY TAB ═══════════ */}
                {activeTab === "inventory" && (
                    <div className="mt-8 space-y-6">
                        {/* Low Stock Alerts */}
                        {lowStockProducts.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                                    <AlertTriangle size={16} />
                                    Productos con bajo stock ({lowStockProducts.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {lowStockProducts.map((p) => (
                                        <div key={p.id} className="bg-white rounded-lg p-3 border border-red-100 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                                                <p className="text-xs text-gray-400">{p.sku || "Sin SKU"}</p>
                                            </div>
                                            <span className="text-lg font-black text-red-600">{p.stock_quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stock Adjustment */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-bold text-admin-primary mb-4">Ajustar Stock</h3>
                            <div className="flex gap-3 flex-wrap">
                                <select
                                    value={adjProductId}
                                    onChange={(e) => setAdjProductId(e.target.value ? Number(e.target.value) : "")}
                                    className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent"
                                >
                                    <option value="">Seleccionar producto</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_quantity})</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={adjQuantity}
                                    onChange={(e) => setAdjQuantity(e.target.value)}
                                    placeholder="+10 o -5"
                                    className="w-28 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent"
                                />
                                <select
                                    value={adjReason}
                                    onChange={(e) => setAdjReason(e.target.value)}
                                    className="w-40 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent"
                                >
                                    <option value="restock">Reposición</option>
                                    <option value="adjustment">Ajuste</option>
                                    <option value="damage">Daño</option>
                                    <option value="return">Devolución</option>
                                </select>
                                <Button
                                    variant="primary"
                                    onClick={handleAdjustStock}
                                    disabled={!adjProductId || !adjQuantity || adjLoading}
                                    className="bg-admin-primary hover:bg-slate-800 text-white border-none"
                                >
                                    {adjLoading ? "Actualizando..." : "Aplicar"}
                                </Button>
                            </div>
                        </div>

                        {/* Inventory Log */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-sm font-bold text-admin-primary">Historial de Movimientos</h3>
                            </div>
                            {invLoading ? (
                                <div className="p-8 text-center text-gray-400">Cargando historial...</div>
                            ) : logs.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">No hay movimientos de inventario.</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cambio</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Final</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Motivo</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-3 text-sm font-medium text-gray-800">{(log.product as any)?.name || `#${log.product_id}`}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`text-sm font-bold ${log.change_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                                                        {log.change_quantity > 0 ? "+" : ""}{log.change_quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{log.new_quantity}</td>
                                                <td className="px-6 py-3">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${{ sale: "bg-blue-50 text-blue-700", restock: "bg-green-50 text-green-700", adjustment: "bg-yellow-50 text-yellow-700", return: "bg-purple-50 text-purple-700", damage: "bg-red-50 text-red-700" }[log.reason] || "bg-gray-50 text-gray-700"
                                                        }`}>
                                                        {{ sale: "Venta", restock: "Reposición", adjustment: "Ajuste", return: "Devolución", damage: "Daño" }[log.reason] || log.reason}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-500">
                                                    {new Date(log.created_at).toLocaleDateString("es-AR")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
