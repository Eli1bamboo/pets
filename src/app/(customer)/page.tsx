"use client";

import { HomeHero } from "@/components/organisms/HomeHero";
import { ServiceCard } from "@/components/molecules/ServiceCard";
import { Bath, Scissors, Wind, Sparkles, Heart, Star, LucideIcon } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageContext";
import { useServices } from "@/hooks/useServices";

const ICON_MAP: Record<string, LucideIcon> = {
  bath: Bath,
  scissors: Scissors,
  wind: Wind,
  sparkles: Sparkles,
  heart: Heart,
  star: Star,
};

export default function Home() {
  const { t, language } = useTranslation();
  const { services, loading } = useServices();

  return (
    <div className="bg-background-cream">
      <HomeHero />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32" id="services">
        <div className="mx-auto max-max-2xl lg:text-center">
          <h2 className="text-base font-bold uppercase tracking-wider text-primary-orange">{t.services.sectionTag}</h2>
          <p className="mt-4 text-4xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
            {t.services.sectionTitle}
          </p>
          <p className="mt-6 text-xl leading-8 text-brand-700">
            {t.services.sectionSubtitle}
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {loading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-orange border-t-transparent" />
            </div>
          ) : (
            services.map((service, idx) => (
              <ServiceCard
                key={service.id}
                title={language === "en" && service.name_en ? service.name_en : service.name}
                price={Number(service.price).toLocaleString()}
                icon={ICON_MAP[service.icon] || Scissors}
                features={language === "en" && service.features_en?.length ? service.features_en : service.features}
                delay={idx * 0.1}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
