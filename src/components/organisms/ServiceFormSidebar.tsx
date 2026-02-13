"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types";
import { useAdminUI } from "@/providers/AdminUIProvider";
import { useServices } from "@/hooks/useServices";
import { Save, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useTranslation } from "@/i18n/LanguageContext";
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/molecules/SidebarSheet";

interface ServiceFormSidebarProps {
    service?: Service;
}

const EMPTY_FORM = {
    name: "",
    name_en: "",
    price: 0,
    description: "",
    description_en: "",
    features: [] as string[],
    features_en: [] as string[],
    icon: "scissors",
    is_active: true,
    sort_order: 0,
};

export function ServiceFormSidebar({ service }: ServiceFormSidebarProps) {
    const { closeSidebar, triggerRefresh } = useAdminUI();
    const { createService, updateService, deleteService } = useServices({ includeInactive: true });
    const [form, setForm] = useState(EMPTY_FORM);
    const [featureInput, setFeatureInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [lang, setLang] = useState<"es" | "en">("es");
    const { t } = useTranslation();

    const isEditing = !!service;

    useEffect(() => {
        if (service) {
            setForm({
                name: service.name,
                name_en: service.name_en || "",
                price: service.price,
                description: service.description || "",
                description_en: service.description_en || "",
                features: service.features || [],
                features_en: service.features_en || [],
                icon: service.icon || "scissors",
                is_active: service.is_active,
                sort_order: service.sort_order,
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setLang("es");
    }, [service]);

    const handleSave = async () => {
        if (!form.name.trim()) {
            setMessage({ type: "error", text: t.admin.services.nameRequired });
            return;
        }
        setSaving(true);
        setMessage(null);

        const payload = {
            ...form,
            name_en: form.name_en || null,
            description: form.description || null,
            description_en: form.description_en || null,
        };

        const result = isEditing
            ? await updateService(service!.id, payload)
            : await createService(payload as any);

        setSaving(false);

        if (result.success) {
            setMessage({ type: "success", text: isEditing ? t.admin.services.updated : t.admin.services.created });
            triggerRefresh();
            setTimeout(() => closeSidebar(), 800);
        } else {
            setMessage({ type: "error", text: result.error || t.admin.services.saveError });
        }
    };

    const handleDelete = async () => {
        if (!service) return;
        setSaving(true);
        const result = await deleteService(service.id);
        setSaving(false);
        if (result.success) {
            triggerRefresh();
            closeSidebar();
        } else {
            setMessage({ type: "error", text: t.admin.services.deleteError });
        }
    };

    const addFeature = () => {
        if (!featureInput.trim()) return;
        const key = lang === "es" ? "features" : "features_en";
        setForm(prev => ({ ...prev, [key]: [...prev[key], featureInput.trim()] }));
        setFeatureInput("");
    };

    const removeFeature = (idx: number) => {
        const key = lang === "es" ? "features" : "features_en";
        setForm(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
    };

    // Computed values based on active language tab
    const nameValue = lang === "es" ? form.name : form.name_en;
    const descValue = lang === "es" ? form.description : form.description_en;
    const featuresValue = lang === "es" ? form.features : form.features_en;

    const setName = (v: string) => setForm(prev => ({ ...prev, [lang === "es" ? "name" : "name_en"]: v }));
    const setDesc = (v: string) => setForm(prev => ({ ...prev, [lang === "es" ? "description" : "description_en"]: v }));

    return (
        <div className="h-full flex flex-col">
            <SheetHeader className="mb-6">
                <SheetTitle>{isEditing ? t.admin.services.editTitle : t.admin.services.newTitle}</SheetTitle>
                <SheetDescription>
                    {isEditing ? t.admin.services.editDescription : t.admin.services.newDescription}
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

                {/* Name (language-dependent) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {t.admin.services.nameLabel}
                    </label>
                    <input
                        type="text"
                        value={nameValue}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                        placeholder={lang === "es" ? "Baño y Secado" : "Bath & Dry"}
                    />
                </div>

                {/* Price (shared) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t.admin.services.price}</label>
                    <input
                        type="number"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                    />
                </div>

                {/* Description (language-dependent) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {t.admin.services.descriptionLabel}
                    </label>
                    <textarea
                        value={descValue}
                        onChange={e => setDesc(e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent resize-none"
                    />
                </div>

                {/* Features (language-dependent) */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {t.admin.services.featuresLabel}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={featureInput}
                            onChange={e => setFeatureInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-admin-accent focus:ring-admin-accent"
                            placeholder={t.admin.services.addFeaturePlaceholder}
                        />
                        <Button variant="admin-outline" onClick={addFeature} className="px-3 py-2 text-xs">+</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {featuresValue.map((f, i) => (
                            <span key={i} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${lang === "es" ? "bg-gray-100 text-gray-700" : "bg-blue-50 text-blue-700"}`}>
                                {f}
                                <button onClick={() => removeFeature(i)} className="hover:text-red-500 ml-1">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Icon (shared) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t.admin.services.iconLabel}</label>
                    <select
                        value={form.icon}
                        onChange={e => setForm({ ...form, icon: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                    >
                        <option value="bath">🛁 Baño</option>
                        <option value="scissors">✂️ Tijeras</option>
                        <option value="wind">💨 Viento</option>
                        <option value="sparkles">✨ Sparkles</option>
                        <option value="heart">❤️ Corazón</option>
                        <option value="star">⭐ Estrella</option>
                    </select>
                </div>

                {/* Sort order (shared) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t.admin.services.sortOrderLabel}</label>
                    <input
                        type="number"
                        value={form.sort_order}
                        onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-admin-accent focus:ring-admin-accent"
                    />
                </div>

                {/* Active toggle (shared) */}
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-bold text-gray-700">{t.admin.services.activeLabel}</span>
                    <button
                        onClick={() => setForm({ ...form, is_active: !form.is_active })}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${form.is_active ? "bg-admin-accent" : "bg-gray-200"}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.is_active ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex gap-3">
                {isEditing && (
                    <Button
                        variant="admin-outline"
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                        <Trash2 size={14} />
                    </Button>
                )}
                <Button variant="admin-outline" onClick={() => closeSidebar()} className="flex-1">
                    {t.admin.services.close}
                </Button>
                <Button
                    variant="admin-primary"
                    onClick={handleSave}
                    isLoading={saving}
                    className="flex-1 flex items-center justify-center gap-2"
                >
                    <Save size={16} />
                    {isEditing ? t.admin.services.save : t.admin.services.create}
                </Button>
            </div>
        </div>
    );
}
