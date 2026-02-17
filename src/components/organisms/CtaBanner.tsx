"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { CalendarCheck } from "lucide-react";

export function CtaBanner() {
    return (
        <section className="bg-primary-orange py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        ¿Listo para consentir a tu mascota?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-brand-100">
                        Reservá tu turno en menos de 2 minutos. Elegí el servicio, la fecha y hora que más te convenga.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link href="/booking">
                            <Button size="lg" className="bg-white text-primary-orange hover:bg-brand-50 hover:text-brand-600 border-none shadow-xl h-14 px-8 text-lg">
                                <CalendarCheck className="mr-2 h-5 w-5" />
                                Reservar Ahora
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
