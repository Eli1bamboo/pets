"use client";

import { useState } from "react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { DateSelector } from "@/components/molecules/DateSelector";
import { TimeSelector } from "@/components/molecules/TimeSelector";
import { useAvailability } from "@/hooks/useAvailability";
import { useBooking } from "@/hooks/useBooking";
import { Loader2, CheckCircle2, Dog } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { FormField } from "@/components/molecules/FormField";
import { SERVICES_PRICE_MAP } from "@/config/appointments";
import Modal from "@/components/molecules/Modal";

const SERVICES = [
    { title: 'Baño y Secado', price: '$4500' },
    { title: 'Corte Completo', price: '$6500' },
    { title: 'Spa de Deslanado', price: '$8000' }
];

export default function BookingPage() {
    const { user, loading: authLoading } = useCustomerAuth({ redirectToLogin: true });
    const { createBooking, submitting, error: bookingError } = useBooking();
    const [step, setStep] = useState(1);
    const [formError, setFormError] = useState<string | null>(null);
    const [modal, setModal] = useState({ open: false, title: "", message: "", type: "error" as const });

    const [formData, setFormData] = useState({
        petName: "",
        service: "Baño y Secado",
        notes: ""
    });

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const { busySlots, availableHours, loading: availabilityLoading } = useAvailability(date);

    if (authLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-brand-600" /></div>;

    const handleBooking = async () => {
        if (!user) return;

        const result = await createBooking({
            userId: user.id,
            petName: formData.petName,
            service: formData.service,
            date,
            time,
            price: SERVICES_PRICE_MAP[formData.service] || 0,
        });

        if (result && !result.success) {
            setModal({ open: true, title: "Error al reservar", message: result.error || "Ocurrió un error inesperado.", type: "error" });
        }
    };

    return (
        <div className="py-8 md:py-16">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <Card variant="standard" padding="none" className="overflow-hidden ring-1 ring-brand-900/5">
                    <div className="px-6 py-10 sm:p-12">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-brand-900">Reservar Turno</h2>
                            <div className="flex gap-2.5">
                                <span className={`h-2.5 w-10 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-brand-500' : 'bg-brand-200'}`} />
                                <span className={`h-2.5 w-10 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-brand-500' : 'bg-brand-200'}`} />
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="space-y-8">
                                <FormField
                                    id="petName"
                                    label="Nombre de tu Mascota"
                                    placeholder="Ej: Rocco"
                                    leftIcon={Dog}
                                    value={formData.petName}
                                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                />

                                <div>
                                    <label className="block text-sm font-bold leading-6 text-brand-900 mb-3">¿Qué servicio necesita?</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        {SERVICES.map((s) => (
                                            <div
                                                key={s.title}
                                                onClick={() => setFormData({ ...formData, service: s.title })}
                                                className={`cursor-pointer rounded-2xl border-2 p-5 flex items-center justify-between transition-all duration-200 ${formData.service === s.title
                                                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-500 shadow-md'
                                                    : 'border-brand-900/5 hover:border-brand-200 bg-white'
                                                    }`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-base font-bold ${formData.service === s.title ? 'text-brand-500' : 'text-brand-900'}`}>{s.title}</span>
                                                    <span className={`text-sm font-medium ${formData.service === s.title ? 'text-brand-400' : 'text-brand-500'}`}>{s.price}</span>
                                                </div>
                                                {formData.service === s.title && (
                                                    <div className="bg-brand-500 rounded-full p-1">
                                                        <CheckCircle2 size={24} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
                                                setFormError("Ingresa el nombre de tu mascota");
                                                return;
                                            }
                                            setFormError(null);
                                            setStep(2);
                                        }}
                                        className="h-14 text-lg"
                                        variant="primary"
                                    >
                                        Elegir fecha y hora
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
                                        Atrás
                                    </Button>
                                    <Button
                                        onClick={handleBooking}
                                        isLoading={submitting}
                                        disabled={!date || !time}
                                        className="h-14 text-lg"
                                    >
                                        Confirmar Turno
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
