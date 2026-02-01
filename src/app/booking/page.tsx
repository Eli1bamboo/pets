"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DateSelector } from "@/components/molecules/DateSelector";
import { TimeSelector } from "@/components/molecules/TimeSelector";
import { useAvailability } from "@/hooks/useAvailability";
import { useBooking } from "@/hooks/useBooking";
import { Calendar, Clock, Loader2, CheckCircle2, Dog } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";

const SERVICES = [
    { title: 'Baño y Secado', price: '$4500' },
    { title: 'Corte Completo', price: '$6500' },
    { title: 'Spa de Deslanado', price: '$8000' }
];

// ...

export default function BookingPage() {
    const { user, loading: authLoading } = useAuth({ redirectToLogin: true });
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
        <div className="bg-brand-50 min-h-screen py-16">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-brand-900/5">
                    <div className="px-6 py-8 sm:p-10">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold tracking-tight text-brand-900">Reservar Turno</h2>
                            <div className="flex gap-2">
                                <span className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-brand-600' : 'bg-brand-200'}`} />
                                <span className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-brand-600' : 'bg-brand-200'}`} />
                            </div>
                        </div>

                        {step === 1 && (
                            <div className="space-y-6">
                                <FormField
                                    id="petName"
                                    label="Nombre de tu Mascota"
                                    placeholder="Ej: Rocco"
                                    leftIcon={Dog}
                                    value={formData.petName}
                                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                />

                                <div>
                                    <label className="block text-sm font-medium leading-6 text-brand-900 mb-2">Servicio</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {SERVICES.map((s) => (
                                            <div
                                                key={s.title}
                                                onClick={() => setFormData({ ...formData, service: s.title })}
                                                className={`cursor-pointer rounded-lg border p-4 flex items-center justify-between transition-all ${formData.service === s.title
                                                    ? 'border-green-600 bg-green-50 ring-1 ring-green-600'
                                                    : 'border-brand-200 hover:border-brand-300'
                                                    }`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${formData.service === s.title ? 'text-green-900' : 'text-brand-900'}`}>{s.title}</span>
                                                    <span className={`text-xs ${formData.service === s.title ? 'text-green-700' : 'text-brand-500'}`}>{s.price}</span>
                                                </div>
                                                {formData.service === s.title && <CheckCircle2 size={18} className="text-green-600" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button onClick={() => formData.petName ? setStep(2) : alert("Ingresa el nombre")} >Siguiente</Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <DateSelector selectedDate={date} onSelect={setDate} />

                                {date && (
                                    <TimeSelector
                                        selectedTime={time}
                                        onSelect={setTime}
                                        busySlots={busySlots}
                                        availableHours={availableHours}
                                        loading={availabilityLoading}
                                    />
                                )}

                                <div className="pt-6 flex gap-3">
                                    <Button variant="secondary" onClick={() => setStep(1)}>Atrás</Button>
                                    <Button onClick={handleBooking} isLoading={submitting} disabled={!date || !time}>Confirmar Reserva</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
