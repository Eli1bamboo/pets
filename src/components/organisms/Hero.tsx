import Link from "next/link";
import { CalendarCheck, Search } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative isolate overflow-hidden bg-brand-50">
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
                    <div className="mt-24 sm:mt-32 lg:mt-16">
                        <a href="#" className="inline-flex space-x-6">
                            <span className="rounded-full bg-brand-900/10 px-3 py-1 text-sm font-semibold leading-6 text-brand-900 ring-1 ring-inset ring-brand-900/10">
                                Novedad
                            </span>
                            <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-brand-700">
                                <span>Ahora con seguimiento en vivo</span>
                            </span>
                        </a>
                    </div>
                    <h1 className="mt-10 text-4xl font-bold tracking-tight text-brand-900 sm:text-6xl">
                        Estética Canina de <span className="text-brand-600">Primer Nivel</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-brand-700">
                        Tu mascota merece lo mejor. Ofrecemos servicios de spa, baño y corte con productos premium y un trato lleno de amor. Reserva tu turno y sigue el proceso desde tu celular.
                    </p>
                    <div className="mt-10 flex items-center gap-x-6">
                        <Link
                            href="/booking"
                            className="rounded-full bg-brand-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 transition-all flex items-center gap-2"
                        >
                            <CalendarCheck size={18} />
                            Reservar Turno
                        </Link>
                        <Link href="/tracking" className="text-sm font-semibold leading-6 text-brand-900 flex items-center gap-2 hover:underline">
                            <Search size={18} />
                            Seguimiento de Turno <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
                <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                    <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                        <div className="-m-2 rounded-xl bg-brand-900/5 p-2 ring-1 ring-inset ring-brand-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                            {/* Placeholder for high quality image */}
                            <div className="w-[40rem] rounded-md bg-brand-200 shadow-2xl ring-1 ring-brand-900/10 h-[30rem] flex items-center justify-center text-brand-500">
                                <span className="text-lg font-medium">📷 Imagen Premium de Mascota Feliz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
