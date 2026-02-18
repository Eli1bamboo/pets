"use client";

import { CheckCircle2, Clock, Loader2, Sparkles, Wind, Bath } from "lucide-react";
import { APPOINTMENT_STATUSES } from "@/config/appointments";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const STEPS = [
    { id: "pending", label: "Esperando", icon: Clock },
    { id: "washing", label: "Baño", icon: Bath },
    { id: "drying", label: "Secado", icon: Wind },
    { id: "ready", label: "Listo", icon: Sparkles },
    { id: "completed", label: "Retirado", icon: CheckCircle2 },
];

interface StatusTrackerProps {
    status: string;
}

export function StatusTracker({ status }: StatusTrackerProps) {
    const currentStepIndex = STEPS.findIndex((s) => s.id === status);
    const activeStatusConfig = APPOINTMENT_STATUSES.find(s => s.value === status);

    // Animation variants for specific icons
    const iconVariants = {
        pending: {
            rotate: [0, 360],
            transition: { duration: 3, repeat: Infinity, ease: "linear" as const }
        },
        washing: {
            y: [0, -2, 0, -2, 0],
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
        },
        drying: {
            x: [0, 2, -2, 2, 0],
            transition: { duration: 0.2, repeat: Infinity, ease: "linear" as const }
        },
        ready: {
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
        },
        completed: {
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity }
        },
        default: {
            scale: 1
        }
    };

    return (
        <div className="w-full py-8 px-2 sm:px-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Background Line */}
                <div className="absolute left-0 top-1/2 -mt-0.5 h-1 w-full bg-brand-100 rounded-full -z-10" />

                {/* Active Progress Line */}
                <div
                    className="absolute left-0 top-1/2 -mt-0.5 h-1 bg-brand-500 rounded-full transition-all duration-500 -z-10"
                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, stepIdx) => {
                    const isCompleted = stepIdx < currentStepIndex;
                    const isActive = stepIdx === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="relative flex flex-col items-center group z-10">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.2 : 1,
                                    backgroundColor: isActive || isCompleted ? (activeStatusConfig?.color ? "#ffffff" : "#f97316") : "#ffffff",
                                    borderColor: isActive || isCompleted ? "#f97316" : "#e5e7eb",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={cn(
                                    "flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 transition-colors duration-300 shadow-sm",
                                    isCompleted ? "bg-brand-500 border-brand-500 text-white" : "",
                                    isActive ? cn("border-brand-500 text-brand-600 shadow-brand-200 shadow-lg", activeStatusConfig?.color) : "bg-white border-gray-200 text-gray-300"
                                )}
                            >
                                <motion.div
                                    animate={isActive ? (iconVariants[step.id as keyof typeof iconVariants] || iconVariants.default) : {}}
                                >
                                    <Icon
                                        className={cn("w-6 h-6 sm:w-7 sm:h-7")}
                                        strokeWidth={2.5}
                                    />
                                </motion.div>
                            </motion.div>

                            <span
                                className={cn(
                                    "absolute top-14 sm:top-16 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap transition-colors duration-300",
                                    isActive ? "text-brand-900 scale-105" : "text-brand-400",
                                    isCompleted && "text-brand-600"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}


