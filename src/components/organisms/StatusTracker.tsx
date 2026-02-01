"use client";

import { useAppointmentStatus } from "@/hooks/useAppointmentStatus";
import { CheckCircle2, Circle, Clock, Loader2, Sparkles, Scissors, Wind, Bath } from "lucide-react";
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
                <div className="absolute left-0 top-1/2 -mt-px h-0.5 w-full bg-brand-200" aria-hidden="true" />
                {/* Progress Bar Animation */}
                <motion.div
                    className="absolute left-0 top-1/2 -mt-px h-0.5 bg-brand-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />

                <ul role="list" className="relative flex justify-between w-full">
                    {STEPS.map((step, stepIdx) => {
                        const isCompleted = stepIdx < currentStepIndex;
                        const isCurrent = stepIdx === currentStepIndex;
                        const Icon = step.icon;

                        return (
                            <li key={step.label} className="text-center bg-white px-2 z-10">
                                <div className="group relative flex flex-col items-center">
                                    <span className="flex items-center" aria-hidden="true">
                                        <motion.span
                                            initial={false}
                                            animate={{
                                                backgroundColor: isCompleted || isCurrent ? "#7c2d12" : "#ffffff", // brand-900
                                                borderColor: isCompleted || isCurrent ? "#7c2d12" : "#fdba74", // brand-300
                                                scale: isCurrent ? 1.2 : 1
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${isCompleted || isCurrent ? "text-white" : "text-brand-400"}`}
                                                aria-hidden="true"
                                            />
                                        </motion.span>
                                    </span>
                                    <span
                                        className={`mt-2 text-sm font-medium ${isCurrent ? "text-brand-900 font-bold" : "text-brand-500"
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 rounded-lg bg-green-50 p-4 text-center border border-green-200"
                >
                    <p className="text-green-800 font-bold text-lg">✨ ¡Tu mascota está lista! ✨</p>
                    <p className="text-green-700">Puedes pasar a retirarla cuando quieras.</p>
                </motion.div>
            )}
        </div>
    );
}

