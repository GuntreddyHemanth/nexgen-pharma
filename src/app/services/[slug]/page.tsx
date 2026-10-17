import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, FileCheck2, MessageCircle } from "lucide-react";
import { Button, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { Icon, IconTile } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { getService, services } from "@/lib/services";
import { approach, site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return { title: s.title, description: s.summary };
}

export default async function ServicePage({ params }: Props) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const others = services.filter((o) => o.slug !== s.slug).slice(0, 3);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_25%,transparent_70%)]" />
        <div className="absolute -right-32 -top-32 size-[30rem] rounded-full bg-brand-600/35 blur-3xl" />
        <Icon
          name={s.icon}
          className="pointer-events-none absolute -right-10 top-24 hidden size-[26rem] text-white/[0.04] lg:block"
          strokeWidth={0.6}
        />
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-100/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="size-3.5" />
            <Link href="/services" className="hover:text-white">Services</Link>
            <ChevronRight className="size-3.5" />
            <span className="text-brand-100">{s.title}</span>
          </nav>
          <Reveal>
            <p className="eyebrow mt-8 !text-leaf-300">{s.pillar}</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">{s.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/80">{s.intro}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={`/contact?service=${s.slug}`} variant="leaf" arrow>
                Request a quote
              </Button>
              <Button href={whatsappLink(`Hello Nexgen Pharma, I'd like to enquire about ${s.title}.`)} variant="ghost" external>
                <MessageCircle className="size-4" aria-hidden /> Ask on WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="What's included" title="Scope of service" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.offerings.map((o, i) => (
            <Reveal key={o.title} delay={(i % 3) * 0.06}>
              <div className="card h-full p-6">
                <span className="font-display text-sm font-bold text-leaf-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-bold">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-canvas py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {s.scope && (
            <Reveal>
              <div className="card h-full p-7 sm:p-9">
                <IconTile name={s.icon} />
                <h2 className="mt-6 text-2xl font-bold">{s.scope.label}</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.scope.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-ink">
                      <Check className="mt-0.5 size-4 shrink-0 text-leaf-500" aria-hidden /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}
          <Reveal delay={0.08} className={s.scope ? "" : "lg:col-span-2"}>
            <div className="h-full rounded-[1.25rem] bg-brand-900 p-7 text-white sm:p-9">
              <span className="inline-grid size-12 place-items-center rounded-xl bg-white/10 text-leaf-300 ring-1 ring-white/15">
                <FileCheck2 className="size-6" aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-bold">What you receive</h2>
              <ul className="mt-6 space-y-3.5">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-brand-100/90">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-leaf-500">
                      <Check className="size-3 text-white" strokeWidth={3} aria-hidden />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 sm:py-24">
        <SectionHeading eyebrow="How we work" title="Four steps, fully documented." />
        <ol className="mt-12 grid gap-5 md:grid-cols-4">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <li className="h-full border-l-2 border-brand-100 pl-5">
                <span className="font-display text-3xl font-extrabold text-brand-200">{i + 1}</span>
                <h3 className="mt-2 font-bold">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {s.faqs.length > 0 && (
        <section className="bg-canvas py-20 sm:py-24">
          <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading
              eyebrow="FAQ"
              title="Common questions"
              body={
                <>
                  Something else? Call{" "}
                  <a href={`tel:${site.phones[0].tel}`} className="font-semibold text-brand-600">
                    {site.phones[0].display}
                  </a>
                  .
                </>
              }
            />
            <div className="space-y-3">
              {s.faqs.map((f) => (
                <details key={f.q} className="group card p-6 open:shadow-[0_18px_40px_-24px_rgb(15_37_87/0.3)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                    {f.q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-x pt-20 sm:pt-24">
        <SectionHeading eyebrow="Related" title="Other services" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/services/${o.slug}`} className="card card-hover group flex items-center gap-4 p-5">
              <IconTile name={o.icon} />
              <span className="flex-1 font-semibold">{o.title}</span>
              <ArrowRight className="size-4 text-brand-600 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <CtaBand title={`Let's plan your ${s.title.toLowerCase()}.`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
