"use client";

import Link from "next/link";
import Hero from "@/components/organisms/Hero";
import ServiceCard from "@/components/organisms/ServiceCard";
import { Bath, Scissors, Wind } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background-cream">
      <Hero />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32" id="services">
        <div className="mx-auto max-max-2xl lg:text-center">
          <h2 className="text-base font-bold uppercase tracking-wider text-primary-orange">Nuestros Servicios</h2>
          <p className="mt-4 text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
            Cuidado integral para tu mejor amigo
          </p>
          <p className="mt-6 text-xl leading-8 text-brand-700">
            Utilizamos productos hipoalergénicos y técnicas libres de estrés para asegurar que tu mascota disfrute de la experiencia.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <ServiceCard
            title="Baño y Secado"
            price="15.000"
            icon={Bath}
            features={['Shampoo Hipoalergénico', 'Secado con Turbina', 'Corte de Uñas', 'Limpieza de Oídos']}
            delay={0}
          />
          <ServiceCard
            title="Corte Completo"
            price="22.000"
            icon={Scissors}
            features={['Todo lo del Baño', 'Corte de Raza / Tijera', 'Perfume Finalizador', 'Moño o Pañuelo']}
            delay={0.1}
          />
          <ServiceCard
            title="Spa de Deslanado"
            price="28.000"
            icon={Wind}
            features={["Baño profundo", "Técnica de deslanado", "Hidratación de almohadillas", "Reducción de caída de pelo"]}
            delay={0.2}
          />
        </div>
      </div>
    </div>
  );
}
