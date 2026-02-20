"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, ShoppingBag, CreditCard, AlertCircle, Loader2, Store, Truck } from "lucide-react";
import { useCartContext } from "@/providers/CartProvider";
import { useTranslation } from "@/i18n/LanguageContext";
import { useShippingZones } from "@/features/customer/hooks/useShippingZones";
import { AddressSelector } from "@/features/customer/components/organisms/AddressSelector";
import { FulfillmentType, UserAddress } from "@/types";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, cartTotal, loading: cartLoading } = useCartContext();
    const { language } = useTranslation();
    const checkout = ((useTranslation().t) as any).checkout;

    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
    const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);

    const { zones, calculateShipping } = useShippingZones();

    // Calculate shipping fee based on selected address
    const shippingResult = useMemo(() => {
        if (fulfillment === "pickup" || !selectedAddress) return null;
        return calculateShipping(selectedAddress.zip_code, cartTotal);
    }, [fulfillment, selectedAddress, cartTotal, calculateShipping]);

    const shippingFee = fulfillment === "delivery" ? (shippingResult?.fee ?? 0) : 0;
    const total = cartTotal + shippingFee;
    const noZoneMatch = fulfillment === "delivery" && selectedAddress?.zip_code && !shippingResult;

    const handleCheckout = async () => {
        setError(null);

        if (fulfillment === "delivery" && !selectedAddress) {
            setError(checkout?.selectAddressError ?? "Seleccioná una dirección de envío");
            return;
        }

        if (noZoneMatch) {
            setError(checkout?.noZoneError ?? "No hacemos envíos a ese código postal. Probá con otra dirección o elegí Retiro en local.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fulfillment_type: fulfillment,
                    notes: notes.trim() || null,
                    shipping_address: fulfillment === "delivery" && selectedAddress ? {
                        id: selectedAddress.id,
                        label: selectedAddress.label,
                        street: selectedAddress.street,
                        city: selectedAddress.city,
                        state: selectedAddress.state,
                        zip_code: selectedAddress.zip_code,
                        notes: selectedAddress.notes,
                    } : null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Error en el checkout");
                setSubmitting(false);
                return;
            }

            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch {
            setError("Error de conexión. Intentá de nuevo.");
            setSubmitting(false);
        }
    };

    if (cartLoading) {
        return (
            <div className="bg-background-cream min-h-screen flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-brand-400" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-background-cream min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
                        <ShoppingBag size={32} className="text-brand-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-900">
                        {checkout?.emptyTitle ?? "Tu carrito está vacío"}
                    </h2>
                    <p className="mt-2 text-sm text-brand-500">
                        {checkout?.emptySubtitle ?? "Agregá productos para continuar con la compra."}
                    </p>
                    <Link
                        href="/shop"
                        className="mt-6 inline-block rounded-2xl bg-brand-900 px-8 py-3 text-sm font-bold text-white hover:bg-primary-orange transition-colors"
                    >
                        {checkout?.goToShop ?? "Ir a la tienda"}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-cream min-h-screen">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8 sm:py-12">
                {/* Back */}
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-primary-orange transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    {checkout?.backToShop ?? "Volver a la tienda"}
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-900 tracking-tight">
                        {checkout?.title ?? "Checkout"}
                    </h1>
                    <p className="mt-2 text-base text-brand-500">
                        {checkout?.subtitle ?? "Revisá tu pedido y completá el pago"}
                    </p>
                </motion.div>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Order items + Fulfillment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="rounded-3xl bg-white border border-brand-100 p-6 shadow-lg shadow-brand-900/5"
                        >
                            <h2 className="text-lg font-extrabold text-brand-900 mb-6">
                                {checkout?.orderSummary ?? "Resumen del pedido"}
                            </h2>
                            <div className="divide-y divide-brand-100">
                                {items.map((item) => {
                                    const product = item.product;
                                    if (!product) return null;
                                    const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
                                    const name = language === "en" && product.name_en ? product.name_en : product.name;

                                    return (
                                        <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-50 border border-brand-100 flex-shrink-0">
                                                {primaryImage ? (
                                                    <img src={primaryImage.url} alt={name} className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-brand-300">
                                                        <ShoppingBag size={20} strokeWidth={1} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-brand-900 line-clamp-1">{name}</p>
                                                <p className="text-xs text-brand-500 mt-0.5">
                                                    x{item.quantity} · ${product.price.toLocaleString()} c/u
                                                </p>
                                            </div>
                                            <span className="text-sm font-extrabold text-brand-900">
                                                ${(product.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Fulfillment Toggle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="rounded-3xl bg-white border border-brand-100 p-6 shadow-lg shadow-brand-900/5"
                        >
                            <h2 className="text-lg font-extrabold text-brand-900 mb-4">
                                {checkout?.fulfillmentTitle ?? "¿Cómo lo querés?"}
                            </h2>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setFulfillment("pickup")}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${fulfillment === "pickup"
                                        ? "border-primary-orange bg-orange-50/50 shadow-md shadow-orange-100"
                                        : "border-brand-100 bg-white hover:border-brand-300"
                                        }`}
                                >
                                    <Store size={24} className={fulfillment === "pickup" ? "text-primary-orange" : "text-brand-400"} />
                                    <span className={`text-sm font-bold ${fulfillment === "pickup" ? "text-brand-900" : "text-brand-600"}`}>
                                        {checkout?.pickupTab ?? "Retiro en local"}
                                    </span>
                                    <span className="text-[11px] text-brand-400 font-semibold">
                                        {checkout?.free ?? "Gratis"}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setFulfillment("delivery")}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${fulfillment === "delivery"
                                        ? "border-primary-orange bg-orange-50/50 shadow-md shadow-orange-100"
                                        : "border-brand-100 bg-white hover:border-brand-300"
                                        }`}
                                >
                                    <Truck size={24} className={fulfillment === "delivery" ? "text-primary-orange" : "text-brand-400"} />
                                    <span className={`text-sm font-bold ${fulfillment === "delivery" ? "text-brand-900" : "text-brand-600"}`}>
                                        {checkout?.deliveryTab ?? "Envío a domicilio"}
                                    </span>
                                    <span className="text-[11px] text-brand-400 font-semibold">
                                        {checkout?.shippingFeeLabel ?? "Según zona"}
                                    </span>
                                </button>
                            </div>

                            {/* Pickup info */}
                            <AnimatePresence mode="wait">
                                {fulfillment === "pickup" && (
                                    <motion.div
                                        key="pickup"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-brand-50 mt-4">
                                            <MapPin size={20} className="text-primary-orange flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-bold text-brand-900">Peluquería Canina</p>
                                                <p className="text-xs text-brand-500 mt-1">
                                                    {checkout?.pickupNote ?? "Tu pedido estará listo para retirar una vez confirmado el pago."}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {fulfillment === "delivery" && (
                                    <motion.div
                                        key="delivery"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4">
                                            <p className="text-sm font-bold text-brand-700 mb-3">
                                                {checkout?.selectAddress ?? "Seleccioná una dirección de envío"}
                                            </p>
                                            <AddressSelector
                                                selectedAddressId={selectedAddress?.id ?? null}
                                                onSelect={setSelectedAddress}
                                            />

                                            {/* Shipping zone info */}
                                            {selectedAddress && shippingResult && (
                                                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100">
                                                    <Truck size={14} className="text-green-600" />
                                                    <span className="text-xs font-bold text-green-700">
                                                        {shippingResult.fee === 0
                                                            ? (checkout?.freeShippingApplied ?? "¡Envío gratis!")
                                                            : `${checkout?.shippingZone ?? "Zona"}: ${shippingResult.zone.name} · $${shippingResult.fee.toLocaleString()}`}
                                                    </span>
                                                    {shippingResult.fee > 0 && shippingResult.zone.free_shipping_min && (
                                                        <span className="text-[10px] text-green-500 ml-auto">
                                                            {checkout?.freeAbove ?? "Gratis desde"} ${shippingResult.zone.free_shipping_min.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {noZoneMatch && (
                                                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                                                    <AlertCircle size={14} className="text-amber-600" />
                                                    <span className="text-xs font-bold text-amber-700">
                                                        {checkout?.noZoneWarning ?? "No hacemos envíos a este código postal por ahora."}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Notes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="rounded-3xl bg-white border border-brand-100 p-6 shadow-lg shadow-brand-900/5"
                        >
                            <h2 className="text-lg font-extrabold text-brand-900 mb-4">
                                {checkout?.notesLabel ?? "Notas (opcional)"}
                            </h2>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder={checkout?.notesPlaceholder ?? "Algún comentario sobre tu pedido..."}
                                rows={3}
                                className="w-full rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-primary-orange/30 focus:border-primary-orange resize-none transition-all"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Summary & Pay */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="sticky top-28 rounded-3xl bg-white border border-brand-100 p-6 shadow-lg shadow-brand-900/5"
                        >
                            <h2 className="text-lg font-extrabold text-brand-900 mb-6">
                                {checkout?.total ?? "Total"}
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-brand-500">Subtotal</span>
                                    <span className="font-bold text-brand-900">${cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-brand-500">{checkout?.shipping ?? "Envío"}</span>
                                    <span className={`font-bold ${shippingFee === 0 ? "text-green-600" : "text-brand-900"}`}>
                                        {shippingFee === 0
                                            ? (checkout?.free ?? "Gratis")
                                            : `$${shippingFee.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="border-t border-brand-100 pt-3 flex justify-between">
                                    <span className="text-base font-bold text-brand-900">Total</span>
                                    <span className="text-2xl font-extrabold text-brand-900">${total.toLocaleString()}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs font-medium text-red-700">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={submitting || (fulfillment === "delivery" && (!selectedAddress || !!noZoneMatch))}
                                className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#009ee3] py-4 text-sm font-bold text-white hover:bg-[#0080c0] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[#009ee3]/20"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        {checkout?.processing ?? "Procesando..."}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={18} />
                                        {checkout?.payButton ?? "Pagar con MercadoPago"}
                                    </>
                                )}
                            </button>

                            <p className="mt-3 text-center text-[11px] text-brand-400">
                                {checkout?.secureNote ?? "Pago seguro procesado por MercadoPago"}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
