import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
