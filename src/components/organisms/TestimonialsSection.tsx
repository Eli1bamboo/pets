"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        id: 1,
        content: "¡Increíble servicio! Mi perro Thor quedó hermoso y súper relajado. Se nota el amor con el que tratan a los animales.",
        author: "María González",
        role: "Dueña de Thor (Golden Retriever)",
        rating: 5,
    },
    {
        id: 2,
        content: "La mejor peluquería canina de la zona. El sistema de reservas es muy fácil de usar y siempre cumplen con los horarios.",
        author: "Carlos Rodríguez",
        role: "Dueño de Luna (Caniche)",
        rating: 5,
    },
    {
        id: 3,
        content: "Me encanta que pueda ver el estado de mi perrita mientras la bañan. ¡Súper recomendable!",
        author: "Ana Martínez",
        role: "Dueña de Lola (Bulldog Francés)",
        rating: 5,
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-200 via-primary-orange to-brand-200" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-bold uppercase tracking-wider text-primary-orange">Testimonios</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
                        Lo que dicen nuestros clientes
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex flex-col justify-between bg-brand-50/30 p-8 rounded-3xl border border-brand-100 hover:shadow-lg transition-shadow"
                        >
                            <div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-lg leading-7 text-brand-700 italic">"{testimonial.content}"</p>
                            </div>
                            <div className="mt-8 border-t border-brand-200 pt-6">
                                <p className="font-bold text-brand-900">{testimonial.author}</p>
                                <p className="text-sm text-brand-500">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
