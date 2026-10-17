import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { marked } from "marked";
import { CtaBand } from "@/components/cta-band";
import { getPost, getPosts } from "@/lib/content";
import { site } from "@/lib/site";
import { fmtDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { type: "article", title: p.title, description: p.excerpt } };
}

export default async function PostPage({ params }: Props) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const html = await marked.parse(p.body, { gfm: true });

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    datePublished: p.published_at ?? undefined,
    publisher: { "@type": "Organization", name: site.name, logo: `${site.url}/brand/logo.png` },
  };

  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 pb-14 pt-32 text-white sm:pt-40">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
        <div className="container-x relative max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-100/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="size-3.5" />
            <Link href="/insights" className="hover:text-white">Insights</Link>
          </nav>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-5 text-lg text-brand-100/80">{p.excerpt}</p>
          {p.published_at && <p className="mt-6 text-sm text-brand-100/60">{fmtDate(p.published_at)}</p>}
        </div>
      </section>
      <article
        className="prose-nx container-x max-w-3xl py-14"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
