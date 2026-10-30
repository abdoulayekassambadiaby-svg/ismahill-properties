import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import JsonLd from "@/components/JsonLd";
import { MotionProvider } from "@/components/Motion";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.nom} | Agence immobilière à Bingerville`,
    template: `%s | ${site.nom}`,
  },
  description: site.description,
  keywords: site.motsCles,
  applicationName: site.nom,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: site.nom,
    url: "/",
    title: `${site.nom} | Agence immobilière à Bingerville`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.nom} — ${site.slogan}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nom} | Agence immobilière à Bingerville`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#012F6D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <JsonLd />
      </head>
      <body className="min-h-screen overflow-x-hidden">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-marine focus:px-4 focus:py-2 focus:text-white">
          Aller au contenu
        </a>
        <MotionProvider>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </MotionProvider>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
