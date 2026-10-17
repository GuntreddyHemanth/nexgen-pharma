import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { IconTile } from "@/components/icon";
import { CtaBand } from "@/components/cta-band";
import { services, type Pillar } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Instrument calibration, HVAC validation, equipment qualification, engineering maintenance, CNC machining, SS fabrication, training and compliance consultancy for pharma plants.",
};

const groups: { id: string; pillar: Pillar; blurb: string }[] = [
  {
    id: "validation",
    pillar: "Validation & Compliance",
    blurb: "Evidence your QA team can file and your auditors will accept.",
  },
  {
    id: "engineering",
    pillar: "Engineering Support",
    blurb: "Hands, tools and a shop floor that keep your plant running.",
  },
  {
    id: "training",
    pillar: "Training & Consultancy",
    blurb: "Build competence in-house and walk into audits prepared.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Engineering and validation services for regulated plants."
        body="Seven service lines, one team. Choose a service to see scope, deliverables and how we work."
      />

      {groups.map((g, gi) => (
        <section key={g.id} id={g.id} className={`scroll-mt-28 py-20 ${gi % 2 ? "bg-canvas" : ""}`}>
          <div className="container-x">
            <SectionHeading eyebrow={`0${gi + 1} · ${g.pillar}`} title={g.blurb} />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((s) => s.pillar === g.pillar)
                .map((s, i) => (
                  <Reveal key={s.slug} delay={i * 0.06}>
                    <Link href={`/services/${s.slug}`} className="card card-hover group flex h-full flex-col p-7">
                      <IconTile name={s.icon} tone={gi === 1 ? "leaf" : "brand"} />
                      <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
                      <ul className="mt-5 space-y-2 border-t border-line pt-5">
                        {s.offerings.slice(0, 3).map((o) => (
                          <li key={o.title} className="flex items-start gap-2 text-sm text-ink">
                            <Check className="mt-0.5 size-4 shrink-0 text-leaf-500" aria-hidden />
                            {o.title}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-600">
                        View service <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
