"use client";

import { useState } from "react";
import StatusTracker from "@/components/organisms/StatusTracker";
import { Search } from "lucide-react";

export default function TrackingPage() {
    const [inputId, setInputId] = useState("");
    const [appointmentId, setAppointmentId] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputId.trim()) {
            setAppointmentId(inputId);
        }
    };

    return (
        <div className="min-h-screen bg-brand-50 px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl leading-tight">
                    Seguimiento en Vivo
                </h2>
                <p className="mt-2 text-lg leading-8 text-brand-700">
                    Ingresa el número de tu turno para ver el estado de tu mascota en tiempo real.
                </p>
            </div>

            <div className="mx-auto mt-10 max-w-xl">
                <form onSubmit={handleSearch} className="flex gap-x-4">
                    <label htmlFor="appointment-id" className="sr-only">
                        Número de Turno
                    </label>
                    <input
                        id="appointment-id"
                        name="id"
                        type="number"
                        required
                        className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-brand-900 shadow-sm ring-1 ring-inset ring-brand-300 placeholder:text-brand-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                        placeholder="Ej: 15"
                        value={inputId}
                        onChange={(e) => setInputId(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="flex-none rounded-md bg-brand-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 flex items-center gap-2"
                    >
                        <Search size={16} />
                        Buscar
                    </button>
                </form>

                {appointmentId && (
                    <div className="mt-16 bg-white p-8 rounded-3xl shadow-xl ring-1 ring-brand-900/10">
                        <h3 className="text-lg font-semibold text-brand-900 mb-6 text-center">
                            Estado del Turno #{appointmentId}
                        </h3>
                        <StatusTracker appointmentId={appointmentId} />
                    </div>
                )}
            </div>
        </div>
    );
}
