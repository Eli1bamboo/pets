import Link from "next/link";
import { useTranslation } from "@/i18n/LanguageContext";
import { Instagram, Facebook, MapPin, Phone, Globe } from "lucide-react";

export default function Footer() {
    const { t, language, setLanguage } = useTranslation();

    return (
        <footer className="bg-brand-900 py-20 px-6 sm:px-8 lg:px-12 border-t border-brand-900/10">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <span className="text-3xl font-black text-white tracking-tight">
                            Peluquería <span className="text-primary-orange">Canina</span>
                        </span>
                        <p className="mt-6 text-base leading-7 max-w-sm text-white/70">
                            {t.footer?.copyright || "Cuidamos a tu mascota como si fuera nuestra."}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">{t.footer?.explore}</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li>
                                <Link href="/" className="text-sm font-bold leading-6 text-white/80 hover:text-primary-orange transition-colors">
                                    {t.footer?.home}
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking" className="text-sm font-bold leading-6 text-white/80 hover:text-primary-orange transition-colors">
                                    {t.footer?.booking}
                                </Link>
                            </li>
                            <li>
                                <Link href="/tracking" className="text-sm font-bold leading-6 text-white/80 hover:text-primary-orange transition-colors">
                                    {t.footer?.tracking}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">{t.footer?.contact}</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li className="flex items-center gap-3 text-sm font-bold leading-6 text-white/80">
                                <div className="bg-primary-orange/20 p-2 rounded-lg text-primary-orange">
                                    <MapPin size={18} />
                                </div>
                                <span>Av. Libertador 1234, CABA</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm font-bold leading-6 text-white/80">
                                <div className="bg-primary-orange/20 p-2 rounded-lg text-primary-orange">
                                    <Phone size={18} />
                                </div>
                                <span>+54 11 1234-5678</span>
                            </li>
                            <li className="flex gap-4 mt-6">
                                <a href="#" className="bg-white/10 p-3 rounded-2xl text-white hover:bg-primary-orange hover:text-white transition-all hover:-translate-y-1">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" className="bg-white/10 p-3 rounded-2xl text-white hover:bg-primary-orange hover:text-white transition-all hover:-translate-y-1">
                                    <Facebook size={24} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <p className="text-sm font-medium text-white/40">
                        &copy; {new Date().getFullYear()} Peluquería Canina. {t.footer?.copyright}
                    </p>

                    <div className="relative group">
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 pointer-events-none" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                            className="appearance-none pl-10 pr-8 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-sm font-medium border border-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                            <option value="es" className="text-gray-900 bg-white">Español</option>
                            <option value="en" className="text-gray-900 bg-white">English</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
