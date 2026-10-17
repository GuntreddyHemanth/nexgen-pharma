import type { Metadata } from "next";
import { BadgeCheck, Clock3, Handshake, ShieldCheck, Target, Users } from "lucide-react";
import { Button, PageHero, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { CtaBand } from "@/components/cta-band";
import { approach, industries } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nexgen Pharma Enterprises LLP is an engineering and material partner for pharmaceutical plants, backed by in-house CNC, SS fabrication and calibration facilities.",
};

const values = [
  { icon: ShieldCheck, title: "Compliance first", body: "Every job is documented to stand up to QA review and regulatory audit." },
  { icon: Users, title: "Experienced team", body: "Engineers and technicians who work inside pharma plants every day." },
  { icon: BadgeCheck, title: "Quality assurance", body: "Calibrated master standards, inspected parts and certified materials." },
  { icon: Clock3, title: "Responsive support", body: "Local teams in Hyderabad and Visakhapatnam keep response times short." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Nexgen"
        title="Engineering excellence. Compliance assured."
        body="We help pharmaceutical plants achieve reliable compliance, efficient operations and customised support, with the strength of our own facilities behind every commitment."
      />

      <section className="container-x grid gap-14 py-20 sm:py-28 lg:grid-cols-2">
        <SectionHeading
          eyebrow="Who we are"
          title="A partner built for how pharma plants actually work."
        />
        <Reveal delay={0.08}>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              In pharma, compliance can&apos;t be compromised and downtime isn&apos;t an option. Yet plant teams often
              juggle separate vendors for calibration, validation, materials and fabrication, and lose time
              coordinating between them.
            </p>
            <p>
              <strong className="text-ink">Nexgen Pharma Enterprises LLP</strong> brings these together. Through our
              sister concerns in Hyderabad and Visakhapatnam, we operate CNC machining, SS fabrication and lathe
              facilities, along with a fully equipped calibration and validation lab.
            </p>
            <p>
              The result is faster response, better quality control and truly customised solutions, all under one
              roof.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="bg-canvas py-20 sm:py-28">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="card h-full p-8">
                <Target className="size-8 text-brand-600" strokeWidth={1.6} aria-hidden />
                <h2 className="mt-5 text-2xl font-bold">Our mission</h2>
                <p className="mt-3 leading-relaxed text-muted">
                  To be the engineering and material partner pharma plants can rely on, delivering compliant,
                  well-documented work on time, every time.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card h-full p-8">
                <Handshake className="size-8 text-leaf-600" strokeWidth={1.6} aria-hidden />
                <h2 className="mt-5 text-2xl font-bold">Our promise</h2>
                <p className="mt-3 leading-relaxed text-muted">
                  One accountable team from requirement to report. No passing the buck between vendors, and no
                  surprises at audit time.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-20">
            <SectionHeading eyebrow="Why choose us" title="What you can count on." />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.06}>
                  <div className="card h-full p-6">
                    <v.icon className="size-7 text-brand-600" strokeWidth={1.6} aria-hidden />
                    <h3 className="mt-4 font-bold">{v.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our approach" title="How every engagement runs." />
            <ol className="mt-10 space-y-6">
              {approach.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.05}>
                  <li className="flex gap-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 font-display font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold">{a.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{a.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="Industries we serve" title="Regulated manufacturing, end to end." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {industries.map((ind) => (
                <div key={ind.title} className="rounded-2xl border border-line p-5">
                  <h3 className="font-bold">{ind.title}</h3>
                  <p className="mt-1 text-sm text-muted">{ind.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button href="/capabilities" variant="outline" arrow>
                Explore our facilities
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
