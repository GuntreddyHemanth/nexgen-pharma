import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { CatalogBrowser } from "@/components/catalog-browser";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Materials Catalogue",
  description:
    "Process machine parts, SS & non-SS piping, fabrication materials, cleanroom SS items, plumbing, electrical and instrumentation materials for pharma plants.",
};

export default function MaterialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Materials we supply & rework"
        title="Pharma-grade materials, sourced to your specification."
        body="Browse by category or search, add items to your quote basket and send a single RFQ. If it isn't listed, ask: we source to spec or make it in-house."
      />
      <section className="container-x pb-8">
        <CatalogBrowser />
      </section>
      <CtaBand
        title="Have a BOQ or an indent ready?"
        body="Send us your list in any format: Excel, PDF or a photo of the indent. We'll respond with a consolidated quote."
      />
    </>
  );
}
