import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-brand-900 py-20 px-6 sm:px-8 lg:px-12 border-t border-brand-900/10">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <span className="text-3xl font-black text-white tracking-tight">
                            Peluquería <span className="text-primary-orange">Canina</span>
                        </span>
                        <p className="mt-6 text-base leading-7 max-w-sm text-white/70">
                            Cuidamos a tu mascota como si fuera nuestra. Servicios de spa, corte y baño con los mejores productos orgánicos y un equipo que ama lo que hace.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Explorar</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li>
                                <Link href="/" className="text-sm font-bold leading-6 text-white/80 hover:text-primary-orange transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking" className="text-sm font-bold leading-6 text-white/80 hover:text-primary-orange transition-colors">
                                    Reservar Turno
                                </Link>
                            </li>
                            <li>
                                <Link href="/tracking" className="text-sm font-bold leading-6 text-white/80 hover:text-primary-orange transition-colors">
                                    Seguimiento en Vivo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Contacto</h3>
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
                <div className="mt-16 border-t border-white/10 pt-10 text-center">
                    <p className="text-sm font-medium text-white/40">
                        &copy; {new Date().getFullYear()} Peluquería Canina. Hecho con ❤️ para tus mascotas.
                    </p>
                </div>
            </div>
        </footer>
    );
}
