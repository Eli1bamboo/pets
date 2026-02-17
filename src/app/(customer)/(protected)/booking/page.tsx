"use client";

import { useState, useEffect } from "react";
import { useCustomerContext } from "@/providers/CustomerProvider";
import { DateSelector } from "@/components/molecules/DateSelector";
import { TimeSelector } from "@/components/molecules/TimeSelector";
import { useAvailability } from "@/features/customer/hooks/useAvailability";
import { useBooking } from "@/features/customer/hooks/useBooking";
import { useServices } from "@/features/customer/hooks/useServices";
import { Loader2, Dog, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/features/customer/components/atoms/Button";
import { FormField } from "@/features/customer/components/molecules/FormField";
import { Modal } from "@/features/customer/components/molecules/Modal";
import { useTranslation } from "@/i18n/LanguageContext";
import { BookingSummary } from "@/features/customer/components/organisms/BookingSummary";
import { motion } from "framer-motion";

export default function BookingPage() {
    const { user, loading: authLoading } = useCustomerContext();
    const { createBooking, submitting, error: bookingError } = useBooking();
    const { services, loading: servicesLoading } = useServices();
    const [step, setStep] = useState(1);
    const [formError, setFormError] = useState<string | null>(null);
    const [modal, setModal] = useState({ open: false, title: "", message: "", type: "error" as const });
    const { t, language } = useTranslation();

    const [formData, setFormData] = useState({
        petName: "",
        service: "",
        notes: ""
    });

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const { busySlots, availableHours, loading: availabilityLoading } = useAvailability(date);

    // Set default service when services load
    useEffect(() => {
        if (services.length > 0 && !formData.service) {
            setFormData(prev => ({ ...prev, service: services[0].name }));
        }
    }, [services]);

    if (authLoading || servicesLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-brand-600" /></div>;

    const handleBooking = async () => {
        if (!user) return;

        const selectedService = services.find(s => s.name === formData.service);

        const result = await createBooking({
            userId: user.id,
            petName: formData.petName,
            service: formData.service,
            date,
            time,
            price: selectedService ? Number(selectedService.price) : 0,
        });

        if (result && !result.success) {
            setModal({ open: true, title: t.booking.errorTitle, message: result.error || t.booking.errorFallback, type: "error" });
        }
    };

    const selectedServiceData = services.find(s => s.name === formData.service);

    return (
        <div className="py-8 md:py-12 lg:py-16 bg-brand-50 min-h-screen">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl mb-4">{t.booking.title}</h1>
                            <p className="text-lg text-brand-600">Completá los pasos para reservar el turno de tu mascota.</p>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2">
                            {[1, 2].map((s) => (
                                <div key={s} className="flex items-center gap-3">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${step === s
                                        ? 'bg-primary-orange text-white ring-4 ring-orange-100'
                                        : step > s
                                            ? 'bg-green-500 text-white'
                                            : 'bg-brand-200 text-brand-700'
                                        }`}>
                                        {step > s ? <CheckCircle2 size={18} /> : s}
                                    </div>
                                    <span className={`text-sm font-bold whitespace-nowrap ${step === s ? 'text-brand-900' : 'text-brand-400'}`}>
                                        {s === 1 ? 'Datos & Servicio' : 'Fecha & Hora'}
                                    </span>
                                    {s < 2 && <ChevronRight className="text-brand-300" size={16} />}
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-[2rem] shadow-xl shadow-brand-900/5 ring-1 ring-brand-900/5 p-6 sm:p-10 relative overflow-hidden">
                            {/* Content */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-10"
                                >
                                    <FormField
                                        id="petName"
                                        label={t.booking.petNameLabel}
                                        placeholder={t.booking.petNamePlaceholder}
                                        leftIcon={Dog}
                                        value={formData.petName}
                                        onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                        className="text-lg"
                                    />

                                    <div>
                                        <label className="block text-sm font-bold uppercase tracking-wider text-brand-900 mb-4">{t.booking.serviceLabel}</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            {services.map((s) => {
                                                const displayName = language === "en" && s.name_en ? s.name_en : s.name;
                                                const isSelected = formData.service === s.name;
                                                return (
                                                    <div
                                                        key={s.name}
                                                        onClick={() => setFormData({ ...formData, service: s.name })}
                                                        className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center justify-between transition-all duration-200 group ${isSelected
                                                            ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500 shadow-md transform scale-[1.01]'
                                                            : 'border-brand-100/50 hover:border-brand-300 bg-white hover:bg-brand-50/30'
                                                            }`}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className={`text-lg font-bold mb-1 ${isSelected ? 'text-brand-900' : 'text-brand-700'}`}>{displayName}</span>
                                                            <span className={`text-sm font-medium ${isSelected ? 'text-brand-500' : 'text-brand-400'}`}>${Number(s.price).toLocaleString()}</span>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-brand-500 bg-brand-500' : 'border-brand-200 group-hover:border-brand-400'}`}>
                                                            {isSelected && <CheckCircle2 size={16} className="text-white" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {formError && (
                                        <p className="text-sm text-red-600 font-medium bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-2">
                                            <span className="text-lg">⚠️</span> {formError}
                                        </p>
                                    )}

                                    <div className="pt-4">
                                        <Button
                                            onClick={() => {
                                                if (!formData.petName) {
                                                    setFormError(t.booking.petNameRequired);
                                                    return;
                                                }
                                                setFormError(null);
                                                setStep(2);
                                            }}
                                            className="w-full sm:w-auto px-10 h-14 text-lg"
                                            variant="primary"
                                        >
                                            {t.booking.nextStep}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-12"
                                >
                                    <div className="bg-brand-50/50 p-6 md:p-8 rounded-[2rem] border border-brand-100/50">
                                        <DateSelector selectedDate={date} onSelect={setDate} />
                                    </div>

                                    {date && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <TimeSelector
                                                selectedTime={time}
                                                onSelect={setTime}
                                                busySlots={busySlots}
                                                availableHours={availableHours}
                                                loading={availabilityLoading}
                                            />
                                        </div>
                                    )}

                                    <div className="pt-6 flex gap-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="h-14 px-8 border-2 border-brand-200 hover:border-brand-400 text-brand-600"
                                        >
                                            {t.booking.back}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="hidden lg:block lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
                        <BookingSummary
                            petName={formData.petName}
                            serviceName={selectedServiceData ? (language === "en" && selectedServiceData.name_en ? selectedServiceData.name_en : selectedServiceData.name) : ""}
                            servicePrice={selectedServiceData ? String(selectedServiceData.price) : "0"}
                            date={date}
                            time={time}
                            onConfirm={handleBooking}
                            isSubmitting={submitting}
                            canConfirm={Boolean(formData.petName && formData.service && date && time)}
                        />
                    </div>

                    {/* Mobile Floating Action Button / Bottom Sheet substitute (simplified) */}
                    {/* For mobile, we might rely on the main "Next" / "Confirm" buttons inside step, 
                         but adding a sticky bottom summary could be good. 
                         For now, the summary inside layout handles desktop. 
                         Mobile users will use flow buttons. 
                      */}
                </div>
            </div>

            <Modal
                open={modal.open}
                onClose={() => setModal(prev => ({ ...prev, open: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}
