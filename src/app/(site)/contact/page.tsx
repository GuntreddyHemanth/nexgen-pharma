import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/ui";
import { EnquiryForm } from "@/components/enquiry-form";
import { site, whatsappLink } from "@/lib/site";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact & Request a Quote",
  description: "Request a quote for calibration, HVAC validation, qualification, materials or SS fabrication. Call, WhatsApp or email Nexgen Pharma Enterprises, Hyderabad.",
};

type Props = { searchParams: Promise<{ service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { service = "" } = await searchParams;
  const services = await getServices();

  const channels = [
    ...site.phones.map((p) => ({ icon: Phone, label: "Call", value: p.display, href: `tel:${p.tel}` })),
    { icon: MessageCircle, label: "WhatsApp", value: site.phones[0].display, href: whatsappLink("Hello Nexgen Pharma, I have a requirement.") },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Mail, label: "Email (alternate)", value: site.altEmail, href: `mailto:${site.altEmail}` },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what your plant needs."
        body="Share your requirement and our engineers will get back with a plan and a quote, usually within one working day."
      />

      <section className="container-x grid gap-10 py-14 lg:grid-cols-[1fr_1.5fr] lg:py-20">
        <div className="space-y-4">
          {channels.map((c) => (
            <a
              key={c.label + c.value}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="card card-hover flex items-center gap-4 p-5"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <c.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-wider text-muted">{c.label}</span>
                <span className="block truncate font-semibold text-ink">{c.value}</span>
              </span>
            </a>
          ))}
          <div className="rounded-[1.25rem] bg-brand-950 p-6 text-brand-100/80">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-leaf-400" aria-hidden />
              <div>
                <p className="font-semibold text-white">Office</p>
                <p className="text-sm">
                  {site.address.locality}, {site.address.region}, {site.address.country}
                </p>
                <p className="mt-2 text-sm">Facilities: {site.facilities.join(" · ")}</p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-leaf-400" aria-hidden />
              <div>
                <p className="font-semibold text-white">Working hours</p>
                <p className="text-sm">{site.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 shadow-[0_30px_80px_-40px_rgb(15_37_87/0.35)] sm:p-10">
          <h2 className="text-2xl font-bold">Request a quote</h2>
          <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
          <div className="mt-8">
            <EnquiryForm defaultService={service} services={services.map((s) => ({ value: s.slug, label: s.title }))} />
          </div>
        </div>
      </section>
    </>
  );
}
