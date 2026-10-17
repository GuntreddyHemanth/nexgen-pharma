import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { categories } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100/75">
      <div className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-x relative grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="inline-block rounded-2xl bg-white px-4 py-3">
            <Image src="/brand/logo.png" alt={site.name} width={913} height={242} className="h-10 w-auto" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Your engineering and material partner for the pharmaceutical industry. Calibration, validation, materials
            and in-house fabrication: one accountable team.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-leaf-300">{site.tagline}</p>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-semibold text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="transition hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-white">Materials</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/materials/${c.slug}`} className="transition hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-leaf-400" aria-hidden />
              <span>
                {site.address.locality}, {site.address.region}, {site.address.country}
              </span>
            </li>
            {site.phones.map((p) => (
              <li key={p.tel} className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-leaf-400" aria-hidden />
                <a href={`tel:${p.tel}`} className="hover:text-white">
                  {p.display}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-leaf-400" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
