import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { RfqProvider } from "@/components/rfq-context";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Calibration, HVAC Validation & Pharma Engineering`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "instrument calibration Hyderabad",
    "HVAC validation",
    "equipment qualification DQ IQ OQ PQ",
    "pharma engineering services",
    "SS fabrication Hyderabad",
    "CNC machining Visakhapatnam",
    "pharmaceutical materials supplier Telangana",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}: Engineering Excellence. Compliance Assured.`,
    description: site.description,
    images: [{ url: "/brand/card.jpg", width: 1600, height: 900, alt: site.name }],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08163a",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  slogan: site.tagline,
  description: site.description,
  url: site.url,
  logo: `${site.url}/brand/logo.png`,
  email: site.email,
  telephone: site.phones.map((p) => p.tel),
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: "IN",
  },
  areaServed: ["Telangana", "Andhra Pradesh"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.summary },
    })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <RfqProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFab />
        </RfqProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
