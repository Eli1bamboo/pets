"use client";

import { CheckCircle2, Clock, Loader2, Sparkles, Wind, Bath } from "lucide-react";
import { APPOINTMENT_STATUSES } from "@/config/appointments";
import { cn } from "@/utils/cn";

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

    // Get the dynamic color for the active status from config
    const activeStatusConfig = APPOINTMENT_STATUSES.find(s => s.value === status);

    // Parse color classes to apply to backgrounds/text
    // Expected format from config: "bg-blue-100 text-blue-700"
    // We'll extract the core color intent or just use the config classes directly where appropriate
    const activeColorClass = activeStatusConfig?.color || "bg-brand-500 text-white";

    return (
        <div className="w-full py-10 px-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Background Progress Line */}
                <div className="absolute left-0 top-1/2 -mt-0.5 h-1 w-full bg-brand-100 rounded-full -z-10" />

                {/* Active Progress Line (Orange/Brand for completed portion) */}
                <div
                    className="absolute left-0 top-1/2 -mt-0.5 h-1 bg-brand-500 rounded-full transition-all duration-500 -z-10"
                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, stepIdx) => {
                    const isCompleted = stepIdx < currentStepIndex;
                    const isActive = stepIdx === currentStepIndex;
                    const Icon = step.icon;

                    // Dynamic styles based on state
                    let circleClasses = "bg-white border-2 border-brand-200 text-brand-300"; // Pending default

                    if (isCompleted) {
                        circleClasses = "bg-brand-500 border-brand-500 text-white shadow-md";
                    } else if (isActive) {
                        // Use dynamic status color for the active step
                        // We assume activeStatusConfig.color gives us something like "bg-blue-100 text-blue-700"
                        // We want a solid filled circle for active, so we might need to adjust or map these.
                        // However, usually "bg-blue-100" is light. Let's try to map the specific statuses to solid colors if generic classes aren't enough,
                        // OR just use the config classes directly for a "light bg, dark icon" look, or "solid bg".

                        // User said: "just use APPOINTMENT_STATUSES for active"
                        // The config colors are pastel backgrounds (bg-blue-100).
                        // Layout: Solid circle?
                        circleClasses = cn(
                            "border-2 shadow-lg scale-110 transition-transform",
                            activeStatusConfig?.color, // e.g. bg-blue-100 text-blue-700
                            "border-current" // Border matches text color
                        );
                    }

                    return (
                        <div key={step.id} className="relative flex flex-col items-center group">
                            <div
                                className={cn(
                                    "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300",
                                    circleClasses
                                )}
                            >
                                <Icon className={cn("w-7 h-7", isActive && "animate-in fade-in zoom-in duration-300")} strokeWidth={2.5} />
                            </div>

                            <span
                                className={cn(
                                    "absolute top-16 text-xs font-bold uppercase tracking-wider text-center whitespace-nowrap transition-colors duration-300",
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

            {status === 'ready' && (
                <div className="mt-16 text-center animate-in slide-in-from-bottom-4 duration-700 fade-in">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-100 text-purple-800 border border-purple-200 shadow-sm">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold text-lg">¡Tu mascota está lista!</span>
                    </div>
                </div>
            )}
        </div>
    );
}


