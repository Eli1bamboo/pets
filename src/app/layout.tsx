import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peluquería Canina | Reserva de Turnos Online",
  description: "Reserva turnos para el cuidado de tu mascota de forma rápida y sencilla. Seguimiento en tiempo real del estado de tu perro.",
  keywords: ["peluquería canina", "reserva turnos", "baño perros", "corte de pelo mascotas"],
};


import { CustomerProvider } from "@/providers/CustomerProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomerProvider>
          {children}
        </CustomerProvider>
      </body>
    </html>
  );
}
