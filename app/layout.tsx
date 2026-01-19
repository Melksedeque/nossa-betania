import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nossa Betânia",
  description: "A primeira Casa de Apostas focada no Caos Corporativo.",
  icons: {
    icon: "/icone.png",
    shortcut: "/icone.png",
    apple: "/icone.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/icone.png",
    },
  },
};

import { ToastProvider } from "@/components/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${oswald.variable} antialiased bg-slate-900 text-slate-50`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
