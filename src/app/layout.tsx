import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Peluquería Canina | Reserva de Turnos Online",
  description: "Reserva turnos para el cuidado de tu mascota de forma rápida y sencilla. Seguimiento en tiempo real del estado de tu perro.",
  keywords: ["peluquería canina", "reserva turnos", "baño perros", "corte de pelo mascotas"],
};




import { LanguageProvider } from "@/i18n/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
