import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-brand-950 text-brand-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <span className="text-2xl font-bold text-white tracking-tight">Peluquería Canina</span>
                        <p className="mt-4 text-sm leading-6 max-w-xs">
                            Cuidamos a tu mascota como si fuera nuestra. Servicios de spa, corte y baño con los mejores productos orgánicos.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold leading-6 text-white">Enlaces Rápidos</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li>
                                <Link href="/services" className="text-sm leading-6 hover:text-white transition-colors">
                                    Servicios
                                </Link>
                            </li>
                            <li>
                                <Link href="/booking" className="text-sm leading-6 hover:text-white transition-colors">
                                    Reservar Turno
                                </Link>
                            </li>
                            <li>
                                <Link href="/tracking" className="text-sm leading-6 hover:text-white transition-colors">
                                    Seguimiento en Vivo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold leading-6 text-white">Contacto</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li className="flex items-center gap-2 text-sm leading-6">
                                <MapPin size={18} />
                                <span>Av. Libertador 1234, CABA</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm leading-6">
                                <Phone size={18} />
                                <span>+54 11 1234-5678</span>
                            </li>
                            <li className="flex gap-4 mt-2">
                                <a href="#" className="hover:text-white transition-colors">
                                    <Instagram size={24} />
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    <Facebook size={24} />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-brand-800 pt-8 text-center text-xs leading-5">
                    <p>&copy; {new Date().getFullYear()} Peluquería Canina. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
