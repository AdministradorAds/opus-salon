import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MobileActionBar } from "@/components/MobileActionBar";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "OPUS SALON | Shopping Flamboyant · Goiânia",
    template: "%s | OPUS SALON",
  },
  description:
    "Há 40 anos transformando cuidado em experiência. Salão de beleza no Shopping Flamboyant, Goiânia. Agende online.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "OPUS SALON",
    description:
      "Beleza que se sente. Arte que se revela. 40 anos de excelência em Goiânia.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="texture-bg flex min-h-full flex-col antialiased pb-20 md:pb-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <MobileActionBar />
      </body>
    </html>
  );
}
