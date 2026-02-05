"use client";

import { useState } from "react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { DateSelector } from "@/components/molecules/DateSelector";
import { TimeSelector } from "@/components/molecules/TimeSelector";
import { useAvailability } from "@/hooks/useAvailability";
import { useBooking } from "@/hooks/useBooking";
import { Loader2, CheckCircle2, Dog } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";

const SERVICES = [
    { title: 'Baño y Secado', price: '$4500' },
    { title: 'Corte Completo', price: '$6500' },
    { title: 'Spa de Deslanado', price: '$8000' }
];

// ...

export default function BookingPage() {
    const { user, loading: authLoading } = useCustomerAuth({ redirectToLogin: true });
    const { createBooking, submitting } = useBooking();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        petName: "",
        service: "Baño y Secado",
        notes: ""
    });

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const { busySlots, availableHours, loading: availabilityLoading } = useAvailability(date);

    // ...

    // Let's use authLoading as the main loading indicator for the page render
    if (authLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-brand-600" /></div>;

    const handleBooking = async () => {
        if (!user) return;

        await createBooking({
            userId: user.id,
            petName: formData.petName,
            service: formData.service,
            date,
            time
        });
    };

    return (
        <div className="bg-background-cream min-h-screen py-16">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-brand-900/5">
                    <div className="px-6 py-10 sm:p-12">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-extrabold tracking-tight text-brand-900">Reservar Turno</h2>
                            <div className="flex gap-2.5">
                                <span className={`h-2.5 w-10 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-primary-orange' : 'bg-brand-200'}`} />
                                <span className={`h-2.5 w-10 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-primary-orange' : 'bg-brand-200'}`} />
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
                                                    ? 'border-primary-orange bg-soft-peach/10 ring-1 ring-primary-orange shadow-md'
                                                    : 'border-brand-900/5 hover:border-soft-peach bg-white'
                                                    }`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-base font-bold ${formData.service === s.title ? 'text-primary-orange' : 'text-brand-900'}`}>{s.title}</span>
                                                    <span className={`text-sm font-medium ${formData.service === s.title ? 'text-primary-orange/70' : 'text-brand-500'}`}>{s.price}</span>
                                                </div>
                                                {formData.service === s.title && (
                                                    <div className="bg-primary-orange rounded-full p-1">
                                                        <CheckCircle2 size={24} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Button
                                        onClick={() => formData.petName ? setStep(2) : alert("Ingresa el nombre de tu mascota")}
                                        className="h-14 text-lg"
                                    >
                                        Elegir fecha y hora
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-10">
                                <div className="bg-background-cream p-6 rounded-3xl">
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
                </div>
            </div>
        </div>
    );
}
