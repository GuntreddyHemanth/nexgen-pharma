import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { RfqProvider } from "@/components/rfq-context";
import { site } from "@/lib/site";
import { getServices } from "@/lib/content";

export const revalidate = 300;

const jsonLd = (services: Awaited<ReturnType<typeof getServices>>) => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  alternateName: ["Nexgen Pharma", "Nexgen Pharma Enterprises", "NexGen Pharma Hyderabad"],
  image: `${site.url}/brand/card.jpg`,
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
});

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const services = await getServices();
  return (
    <>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          Skip to content
        </a>
        <RfqProvider>
          <Header services={services.map(({ slug, title, icon, summary }) => ({ slug, title, icon, summary }))} />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFab />
        </RfqProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(services)) }} />
    </>
  );
}
