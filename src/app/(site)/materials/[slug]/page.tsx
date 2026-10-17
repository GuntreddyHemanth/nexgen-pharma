import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ClipboardList } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { IconTile } from "@/components/icon";
import { AddToRfq } from "@/components/add-to-rfq";
import { CtaBand } from "@/components/cta-band";
import { getCategories, getCategory } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  if (!c) return {};
  return { title: c.title, description: c.summary };
}

export default async function CategoryPage({ params }: Props) {
  const c = await getCategory((await params).slug);
  if (!c) notFound();
  const categories = await getCategories();

  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 pb-14 pt-32 text-white sm:pt-40">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-100/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="size-3.5" />
            <Link href="/materials" className="hover:text-white">Materials</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-brand-100">{c.title}</span>
          </nav>
          <Reveal>
            <div className="mt-8 flex items-center gap-4">
              <IconTile name={c.icon} tone="dark" />
              <p className="eyebrow !text-leaf-300">{c.items.length} product lines</p>
            </div>
            <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">{c.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-brand-100/80">{c.summary}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Categories</p>
          <ul className="mt-4 space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/materials/${cat.slug}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    cat.slug === c.slug ? "bg-brand-50 font-semibold text-brand-700" : "text-ink/75 hover:bg-canvas"
                  }`}
                >
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {c.items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 2) * 0.05}>
                <li className="card flex h-full flex-col p-6">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{item.id.toUpperCase()}</p>
                  <h2 className="mt-2 text-lg font-bold">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted">{item.spec}</p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-xs text-muted">Price on request</span>
                    <AddToRfq id={item.id} name={item.name} category={c.title} spec={item.spec} />
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink">
              <span className="font-semibold">Need a different grade, size or make?</span> Add notes in your quote
              basket. We source to spec.
            </p>
            <Link href="/rfq" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">
              <ClipboardList className="size-4" aria-hidden /> Review basket
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
