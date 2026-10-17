import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { CatalogBrowser } from "@/components/catalog-browser";
import { CtaBand } from "@/components/cta-band";
import { CatalogueForm } from "@/components/catalogue-form";
import { getCategories, hasCatalogue } from "@/lib/content";
import { FileDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Materials Catalogue",
  description:
    "Process machine parts, SS & non-SS piping, fabrication materials, cleanroom SS items, plumbing, electrical and instrumentation materials for pharma plants.",
};

export default async function MaterialsPage() {
  const [categories, catalogue] = await Promise.all([getCategories(), hasCatalogue()]);
  return (
    <>
      <PageHero
        eyebrow="Materials we supply & rework"
        title="Pharma-grade materials, sourced to your specification."
        body="Browse by category or search, add items to your quote basket and send a single RFQ. If it isn't listed, ask: we source to spec or make it in-house."
      />
      <section className="container-x pb-8">
        <CatalogBrowser categories={categories} />
      </section>
      <section className="container-x pt-16">
        <div className="grid gap-10 overflow-hidden rounded-[2rem] border border-line bg-canvas p-6 sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <span className="inline-grid size-14 place-items-center rounded-2xl bg-leaf-500 text-white">
              <FileDown className="size-7" aria-hidden />
            </span>
            <h2 className="mt-6 text-3xl font-bold">Get the full material catalogue</h2>
            <p className="mt-3 leading-relaxed text-muted">
              {catalogue
                ? "Our complete catalogue as a PDF: grades, sizes, makes and capabilities in one document. Share your details and download it instantly."
                : "Share your details and we'll send you our complete catalogue with grades, sizes, makes and capabilities."}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-[0_30px_80px_-40px_rgb(15_37_87/0.35)] sm:p-8">
            <CatalogueForm instant={catalogue} />
          </div>
        </div>
      </section>
      <CtaBand
        title="Have a BOQ or an indent ready?"
        body="Send us your list in any format: Excel, PDF or a photo of the indent. We'll respond with a consolidated quote."
      />
    </>
  );
}
