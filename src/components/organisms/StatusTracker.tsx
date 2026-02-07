"use client";

import { useAppointmentStatus } from "@/hooks/useAppointmentStatus";
import { CheckCircle2, Clock, Loader2, Sparkles, Wind, Bath } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
    { id: "pending", label: "Esperando", icon: Clock },
    { id: "washing", label: "Baño", icon: Bath },
    { id: "drying", label: "Secado", icon: Wind },
    { id: "ready", label: "Listo", icon: Sparkles },
    { id: "completed", label: "Retirado", icon: CheckCircle2 },
];

interface StatusTrackerProps {
    appointmentId: number | string;
}

export default function StatusTracker({ appointmentId }: StatusTrackerProps) {
    const { status, loading } = useAppointmentStatus(appointmentId);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-600" /></div>;
    }

    const currentStepIndex = STEPS.findIndex((s) => s.id === status);

    return (
        <div className="py-8">
            <div className="relative">
                <div className="absolute left-0 top-1/2 -mt-px h-1 w-full bg-brand-900/5 rounded-full" aria-hidden="true" />
                <motion.div
                    className="absolute left-0 top-1/2 -mt-px h-1 bg-primary-orange rounded-full shadow-[0_0_10px_rgba(255,179,71,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                <ul role="list" className="relative flex justify-between w-full">
                    {STEPS.map((step, stepIdx) => {
                        const isCompleted = stepIdx < currentStepIndex;
                        const isCurrent = stepIdx === currentStepIndex;
                        const Icon = step.icon;

                        return (
                            <li key={step.label} className="text-center bg-transparent z-10 px-1">
                                <div className="group relative flex flex-col items-center">
                                    <span className="flex items-center" aria-hidden="true">
                                        <motion.span
                                            initial={false}
                                            animate={{
                                                backgroundColor: isCompleted || isCurrent ? "#FFB347" : "#FFFFFF",
                                                borderColor: isCompleted || isCurrent ? "#FFB347" : "#EDF2F7",
                                                scale: isCurrent ? 1.25 : 1,
                                                boxShadow: isCurrent ? "0 0 20px rgba(255,179,71,0.4)" : "none"
                                            }}
                                            transition={{ duration: 0.5 }}
                                            className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-transform`}
                                        >
                                            <Icon
                                                className={`h-6 w-6 ${isCompleted || isCurrent ? "text-white" : "text-brand-600/40"}`}
                                                aria-hidden="true"
                                            />
                                            {isCurrent && (
                                                <motion.div
                                                    layoutId="pulse"
                                                    className="absolute inset-0 rounded-full bg-primary-orange/30 -z-10"
                                                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                />
                                            )}
                                        </motion.span>
                                    </span>
                                    <span
                                        className={`mt-4 text-xs font-bold uppercase tracking-wider ${isCurrent ? "text-primary-orange" : "text-brand-600"
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {status === 'ready' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 rounded-3xl bg-secondary-teal/10 p-6 text-center border-2 border-secondary-teal/20 shadow-lg"
                >
                    <div className="flex justify-center mb-3">
                        <div className="bg-secondary-teal rounded-full p-2">
                            <Sparkles className="text-white h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-secondary-teal font-extrabold text-xl">¡Tu mascota está lista!</p>
                    <p className="text-brand-600 mt-1 font-medium">Puedes pasar a retirarla cuando quieras. Te está esperando con muchas ganas.</p>
                </motion.div>
            )}
        </div>
    );
}

