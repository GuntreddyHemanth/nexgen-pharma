import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { getPosts } from "@/lib/content";
import { fmtDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Insights",
  description: "Practical guides on calibration, HVAC validation, qualification and GMP compliance for pharma plant teams.",
};

export default async function InsightsPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Practical guidance for plant and QA teams."
        body="Checklists and explainers on calibration, validation and audit readiness, written by engineers who do the work."
      />
      <section className="container-x py-16 sm:py-20">
        {posts.length === 0 ? (
          <p className="text-center text-muted">Articles are on their way.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.06}>
                <Link href={`/insights/${p.slug}`} className="card card-hover group flex h-full flex-col p-7">
                  {p.published_at && <p className="text-xs font-medium text-muted">{fmtDate(p.published_at)}</p>}
                  <h2 className="mt-3 text-xl font-bold leading-snug">{p.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
