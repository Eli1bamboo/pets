"use client";

import { useState, useEffect } from "react";
import { useCustomerContext } from "@/providers/CustomerProvider";
import { DateSelector } from "@/components/molecules/DateSelector";
import { TimeSelector } from "@/components/molecules/TimeSelector";
import { useAvailability } from "@/hooks/useAvailability";
import { useBooking } from "@/hooks/useBooking";
import { useServices } from "@/hooks/useServices";
import { Loader2, CheckCircle2, Dog } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { useTranslation } from "@/i18n/LanguageContext";

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

    return (
        <div className="py-8 md:py-16">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <Card variant="standard" padding="none" className="overflow-hidden ring-1 ring-brand-900/5">
                    <div className="px-6 py-10 sm:p-12">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-brand-900">{t.booking.title}</h2>
                            <div className="flex gap-2.5">
                                <span className={`h-2.5 w-10 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-brand-500' : 'bg-brand-200'}`} />
                                <span className={`h-2.5 w-10 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-brand-500' : 'bg-brand-200'}`} />
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="space-y-8">
                                <FormField
                                    id="petName"
                                    label={t.booking.petNameLabel}
                                    placeholder={t.booking.petNamePlaceholder}
                                    leftIcon={Dog}
                                    value={formData.petName}
                                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                />

                                <div>
                                    <label className="block text-sm font-bold leading-6 text-brand-900 mb-3">{t.booking.serviceLabel}</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {services.map((s) => {
                                            const displayName = language === "en" && s.name_en ? s.name_en : s.name;
                                            return (
                                                <div
                                                    key={s.name}
                                                    onClick={() => setFormData({ ...formData, service: s.name })}
                                                    className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center justify-between transition-all duration-200 ${formData.service === s.name
                                                        ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500 shadow-md'
                                                        : 'border-brand-900/5 hover:border-brand-200 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className={`text-base font-bold ${formData.service === s.name ? 'text-brand-500' : 'text-brand-900'}`}>{displayName}</span>
                                                        <span className={`text-sm font-medium ${formData.service === s.name ? 'text-brand-400' : 'text-brand-500'}`}>${Number(s.price).toLocaleString()}</span>
                                                    </div>
                                                    {formData.service === s.name && (
                                                        <div className="bg-brand-500 rounded-full p-1">
                                                            <CheckCircle2 size={24} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {formError && (
                                    <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-100">
                                        {formError}
                                    </p>
                                )}

                                <div className="pt-6">
                                    <Button
                                        onClick={() => {
                                            if (!formData.petName) {
                                                setFormError(t.booking.petNameRequired);
                                                return;
                                            }
                                            setFormError(null);
                                            setStep(2);
                                        }}
                                        className="h-14 text-lg"
                                        variant="primary"
                                    >
                                        {t.booking.nextStep}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10">
                                <div className="bg-brand-50/50 p-6 rounded-3xl border border-brand-100">
                                    <DateSelector selectedDate={date} onSelect={setDate} />
                                </div>

                                {date && (
                                    <div className="px-2">
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
                                        className="h-14"
                                    >
                                        {t.booking.back}
                                    </Button>
                                    <Button
                                        onClick={handleBooking}
                                        isLoading={submitting}
                                        disabled={!date || !time}
                                        className="h-14 text-lg"
                                    >
                                        {t.booking.confirm}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
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
