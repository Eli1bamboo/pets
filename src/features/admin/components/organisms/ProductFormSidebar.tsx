"use client";

import { useState, useEffect, useRef } from "react";
import { Product, ProductCategory, ProductImage } from "@/types";
import { useAdminUI } from "@/providers/AdminUIProvider";
import { useProducts } from "@/features/admin/hooks/useProducts";
import { useCategories } from "@/features/admin/hooks/useCategories";
import { Save, Trash2, Upload, X, Star, ImageIcon } from "lucide-react";
import { Button } from "@/features/admin/components/atoms/Button";
import { createClient } from "@/utils/supabase/client";
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/molecules/SidebarSheet";

interface ProductFormSidebarProps {
    product?: Product;
}

const MAX_IMAGES = 6;

const EMPTY_FORM = {
    name: "",
    name_en: "",
    description: "",
    description_en: "",
    price: 0,
    compare_at_price: "" as string | number,
    sku: "",
    stock_quantity: 0,
    low_stock_threshold: 5,
    category_id: null as number | null,
    is_active: true,
    is_featured: false,
    weight_grams: "" as string | number,
    sort_order: 0,
};

interface ImageItem {
    id?: number;       // existing DB id
    url: string;
    file?: File;       // new upload
    is_primary: boolean;
    sort_order: number;
}

export function ProductFormSidebar({ product }: ProductFormSidebarProps) {
    const { closeSidebar, triggerRefresh } = useAdminUI();
    const { createProduct, updateProduct, deleteProduct } = useProducts({ includeInactive: true });
    const { categories } = useCategories();
    const [form, setForm] = useState(EMPTY_FORM);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [lang, setLang] = useState<"es" | "en">("es");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const isEditing = !!product;

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                name_en: product.name_en || "",
                description: product.description || "",
                description_en: product.description_en || "",
                price: product.price,
                compare_at_price: product.compare_at_price ?? "",
                sku: product.sku || "",
                stock_quantity: product.stock_quantity,
                low_stock_threshold: product.low_stock_threshold,
                category_id: product.category_id,
                is_active: product.is_active,
                is_featured: product.is_featured,
                weight_grams: product.weight_grams ?? "",
                sort_order: product.sort_order,
            });
            setImages(
                (product.images || []).map(img => ({
                    id: img.id,
                    url: img.url,
                    is_primary: img.is_primary,
                    sort_order: img.sort_order,
                }))
            );
        } else {
            setForm(EMPTY_FORM);
            setImages([]);
        }
        setLang("es");
    }, [product]);

    // ── Image handling ──

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const remaining = MAX_IMAGES - images.length;
        const toAdd = Array.from(files).slice(0, remaining);

        const newImages: ImageItem[] = toAdd.map((file, i) => ({
            url: URL.createObjectURL(file),
            file,
            is_primary: images.length === 0 && i === 0,
            sort_order: images.length + i,
        }));

        setImages(prev => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index: number) => {
        setImages(prev => {
            const updated = prev.filter((_, i) => i !== index);
            // If removed the primary, assign first as primary
            if (prev[index].is_primary && updated.length > 0) {
                updated[0].is_primary = true;
            }
            return updated;
        });
    };

    const setPrimaryImage = (index: number) => {
        setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === index })));
    };

    const uploadImages = async (productId: number): Promise<boolean> => {
        try {
            // Upload new files to Supabase Storage
            for (const img of images) {
                if (img.file) {
                    const ext = img.file.name.split('.').pop();
                    const path = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

                    const { error: uploadError } = await supabase.storage
                        .from('product-images')
                        .upload(path, img.file, { upsert: true });

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('product-images')
                        .getPublicUrl(path);

                    img.url = publicUrl;
                    img.file = undefined; // clear file reference
                }
            }

            // Get existing images from DB
            if (isEditing) {
                const { data: existingImages } = await supabase
                    .from('product_images')
                    .select('id')
                    .eq('product_id', productId);

                const existingIds = (existingImages || []).map(i => i.id);
                const keepIds = images.filter(i => i.id).map(i => i.id!);
                const toDelete = existingIds.filter(id => !keepIds.includes(id));

                if (toDelete.length > 0) {
                    await supabase.from('product_images').delete().in('id', toDelete);
                }
            }

            // Upsert all images
            const imageRecords = images.map((img, i) => ({
                ...(img.id ? { id: img.id } : {}),
                product_id: productId,
                url: img.url,
                alt_text: form.name,
                sort_order: i,
                is_primary: img.is_primary,
            }));

            if (imageRecords.length > 0) {
                // Insert new ones (without id)
                const newRecords = imageRecords.filter(r => !('id' in r && r.id));
                const updateRecords = imageRecords.filter(r => 'id' in r && r.id);

                if (newRecords.length > 0) {
                    const { error } = await supabase.from('product_images').insert(newRecords);
                    if (error) throw error;
                }

                for (const rec of updateRecords) {
                    const { id, ...data } = rec;
                    const { error } = await supabase.from('product_images').update(data).eq('id', id!);
                    if (error) throw error;
                }
            }

            return true;
        } catch (err) {
            console.error('Error uploading images:', err);
            return false;
        }
    };

    // ── Save ──

    const handleSave = async () => {
        if (!form.name.trim()) {
            setMessage({ type: "error", text: "El nombre es requerido." });
            return;
        }
        if (form.price <= 0) {
            setMessage({ type: "error", text: "El precio debe ser mayor a 0." });
            return;
        }

        setSaving(true);
        setMessage(null);

        const payload = {
            name: form.name,
            name_en: form.name_en || null,
            description: form.description || null,
            description_en: form.description_en || null,
            price: Number(form.price),
            compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
            sku: form.sku || null,
            stock_quantity: Number(form.stock_quantity),
            low_stock_threshold: Number(form.low_stock_threshold),
            category_id: form.category_id,
            is_active: form.is_active,
            is_featured: form.is_featured,
            weight_grams: form.weight_grams ? Number(form.weight_grams) : null,
            sort_order: Number(form.sort_order),
        };

        let productId: number;

        if (isEditing) {
            const result = await updateProduct(product!.id, payload);
            if (!result.success) {
                setSaving(false);
                setMessage({ type: "error", text: "Error al actualizar producto." });
                return;
            }
            productId = product!.id;
        } else {
            const result = await createProduct(payload as any);
            if (!result.success || !result.data) {
                setSaving(false);
                setMessage({ type: "error", text: "Error al crear producto." });
                return;
            }
            productId = result.data.id;
        }

        // Upload images
        const imageSuccess = await uploadImages(productId);

        setSaving(false);

        if (imageSuccess) {
            setMessage({ type: "success", text: isEditing ? "Producto actualizado." : "Producto creado." });
            triggerRefresh();
            setTimeout(() => closeSidebar(), 800);
        } else {
            setMessage({ type: "error", text: "Producto guardado, pero hubo un error con las imágenes." });
            triggerRefresh();
        }
    };

    const handleDelete = async () => {
        if (!product) return;
        setSaving(true);
        const result = await deleteProduct(product.id);
        setSaving(false);
        if (result.success) {
            triggerRefresh();
            closeSidebar();
        } else {
            setMessage({ type: "error", text: "Error al eliminar producto." });
        }
    };

    // ── Computed for language tabs ──
    const nameValue = lang === "es" ? form.name : form.name_en;
    const descValue = lang === "es" ? form.description : form.description_en;
    const setName = (v: string) => setForm(prev => ({ ...prev, [lang === "es" ? "name" : "name_en"]: v }));
    const setDesc = (v: string) => setForm(prev => ({ ...prev, [lang === "es" ? "description" : "description_en"]: v }));

    return (
        <div className="h-full flex flex-col">
            <SheetHeader className="mb-6">
                <SheetTitle>{isEditing ? "Editar Producto" : "Nuevo Producto"}</SheetTitle>
                <SheetDescription>
                    {isEditing ? "Modifica los datos del producto." : "Completa los datos para crear un nuevo producto."}
                </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto space-y-5">
                {message && (
                    <div className={`p-3 rounded-lg border text-sm font-medium ${message.type === "success"
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Language Tabs */}
                <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
                    <button
                        onClick={() => setLang("es")}
                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${lang === "es"
                            ? "bg-white text-admin-primary shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        🇪🇸 Español
                    </button>
                    <button
                        onClick={() => setLang("en")}
                        className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${lang === "en"
                            ? "bg-white text-admin-primary shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        🇺🇸 English
                    </button>
                </div>

                {/* ── Images ── */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                        Imágenes ({images.length}/{MAX_IMAGES})
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {images.map((img, i) => (
                            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setPrimaryImage(i)}
                                        className={`p-1.5 rounded-full ${img.is_primary ? "bg-yellow-400 text-yellow-900" : "bg-white/80 text-gray-700 hover:bg-yellow-400 hover:text-yellow-900"} transition-colors`}
                                        title="Set as primary"
                                    >
                                        <Star size={14} fill={img.is_primary ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="p-1.5 rounded-full bg-white/80 text-red-600 hover:bg-red-100 transition-colors"
                                        title="Remove"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                {img.is_primary && (
                                    <span className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                        Principal
                                    </span>
                                )}
                            </div>
                        ))}
                        {images.length < MAX_IMAGES && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-admin-accent hover:bg-admin-accent/5 transition-colors flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-admin-accent"
                            >
                                <Upload size={20} />
                                <span className="text-[10px] font-bold uppercase">Agregar</span>
                            </button>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* Name */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre</label>
                    <input
                        type="text"
                        value={nameValue}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                        placeholder={lang === "es" ? "Shampoo para cachorros" : "Puppy Shampoo"}
                    />
                </div>

                {/* Category */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Categoría</label>
                    <select
                        value={form.category_id ?? ""}
                        onChange={e => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : null })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                    >
                        <option value="">Sin categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Price row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Precio</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Precio anterior</label>
                        <input
                            type="number"
                            value={form.compare_at_price}
                            onChange={e => setForm({ ...form, compare_at_price: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                            placeholder="Opcional"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Descripción</label>
                    <textarea
                        value={descValue}
                        onChange={e => setDesc(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent resize-none"
                    />
                </div>

                {/* SKU + Stock row */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">SKU</label>
                        <input
                            type="text"
                            value={form.sku}
                            onChange={e => setForm({ ...form, sku: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                            placeholder="ABC-001"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</label>
                        <input
                            type="number"
                            value={form.stock_quantity}
                            onChange={e => setForm({ ...form, stock_quantity: Number(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Alerta</label>
                        <input
                            type="number"
                            value={form.low_stock_threshold}
                            onChange={e => setForm({ ...form, low_stock_threshold: Number(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                        />
                    </div>
                </div>

                {/* Weight + Sort */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Peso (g)</label>
                        <input
                            type="number"
                            value={form.weight_grams}
                            onChange={e => setForm({ ...form, weight_grams: e.target.value })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                            placeholder="Opcional"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Orden</label>
                        <input
                            type="number"
                            value={form.sort_order}
                            onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                        />
                    </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-bold text-gray-700">Activo</span>
                        <button
                            onClick={() => setForm({ ...form, is_active: !form.is_active })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${form.is_active ? "bg-admin-accent" : "bg-gray-200"}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.is_active ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm font-bold text-gray-700">Destacado</span>
                        <button
                            onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${form.is_featured ? "bg-yellow-400" : "bg-gray-200"}`}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.is_featured ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                {isEditing && (
                    <Button
                        variant="outline"
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                        aria-label="Delete Product"
                    >
                        <Trash2 size={14} />
                    </Button>
                )}
                <Button variant="outline" onClick={() => closeSidebar()} className="flex-1">
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={saving}
                    className="flex-1 flex items-center justify-center gap-2"
                >
                    <Save size={16} />
                    {isEditing ? "Guardar" : "Crear"}
                </Button>
            </div>
        </div>
    );
}
