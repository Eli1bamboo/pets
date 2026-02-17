"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DogStatusAnimationProps {
    status: string;
}

/**
 * DogStatusAnimation (Phase 2): LIVELY
 * 
 * Features:
 * - Squash and Stretch (Spring dynamics)
 * - Secondary motion (Breathing, Blinking, Ears)
 * - Fluid SVG paths
 * - Status-specific environmental storytelling
 */
export function DogStatusAnimation({ status }: DogStatusAnimationProps) {
    const primaryDog = "#4A5568";
    const accentColor = "#FFB347";

    // Common Animation Presets
    const breathing = {
        scaleY: [1, 1.03, 1],
        y: [0, -2, 0],
        transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
    };

    const blink = {
        scaleY: [1, 0.1, 1],
        transition: { repeat: Infinity, duration: 4, times: [0, 0.95, 1] }
    };

    const containerVariants = {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: -20 }
    };

    return (
        <div className="flex justify-center items-center py-6 h-64 overflow-hidden relative select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full flex justify-center items-end pb-8"
                >
                    {/* --- PENDING: Patient & Alive --- */}
                    {status === "pending" && (
                        <motion.svg viewBox="0 0 200 200" className="w-56 h-56" animate={breathing}>
                            {/* Head & Body (Fluid) */}
                            <path
                                d="M100,50 Q115,50 120,65 T125,90 Q125,120 135,150 L65,150 Q75,120 75,90 T80,65 Q85,50 100,50"
                                fill="none" stroke={primaryDog} strokeWidth="2.5" strokeLinecap="round"
                            />
                            {/* Blinking Eyes */}
                            <motion.circle cx="95" cy="80" r="1.5" fill={primaryDog} animate={blink} />
                            <motion.circle cx="105" cy="80" r="1.5" fill={primaryDog} animate={blink} />
                            {/* Perking Ears */}
                            <motion.path
                                d="M80,65 Q65,60 72,85" fill="none" stroke={primaryDog} strokeWidth="2"
                                animate={{ rotate: [0, -10, 0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, times: [0, 0.1, 0.2, 0.3, 1] }}
                            />
                            <motion.path
                                d="M120,65 Q135,60 128,85" fill="none" stroke={primaryDog} strokeWidth="2"
                                animate={{ rotate: [0, 10, 0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 5, times: [0, 0.1, 0.2, 0.3, 1] }}
                            />
                            {/* Gentle Tail Wag */}
                            <motion.path
                                d="M135,150 Q160,140 165,120"
                                fill="none" stroke={primaryDog} strokeWidth="3" strokeLinecap="round"
                                animate={{ rotate: [0, 20, 0], skewX: [0, 10, 0] }}
                                style={{ transformOrigin: "135px 150px" }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            />
                        </motion.svg>
                    )}

                    {/* --- WASHING: Playful Splashes --- */}
                    {status === "washing" && (
                        <div className="relative w-56 h-56">
                            <motion.svg viewBox="0 0 200 200" className="w-full h-full">
                                {/* Water Level Clipping */}
                                <clipPath id="washingClip">
                                    <rect x="0" y="0" width="200" height="142" />
                                </clipPath>

                                {/* Tub with rounded corners */}
                                <path d="M40,140 L160,140 Q180,140 180,170 H20 Q20,140 40,140" fill="none" stroke={primaryDog} strokeWidth="2.5" />

                                <g clipPath="url(#washingClip)">
                                    {/* Dog peaking & bobbing */}
                                    <motion.path
                                        d="M100,75 Q115,75 120,90 T125,115 Q125,145 135,175 L65,175 Q75,145 75,115 T80,90 Q85,75 100,75"
                                        fill="none" stroke={primaryDog} strokeWidth="2.5"
                                        animate={{ y: [0, 10, 0], rotate: [0, -2, 2, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                    />
                                    {/* Blinking Eyes in Tub */}
                                    <motion.circle cx="95" cy="100" r="1.5" fill={primaryDog} animate={blink} />
                                    <motion.circle cx="105" cy="100" r="1.5" fill={primaryDog} animate={blink} />
                                </g>

                                {/* Bubbles with physics feel */}
                                {[...Array(8)].map((_, i) => (
                                    <motion.circle
                                        key={i}
                                        r={Math.random() * 5 + 3}
                                        fill="none" stroke={accentColor} strokeWidth="2"
                                        initial={{ opacity: 0, y: 160 }}
                                        animate={{
                                            opacity: [0, 0.8, 0],
                                            y: [160, 20 + Math.random() * 100],
                                            x: [100, 100 + (Math.random() - 0.5) * 160],
                                            scale: [0.5, 1.2, 0.8]
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: Math.random() * 2 + 2,
                                            delay: i * 0.4,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}
                            </motion.svg>
                        </div>
                    )}

                    {/* --- DRYING: Intense Shiver & Wind --- */}
                    {status === "drying" && (
                        <motion.svg viewBox="0 0 200 200" className="w-56 h-56">
                            {/* Shaking Body */}
                            <motion.path
                                d="M50,150 L60,110 Q70,90 90,85 T130,80 Q150,85 160,110 L170,150 M90,85 Q85,60 70,50 T50,70 Q45,80 50,110"
                                fill="none" stroke={primaryDog} strokeWidth="2.5" strokeLinecap="round"
                                animate={{
                                    x: [-1, 1, -1, 1, 0],
                                    rotate: [-0.5, 0.5, -0.5, 0.5, 0],
                                    scale: [1, 1.01, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 0.15 }}
                            />
                            {/* Frantic Ears */}
                            <motion.path
                                d="M70,55 Q55,40 50,60"
                                fill="none" stroke={primaryDog} strokeWidth="2.5"
                                animate={{ rotate: [0, -40, 0], skewY: [0, 10, 0] }}
                                style={{ transformOrigin: "70px 55px" }}
                                transition={{ repeat: Infinity, duration: 0.2 }}
                            />
                            {/* High-speed wind lines */}
                            {[...Array(5)].map((_, i) => (
                                <motion.path
                                    key={i}
                                    d={`M10,${40 + i * 35} Q100,${30 + i * 35} 190,${40 + i * 35}`}
                                    stroke={accentColor} strokeWidth="1.5" strokeDasharray="15 15"
                                    animate={{
                                        strokeDashoffset: [0, -100],
                                        opacity: [0, 0.5, 0]
                                    }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1, ease: "linear" }}
                                />
                            ))}
                        </motion.svg>
                    )}

                    {/* --- READY: Happy Bounce & Squash/Stretch --- */}
                    {status === "ready" && (
                        <motion.svg viewBox="0 0 200 200" className="w-56 h-56">
                            {/* Jumping Dog with Squash & Stretch */}
                            <motion.g
                                animate={{
                                    y: [0, -40, 0],
                                    scaleY: [1, 1.2, 0.8, 1],
                                    scaleX: [1, 0.8, 1.2, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                            >
                                <path
                                    d="M50,150 L60,110 Q70,90 90,85 T130,80 Q150,85 160,110 L170,150 M90,85 Q85,60 70,50 T50,70 Q45,80 50,110"
                                    fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round"
                                />
                                {/* Proud Eyes */}
                                <circle cx="75" cy="75" r="2" fill={accentColor} />
                                <circle cx="85" cy="75" r="2" fill={accentColor} />
                                {/* Happy Tail */}
                                <motion.path
                                    d="M160,110 Q190,80 195,110"
                                    fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round"
                                    animate={{ rotate: [-20, 20, -20] }}
                                    style={{ transformOrigin: "160px 110px" }}
                                    transition={{ repeat: Infinity, duration: 0.4 }}
                                />
                            </motion.g>

                            {/* Burst Sparkles */}
                            {[...Array(6)].map((_, i) => (
                                <motion.path
                                    key={i}
                                    d="M0,-6 L1,0 L6,1 L1,2 L0,8 L-1,2 L-6,1 L-1,0 Z"
                                    fill={accentColor}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1.2, 0],
                                        opacity: [0, 1, 0],
                                        rotate: [0, 180]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1.5,
                                        delay: i * 0.25,
                                        ease: "circOut"
                                    }}
                                    style={{
                                        x: 100 + Math.cos(i * 60 * Math.PI / 180) * 80,
                                        y: 80 + Math.sin(i * 60 * Math.PI / 180) * 80
                                    }}
                                />
                            ))}
                        </motion.svg>
                    )}

                    {/* --- COMPLETED: Joyful Gallop --- */}
                    {status === "completed" && (
                        <div className="w-full h-full relative">
                            <motion.svg viewBox="0 0 400 200" className="w-full h-full">
                                {/* Galloping Dog */}
                                <motion.g
                                    animate={{
                                        x: [-120, 420],
                                        y: [0, -20, 0],
                                        rotate: [-5, 5, -5]
                                    }}
                                    transition={{
                                        x: { repeat: Infinity, duration: 4, ease: "linear" },
                                        y: { repeat: Infinity, duration: 0.5, ease: "easeInOut" },
                                        rotate: { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
                                    }}
                                >
                                    <path
                                        d="M50,130 Q70,90 100,100 T150,90 Q170,90 180,120 M100,100 Q90,70 70,60 T50,80"
                                        fill="none" stroke={primaryDog} strokeWidth="2.5" strokeLinecap="round"
                                    />
                                    {/* Action lines behind */}
                                    {[...Array(3)].map((_, i) => (
                                        <motion.line
                                            key={i} x1="-20" y1={90 + i * 15} x2="-40" y2={90 + i * 15}
                                            stroke={accentColor} strokeWidth="2" strokeLinecap="round"
                                            animate={{ opacity: [0, 1, 0], x: [0, -20] }}
                                            transition={{ repeat: Infinity, duration: 0.2, delay: i * 0.1 }}
                                        />
                                    ))}
                                </motion.g>
                            </motion.svg>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Elegant Floor Reflection / Shadow */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-2 bg-slate-100 rounded-[100%] blur-md"
                animate={{
                    scaleX: status === "ready" ? [1, 0.8, 1] : 1,
                    opacity: status === "ready" ? [0.4, 0.1, 0.4] : 0.4
                }}
                transition={{ repeat: Infinity, duration: 1.2 }}
            />
        </div>
    );
}
