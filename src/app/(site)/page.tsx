import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FlaskConical, HeartPulse, Leaf, MapPin, Minus, Pill } from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";
import { Button, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { IconTile } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { pillars } from "@/lib/services";
import { getCategories, getMedia, getServices, getTestimonials } from "@/lib/content";
import { Quote } from "lucide-react";
import { approach, clusters, industries } from "@/lib/site";

const trust = [
  "NABL-traceable master standards",
  "GMP-aligned documentation",
  "DQ · IQ · OQ · PQ",
  "Audit-ready reports",
  "In-house CNC & SS fabrication",
  "Hyderabad & Visakhapatnam",
];

const comparison = [
  ["Supplies materials to specification", true, true],
  ["In-house CNC machining & lathe", false, true],
  ["In-house SS fabrication", false, true],
  ["Own calibration & validation lab", false, true],
  ["Custom parts from drawing or sample", false, true],
  ["Validation documentation support", false, true],
  ["One point of accountability", false, true],
] as const;

const industryIcons = [Pill, FlaskConical, HeartPulse, Leaf];

export default async function Home() {
  const [services, categories, testimonials, logos] = await Promise.all([
    getServices(),
    getCategories(),
    getTestimonials(),
    getMedia("logo"),
  ]);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-950 pb-20 pt-28 text-white sm:pt-36 lg:pb-28 lg:pt-44">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_25%,transparent_70%)]" />
        <div className="absolute -left-40 top-20 size-[36rem] rounded-full bg-brand-600/35 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-[28rem] rounded-full bg-leaf-500/15 blur-3xl" />

        <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-brand-100 backdrop-blur">
              <span className="size-1.5 rounded-full bg-leaf-400 shadow-[0_0_10px_2px] shadow-leaf-400/60" />
              Nexgen Pharma Enterprises · Engineering &amp; material partner to pharma plants in Telangana &amp; AP
            </span>
            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.04] sm:text-6xl lg:text-[4.2rem]">
              Compliance can&apos;t be compromised.{" "}
              <span className="text-gradient">Downtime isn&apos;t an option.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100/80">
              Calibration, HVAC validation, pharma-grade materials and in-house SS fabrication, delivered by one
              accountable team that builds, not just trades.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="leaf" arrow>
                Request a quote
              </Button>
              <Button href="/services" variant="ghost">
                Explore services
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {[
                ["7", "Service lines"],
                ["2", "In-house facilities"],
                [`${categories.reduce((n, c) => n + c.items.length, 0)}+`, "Product lines"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-3xl font-extrabold text-white">{n}</dd>
                  <dd className="mt-1 text-xs text-brand-100/70">{l}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.15}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* TRUST MARQUEE */}
      <section className="overflow-hidden border-b border-line bg-white py-5" aria-label="Highlights">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...trust, ...trust].map((t, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium text-muted">
              <span className="size-1.5 rounded-full bg-leaf-500" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeading
          eyebrow="What we offer"
          title="Three disciplines. One partner who owns the outcome."
          body="Reliable compliance, efficient operations and customised support, without juggling five different vendors."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Link href={p.href} className="card card-hover group flex h-full flex-col p-7">
                <IconTile name={p.icon} tone={i === 1 ? "leaf" : "brand"} />
                <h3 className="mt-6 text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                      <Check className="size-4 text-leaf-500" aria-hidden /> {pt}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-semibold text-brand-600">
                  Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NOT A TRADER */}
      <section className="relative overflow-hidden bg-canvas py-20 sm:py-28">
        <div className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why Nexgen"
              title={
                <>
                  Unlike traders, we have <span className="text-brand-600">our own strength.</span>
                </>
              }
              body="Through our sister concerns in Hyderabad and Visakhapatnam we run CNC machining, SS fabrication and lathe facilities, plus a fully equipped calibration and validation lab."
            />
            <Reveal delay={0.1}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Faster response", "No waiting on third-party vendors"],
                  ["Better quality control", "We make it, so we check it"],
                  ["Truly customised", "Built to your drawing or sample"],
                ].map(([t, b]) => (
                  <div key={t} className="rounded-2xl border border-line bg-white p-4">
                    <p className="font-display font-bold text-ink">{t}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{b}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button href="/capabilities" variant="outline" arrow>
                  See our facilities
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_30px_80px_-40px_rgb(15_37_87/0.35)]">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line bg-canvas px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted sm:gap-x-8 sm:px-7">
                <span>Capability</span>
                <span className="w-16 text-center">Typical trader</span>
                <span className="w-16 text-center text-brand-700">Nexgen</span>
              </div>
              {comparison.map(([label, trader, us]) => (
                <div
                  key={label}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-line px-5 py-3.5 text-sm last:border-0 sm:gap-x-8 sm:px-7"
                >
                  <span className="font-medium text-ink">{label}</span>
                  <span className="flex w-16 justify-center">
                    {trader ? (
                      <Check className="size-5 text-muted" aria-label="Yes" />
                    ) : (
                      <Minus className="size-5 text-slate-300" aria-label="No" />
                    )}
                  </span>
                  <span className="flex w-16 justify-center">
                    {us && (
                      <span className="grid size-6 place-items-center rounded-full bg-leaf-500 text-white">
                        <Check className="size-4" strokeWidth={3} aria-label="Yes" />
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Services"
            title="From calibration certificate to cleanroom trolley."
            body="Each service is delivered by our own engineers, using our own calibrated equipment and our own shop floor."
          />
          <Reveal>
            <Button href="/services" variant="outline" arrow>
              All services
            </Button>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 0.05} className="bg-white">
              <Link href={`/services/${s.slug}`} className="group flex h-full flex-col p-7 transition-colors hover:bg-canvas">
                <div className="flex items-start justify-between">
                  <IconTile name={s.icon} tone={s.pillar === "Engineering Support" ? "leaf" : "brand"} />
                  <ArrowUpRight className="size-5 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </div>
                <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted">{s.pillar}</p>
                <h3 className="mt-1.5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={0.15} className="bg-brand-600">
            <Link href="/contact" className="group flex h-full flex-col justify-between p-7 text-white">
              <p className="font-display text-xl font-bold leading-snug">
                Not sure what you need? Tell us the problem.
              </p>
              <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold">
                Talk to an engineer <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* MATERIALS */}
      <section className="relative overflow-hidden bg-brand-950 py-20 text-white sm:py-28">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom_right,black_20%,transparent_70%)]" />
        <div className="container-x relative">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end">
            <SectionHeading
              dark
              eyebrow="Material supply"
              title="Build your quote basket in minutes."
              body="Browse process, piping, electrical and instrumentation materials, add what you need with quantities and specs, and send one RFQ."
            />
            <Reveal className="lg:justify-self-end">
              <Button href="/materials" variant="leaf" arrow>
                Browse the catalogue
              </Button>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 0.05}>
                <Link
                  href={`/materials/${c.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-leaf-400/50 hover:bg-white/[0.08]"
                >
                  <IconTile name={c.icon} tone="dark" />
                  <h3 className="mt-5 font-display text-lg font-bold">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-100/65">{c.summary}</p>
                  <span className="mt-auto pt-5 text-xs font-semibold text-leaf-300">
                    {c.items.length} product lines →
                  </span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <Link
                href="/services/cnc-ss-fabrication"
                className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-leaf-500 to-leaf-700 p-6"
              >
                <p className="font-display text-lg font-bold leading-snug">Need it custom-made? We machine and fabricate in-house.</p>
                <span className="mt-6 text-sm font-semibold">CNC &amp; SS fabrication →</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="container-x py-20 sm:py-28">
        <SectionHeading align="center" eyebrow="Our approach" title="A clear process, documented at every step." />
        <ol className="relative mt-16 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent md:block" />
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <li className="relative text-center">
                <span className="relative mx-auto grid size-12 place-items-center rounded-full bg-white font-display text-lg font-extrabold text-brand-600 ring-1 ring-brand-200 shadow-[0_0_0_8px_white]">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">{a.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{a.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* INDUSTRIES + COVERAGE */}
      <section className="bg-canvas py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Industries" title="Built for regulated manufacturing." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {industries.map((ind, i) => {
                const I = industryIcons[i];
                return (
                  <Reveal key={ind.title} delay={i * 0.06}>
                    <div className="card h-full p-6">
                      <I className="size-7 text-brand-600" strokeWidth={1.6} aria-hidden />
                      <h3 className="mt-4 font-bold">{ind.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{ind.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Coverage"
              title="Across Telangana & Andhra Pradesh."
              body="Engineers based in Hyderabad and Visakhapatnam, close to the region's major pharma clusters."
            />
            <Reveal delay={0.1}>
              <div className="mt-10 rounded-3xl border border-line bg-white p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Hyderabad", "Visakhapatnam"].map((c) => (
                    <div key={c} className="flex items-center gap-3 rounded-2xl bg-brand-50 p-4">
                      <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white">
                        <MapPin className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="font-display font-bold">{c}</p>
                        <p className="text-xs text-muted">Facility &amp; service base</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Serving clusters including</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {clusters.map((c) => (
                    <span key={c} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {(testimonials.length > 0 || logos.length > 0) && (
        <section className="container-x pt-20 sm:pt-28">
          <SectionHeading align="center" eyebrow="Trusted by" title="What our clients say." />
          {logos.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
              {logos.map((l) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={l.id} src={`/media/${l.file_id}`} alt={l.caption || "Client logo"} className="h-12 w-auto max-w-40 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" loading="lazy" />
              ))}
            </div>
          )}
          {testimonials.length > 0 && (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={(i % 3) * 0.06}>
                  <figure className="card flex h-full flex-col p-7">
                    <Quote className="size-8 text-leaf-400" aria-hidden />
                    <blockquote className="mt-4 flex-1 leading-relaxed text-ink">{t.quote}</blockquote>
                    <figcaption className="mt-6 border-t border-line pt-4 text-sm">
                      <span className="block font-semibold">{t.name}</span>
                      <span className="text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          )}
        </section>
      )}

      <CtaBand />

    </>
  );
}
