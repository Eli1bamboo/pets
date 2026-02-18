"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DogStatusAnimationProps {
    status: string;
}

/**
 * DogStatusAnimation renders a beautiful, animated dog silhouette
 * based on the current appointment status.
 * Design inspired by high-quality sketchy silhouettes.
 */
export function DogStatusAnimation({ status }: DogStatusAnimationProps) {
    // Colors
    const primaryDog = "#4A5568"; // Slate-700 for a sketchy silhouette look
    const accentColor = "#FFB347"; // Brand orange for highlights

    // Animation Variants
    const containerVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
    };

    return (
        <div className="flex justify-center items-center py-6 h-64 overflow-hidden relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full flex justify-center"
                >
                    {status === "pending" && (
                        <motion.svg viewBox="0 0 200 200" className="w-56 h-56">
                            {/* Sitting Dog - Inspired by front-view sketch */}
                            <motion.path
                                d="M100,50 Q115,50 120,65 T125,90 Q125,120 135,150 L65,150 Q75,120 75,90 T80,65 Q85,50 100,50"
                                fill="none"
                                stroke={primaryDog}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                            {/* Ears */}
                            <motion.path
                                d="M80,65 Q70,70 75,85"
                                fill="none" stroke={primaryDog} strokeWidth="2"
                                animate={{ rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                            />
                            <motion.path
                                d="M120,65 Q130,70 125,85"
                                fill="none" stroke={primaryDog} strokeWidth="2"
                                animate={{ rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                            />
                            {/* Eyes & Nose - Subtle */}
                            <circle cx="95" cy="80" r="1.5" fill={primaryDog} />
                            <circle cx="105" cy="80" r="1.5" fill={primaryDog} />
                            <path d="M98,90 Q100,93 102,90" stroke={primaryDog} fill="none" strokeWidth="1.5" />

                            {/* Patient wagging tail */}
                            <motion.path
                                d="M135,150 Q150,145 155,130"
                                fill="none"
                                stroke={primaryDog}
                                strokeWidth="3"
                                strokeLinecap="round"
                                animate={{ rotate: [0, 15, 0] }}
                                style={{ transformOrigin: "135px 150px" }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            />

                            {/* ZZZ or "Waiting" indicator */}
                            <motion.text
                                x="140" y="60"
                                className="text-2xl font-bold fill-brand-300"
                                animate={{ opacity: [0, 1, 0], y: [60, 40] }}
                                transition={{ repeat: Infinity, duration: 3, times: [0, 0.5, 1] }}
                            >
                                ...
                            </motion.text>
                        </motion.svg>
                    )}

                    {status === "washing" && (
                        <motion.svg viewBox="0 0 200 200" className="w-56 h-56">
                            {/* Tub */}
                            <path d="M40,140 L160,140 Q175,140 175,165 L25,165 Q25,140 40,140" fill="none" stroke={primaryDog} strokeWidth="2" />

                            {/* Dog peaking out - same sitting shape but cut */}
                            <clipPath id="tubClip">
                                <rect x="0" y="0" width="200" height="140" />
                            </clipPath>
                            <g clipPath="url(#tubClip)">
                                <motion.path
                                    d="M100,70 Q115,70 120,85 T125,110 Q125,140 135,170 L65,170 Q75,140 75,110 T80,85 Q85,70 100,70"
                                    fill="none"
                                    stroke={primaryDog}
                                    strokeWidth="2.5"
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                />
                            </g>

                            {/* Floating Bubbles */}
                            {[...Array(6)].map((_, i) => (
                                <motion.circle
                                    key={i}
                                    r={Math.random() * 6 + 4}
                                    fill="none"
                                    stroke={accentColor}
                                    strokeWidth="1.5"
                                    opacity="0.6"
                                    animate={{
                                        y: [160, 40],
                                        x: [40 + Math.random() * 120, 30 + Math.random() * 140],
                                        opacity: [0, 0.8, 0],
                                        scale: [0.5, 1.2, 0.8]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: Math.random() * 2 + 3,
                                        delay: i * 0.5
                                    }}
                                />
                            ))}
                        </motion.svg>
                    )}

                    {status === "drying" && (
                        <motion.svg viewBox="0 0 200 200" className="w-56 h-56">
                            {/* Standing Dog - Inspired by side-view sketch */}
                            <motion.path
                                d="M50,150 L60,110 Q70,90 90,85 T130,80 Q150,85 160,110 L170,150 M90,85 Q85,60 70,50 T50,70 Q45,80 50,110"
                                fill="none"
                                stroke={primaryDog}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                animate={{ x: [-1, 1, -1] }}
                                transition={{ repeat: Infinity, duration: 0.1 }}
                            />
                            {/* Tail */}
                            <motion.path
                                d="M160,110 Q180,100 185,120"
                                fill="none"
                                stroke={primaryDog}
                                strokeWidth="2.5"
                                animate={{ rotate: [0, 10, 0] }}
                                style={{ transformOrigin: "160px 110px" }}
                                transition={{ repeat: Infinity, duration: 0.3 }}
                            />
                            {/* Ears flapping - very fast */}
                            <motion.path
                                d="M70,55 Q60,40 55,55"
                                fill="none"
                                stroke={primaryDog}
                                strokeWidth="2"
                                animate={{ rotate: [0, -30, 0] }}
                                style={{ transformOrigin: "70px 55px" }}
                                transition={{ repeat: Infinity, duration: 0.2 }}
                            />

                            {/* Wind effects */}
                            {[...Array(4)].map((_, i) => (
                                <motion.path
                                    key={i}
                                    d={`M20,${60 + i * 30} Q60,${50 + i * 30} 110,${60 + i * 30}`}
                                    stroke={accentColor}
                                    strokeWidth="1"
                                    strokeDasharray="10 10"
                                    animate={{ x: [0, 200], opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                />
                            ))}
                        </motion.svg>
                    )}

                    {status === "ready" && (
                        <motion.svg viewBox="0 0 200 200" className="w-56 h-56">
                            {/* Proud Standing Dog */}
                            <motion.path
                                d="M50,150 L60,110 Q70,90 90,85 T130,80 Q150,85 160,110 L170,150 M90,85 Q85,60 70,50 T50,70 Q45,80 50,110"
                                fill="none"
                                stroke={accentColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                animate={{ scale: [1, 1.02, 1], y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                            {/* Sparkles around its head */}
                            {[...Array(5)].map((_, i) => (
                                <motion.path
                                    key={i}
                                    d="M0,-5 L1,0 L5,1 L1,2 L0,7 L-1,2 L-5,1 L-1,0 Z"
                                    fill={accentColor}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0],
                                        rotate: [0, 90]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        delay: i * 0.3
                                    }}
                                    style={{
                                        x: 70 + (Math.random() - 0.5) * 100,
                                        y: 60 + (Math.random() - 0.5) * 80
                                    }}
                                />
                            ))}
                            {/* Happy wagging tail */}
                            <motion.path
                                d="M160,110 Q190,90 195,115"
                                fill="none"
                                stroke={accentColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                animate={{ rotate: [0, 20, 0] }}
                                style={{ transformOrigin: "160px 110px" }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            />
                        </motion.svg>
                    )}

                    {status === "completed" && (
                        <motion.svg viewBox="0 0 400 200" className="w-full h-56">
                            {/* Running Dog */}
                            <motion.path
                                d="M50,130 Q70,90 100,100 T150,90 Q170,90 180,120 M100,100 Q90,70 70,60 T50,80"
                                fill="none"
                                stroke={primaryDog}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                animate={{
                                    x: [-100, 450],
                                    y: [0, -15, 0, -15, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                            />
                            {/* Paws effect */}
                            <motion.circle
                                cx="60" cy="150" r="2" fill={accentColor} opacity="0.4"
                                animate={{ x: [-100, 450], opacity: [0, 0.4, 0] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                            />
                        </motion.svg>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
