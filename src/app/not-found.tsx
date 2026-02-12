import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-cream px-6 text-center">
            <h1 className="text-8xl font-black text-brand-900 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-brand-700 mb-2">Página no encontrada</h2>
            <p className="text-brand-500 mb-8 max-w-md">
                La página que buscás no existe o fue movida.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-brand-900 text-white rounded-full font-bold hover:bg-primary-orange transition-colors"
            >
                Volver al Inicio
            </Link>
        </div>
    );
}
