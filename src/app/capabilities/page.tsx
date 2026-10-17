import type { Metadata } from "next";
import { Check, Cog, FlaskConical, Hammer, MapPin, RotateCw } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Capabilities & Facilities",
  description:
    "In-house CNC machining, SS fabrication, lathe facilities and a calibration & validation lab through our sister concerns in Hyderabad and Visakhapatnam.",
};

const facilities = [
  {
    icon: FlaskConical,
    title: "Calibration & Validation Lab",
    body: "A fully equipped lab with master standards traceable to NABL-accredited laboratories, and field kits for on-site work.",
    points: [
      "Pressure, temperature & electrical masters",
      "Particle counters & anemometers",
      "Aerosol generator & photometer",
      "Temperature & humidity data loggers",
    ],
  },
  {
    icon: Cog,
    title: "CNC Machining",
    body: "Precision turning and milling for product contact parts, spares and custom components.",
    points: ["SS 304 / SS 316L / MS / EN-series", "Engineering plastics (PTFE, nylon, PP)", "Reverse engineering from sample", "Dimensional inspection"],
  },
  {
    icon: Hammer,
    title: "SS Fabrication",
    body: "Cleanroom furniture, hoppers, chutes, enclosures and structures built to pharma finish standards.",
    points: ["TIG welding", "Buffing & mirror / matt polishing", "Cleanroom trolleys, tables & racks", "Custom fabrication to drawing"],
  },
  {
    icon: RotateCw,
    title: "Lathe & Conventional Machining",
    body: "Fast turnaround on shafts, bushes, flanges and urgent breakdown repairs.",
    points: ["Shafts, bushes & couplings", "Flanges & adaptors", "Repair & re-machining", "Small-batch production"],
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="We make what others only resell."
        body="Our sister concerns in Hyderabad and Visakhapatnam give us in-house machining, fabrication and calibration capability, so we control quality and delivery directly."
      />

      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-2">
          {facilities.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 0.08}>
              <div className="card group relative h-full overflow-hidden p-8 sm:p-10">
                <f.icon
                  className="pointer-events-none absolute -right-6 -top-6 size-40 text-brand-50 transition-transform duration-500 group-hover:rotate-12"
                  strokeWidth={1}
                  aria-hidden
                />
                <div className="relative">
                  <span className="inline-grid size-14 place-items-center rounded-2xl bg-brand-600 text-white">
                    <f.icon className="size-7" aria-hidden />
                  </span>
                  <h2 className="mt-6 text-2xl font-bold">{f.title}</h2>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{f.body}</p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-ink">
                        <Check className="mt-0.5 size-4 shrink-0 text-leaf-500" aria-hidden /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-950 py-20 text-white sm:py-28">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="container-x relative">
          <SectionHeading
            dark
            align="center"
            eyebrow="Two locations"
            title="Close to the plants we serve."
            body="Facilities near Telangana's and Andhra Pradesh's pharma clusters mean shorter travel, faster pickups and quicker turnaround."
          />
          <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
            {[
              ["Hyderabad", "Telangana", "Serving Genome Valley, Jeedimetla, Bollaram, Pashamylaram, Patancheru and surrounding clusters."],
              ["Visakhapatnam", "Andhra Pradesh", "Serving JN Pharma City Parawada, Atchutapuram, Nakkapalli and the Anakapalli region."],
            ].map(([city, state, body]) => (
              <Reveal key={city}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur">
                  <MapPin className="size-7 text-leaf-400" aria-hidden />
                  <h3 className="mt-4 text-2xl font-bold">{city}</h3>
                  <p className="text-sm font-medium text-leaf-300">{state}</p>
                  <p className="mt-4 text-sm leading-relaxed text-brand-100/75">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Have a drawing, a sample or a broken part?" body="Send us a photo or drawing on WhatsApp. We'll confirm feasibility, material and lead time." />
    </>
  );
}
