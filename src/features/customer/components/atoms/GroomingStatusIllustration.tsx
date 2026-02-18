"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GroomingStatusIllustrationProps {
    status: string;
}

export function GroomingStatusIllustration({ status }: GroomingStatusIllustrationProps) {
    // Current mapping: only 'pending' has a specific illustration for now
    const getIllustration = (status: string) => {
        switch (status) {
            case "pending":
                return "/status-waiting.jpg";
            // Placeholders for future states if user provides more images
            default:
                return null;
        }
    };

    const illustrationSrc = getIllustration(status);

    if (!illustrationSrc) return null;

    return (
        <div className="flex justify-center items-center py-6 h-64 overflow-hidden relative rounded-2xl bg-white/50 backdrop-blur-sm shadow-inner mb-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-full flex justify-center items-center"
                >
                    <Image
                        src={illustrationSrc}
                        alt={`Status: ${status}`}
                        width={400}
                        height={300}
                        className="object-contain max-h-full transition-all duration-700"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Soft decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-50/20 to-transparent pointer-events-none" />
        </div>
    );
}
