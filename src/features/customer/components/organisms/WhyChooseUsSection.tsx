"use client";

import { ShieldCheck, Clock, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        name: "Profesionales Certificados",
        description: "Nuestro equipo está altamente capacitado para brindar el mejor cuidado a tu mascota.",
        icon: Award,
    },
    {
        name: "Seguimiento en Vivo",
        description: "Mirá el estado de tu mascota en tiempo real mientras realizamos el servicio.",
        icon: Clock,
    },
    {
        name: "Cuidado con Amor",
        description: "Tratamos a cada mascota como si fuera nuestra. Paciencia y dedicación garantizadas.",
        icon: Heart,
    },
    {
        name: "Seguridad Garantizada",
        description: "Instalaciones seguras y productos de primera calidad para tu tranquilidad.",
        icon: ShieldCheck,
    },
];

export function WhyChooseUsSection() {
    return (
        <section className="py-24 bg-brand-900 text-white relative isolate overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-bold uppercase tracking-wider text-primary-orange">Por qué elegirnos</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Cuidado premium para tu mejor amigo
                    </p>
                    <p className="mt-6 text-lg leading-8 text-brand-200">
                        Nos diferenciamos por la calidad de nuestro servicio y la atención al detalle. Tu mascota merece lo mejor.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.name}
                                className="flex flex-col items-center text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                                    <feature.icon className="h-8 w-8 text-primary-orange" aria-hidden="true" />
                                </div>
                                <dt className="text-xl font-bold leading-7 text-white">
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-brand-200">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
