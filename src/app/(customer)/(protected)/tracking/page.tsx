"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import StatusTracker from "@/components/organisms/StatusTracker";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

export default function TrackingPage() {
    useAuth({ redirectToLogin: true });
    const [inputId, setInputId] = useState("");
    const [appointmentId, setAppointmentId] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputId.trim()) {
            setAppointmentId(inputId);
        }
    };

    return (
        <div className="min-h-screen bg-background-cream px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <span className="text-primary-orange font-bold uppercase tracking-wider text-sm">Seguimiento en Vivo</span>
                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl leading-[1.1]">
                    Rastrea el progreso de tu mascota
                </h2>
                <p className="mt-6 text-xl leading-8 text-brand-700">
                    Ingresa el número de tu turno para ver en qué etapa del spa se encuentra tu mejor amigo en tiempo real.
                </p>
            </div>

            <div className="mx-auto mt-12 max-w-xl">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-auto">
                        <Input
                            id="appointment-id"
                            name="id"
                            type="number"
                            required
                            placeholder="Número de Turno (ej: 15)"
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value)}
                            leftIcon={Search}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="sm:w-32 h-14"
                    >
                        Buscar
                    </Button>
                </form>

                {appointmentId && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16 bg-white p-10 rounded-[2.5rem] shadow-2xl ring-1 ring-brand-900/5"
                    >
                        <div className="flex items-center justify-between mb-8 border-b border-brand-900/5 pb-6">
                            <h3 className="text-2xl font-extrabold text-brand-900">
                                Turno <span className="text-primary-orange">#{appointmentId}</span>
                            </h3>
                            <span className="bg-soft-peach/20 text-primary-orange px-4 py-1 rounded-full text-sm font-bold">En Proceso</span>
                        </div>
                        <StatusTracker appointmentId={appointmentId} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
