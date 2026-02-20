"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Trash2, Star, Check, Home, Briefcase, Building } from "lucide-react";
import { UserAddress } from "@/types";
import { useAddresses } from "@/features/customer/hooks/useAddresses";

interface AddressSelectorProps {
    selectedAddressId: number | null;
    onSelect: (address: UserAddress) => void;
}

const LABEL_ICONS: Record<string, React.ReactNode> = {
    "Casa": <Home size={14} />,
    "Home": <Home size={14} />,
    "Trabajo": <Briefcase size={14} />,
    "Work": <Briefcase size={14} />,
    "Otro": <Building size={14} />,
    "Other": <Building size={14} />,
};

export function AddressSelector({ selectedAddressId, onSelect }: AddressSelectorProps) {
    const { addresses, loading, addAddress, deleteAddress, setDefault } = useAddresses();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        label: "Casa",
        street: "",
        city: "",
        state: "",
        zip_code: "",
        notes: "",
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.street.trim() || !form.city.trim()) return;

        setSaving(true);
        const newAddr = await addAddress({
            label: form.label,
            street: form.street.trim(),
            city: form.city.trim(),
            state: form.state.trim() || null,
            zip_code: form.zip_code.trim() || null,
            notes: form.notes.trim() || null,
            is_default: addresses.length === 0,
        });

        if (newAddr) {
            onSelect(newAddr);
            setShowForm(false);
            setForm({ label: "Casa", street: "", city: "", state: "", zip_code: "", notes: "" });
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2].map(i => (
                    <div key={i} className="h-20 rounded-2xl bg-brand-100 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Saved addresses */}
            {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                    <motion.div
                        key={addr.id}
                        layout
                        onClick={() => onSelect(addr)}
                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                            ? "border-primary-orange bg-orange-50/50 shadow-md shadow-orange-100"
                            : "border-brand-100 bg-white hover:border-brand-300"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary-orange text-white" : "bg-brand-100 text-brand-500"
                                }`}>
                                {LABEL_ICONS[addr.label] || <MapPin size={14} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-brand-900">{addr.label}</span>
                                    {addr.is_default && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary-orange bg-orange-100 px-1.5 py-0.5 rounded-full">
                                            Principal
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-brand-600 mt-0.5 line-clamp-1">{addr.street}</p>
                                <p className="text-xs text-brand-400">{addr.city}{addr.state ? `, ${addr.state}` : ""}{addr.zip_code ? ` · CP ${addr.zip_code}` : ""}</p>
                            </div>
                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                    <Check size={18} className="text-primary-orange" />
                                </div>
                            )}
                        </div>

                        {/* Quick actions */}
                        <div className="flex gap-2 mt-3 pt-2 border-t border-brand-100">
                            {!addr.is_default && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDefault(addr.id); }}
                                    className="text-[11px] font-semibold text-brand-500 hover:text-primary-orange flex items-center gap-1 transition-colors"
                                >
                                    <Star size={12} /> Predeterminada
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteAddress(addr.id); }}
                                className="text-[11px] font-semibold text-brand-400 hover:text-red-500 flex items-center gap-1 transition-colors ml-auto"
                            >
                                <Trash2 size={12} /> Eliminar
                            </button>
                        </div>
                    </motion.div>
                );
            })}

            {/* Add new address */}
            <AnimatePresence>
                {showForm ? (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-4 space-y-3 overflow-hidden"
                    >
                        {/* Label */}
                        <div className="flex gap-2">
                            {["Casa", "Trabajo", "Otro"].map(l => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, label: l }))}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${form.label === l
                                        ? "bg-brand-900 text-white"
                                        : "bg-white text-brand-600 border border-brand-200 hover:border-brand-400"
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        <input
                            type="text"
                            placeholder="Calle y número *"
                            value={form.street}
                            onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                            required
                            className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange"
                        />

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Ciudad *"
                                value={form.city}
                                onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                                required
                                className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange"
                            />
                            <input
                                type="text"
                                placeholder="Código postal"
                                value={form.zip_code}
                                onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))}
                                className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange"
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Provincia"
                            value={form.state}
                            onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                            className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange"
                        />

                        <input
                            type="text"
                            placeholder="Notas de entrega (timbre, piso, etc.)"
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange"
                        />

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={saving || !form.street.trim() || !form.city.trim()}
                                className="flex-1 py-2.5 rounded-xl bg-brand-900 text-white text-sm font-bold hover:bg-primary-orange transition-colors disabled:opacity-50"
                            >
                                {saving ? "Guardando..." : "Guardar dirección"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2.5 rounded-xl border border-brand-200 text-sm font-bold text-brand-600 hover:border-brand-400 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.button
                        layout
                        onClick={() => setShowForm(true)}
                        className="w-full p-4 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/30 hover:border-brand-400 hover:bg-brand-50 transition-all flex items-center justify-center gap-2 text-sm font-bold text-brand-500"
                    >
                        <Plus size={16} />
                        Agregar nueva dirección
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
