"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ClipboardList, Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import type { Service } from "@/lib/services";
import { Icon } from "./icon";
import { useRfq } from "./rfq-context";

export function Header({ services }: { services: Pick<Service, "slug" | "title" | "icon" | "summary">[] }) {
  const pathname = usePathname();
  const { lines } = useRfq();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-white"
      }`}
    >
      <div className="hidden border-b border-line bg-canvas text-xs text-muted lg:block">
        <div className="container-x flex h-9 items-center justify-between">
          <p>Serving pharma plants across Telangana &amp; Andhra Pradesh · In-house facilities at Hyderabad &amp; Visakhapatnam</p>
          <div className="flex items-center gap-5">
            <a href={`tel:${site.phones[0].tel}`} className="hover:text-brand-700">{site.phones[0].display}</a>
            <a href={`mailto:${site.email}`} className="hover:text-brand-700">{site.email}</a>
            <Link href="/portal" className="font-semibold text-brand-700 hover:underline">Client login</Link>
          </div>
        </div>
      </div>

      <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label={`${site.name} home`}>
          <Image src="/brand/logo.png" alt={site.name} width={913} height={242} priority className="h-10 w-auto lg:h-11" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) =>
            item.href === "/services" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href) ? "text-brand-700" : "text-ink/80 hover:text-brand-700"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180" aria-hidden />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[36rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-3 shadow-[0_24px_60px_-20px_rgb(15_37_87/0.3)]">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-canvas"
                      >
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                          <Icon name={s.icon} className="size-[18px]" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-ink">{s.title}</span>
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted">{s.summary}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href) ? "text-brand-700" : "text-ink/80 hover:text-brand-700"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/rfq"
            className="relative grid size-10 place-items-center rounded-full text-ink/80 ring-1 ring-line transition hover:text-brand-700 hover:ring-brand-200"
            aria-label={`Quote basket, ${lines.length} items`}
          >
            <ClipboardList className="size-5" aria-hidden />
            {lines.length > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-leaf-500 px-1 text-[11px] font-bold text-white">
                {lines.length}
              </span>
            )}
          </Link>
          <Link
            href="/contact"
            className="hidden rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 sm:inline-flex"
          >
            Get a Quote
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full ring-1 ring-line lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
          >
            <div className="container-x py-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Services</p>
              <div className="mt-3 grid gap-1">
                {services.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-canvas">
                    <Icon name={s.icon} className="size-5 text-brand-600" />
                    <span className="font-medium">{s.title}</span>
                  </Link>
                ))}
              </div>
              <div className="my-5 h-px bg-line" />
              <div className="grid gap-1">
                {nav
                  .filter((n) => n.href !== "/services")
                  .map((n) => (
                    <Link key={n.href} href={n.href} className="rounded-xl px-2 py-2.5 text-lg font-semibold hover:bg-canvas">
                      {n.label}
                    </Link>
                  ))}
                <Link href="/portal" className="rounded-xl px-2 py-2.5 text-lg font-semibold hover:bg-canvas">
                  Client login
                </Link>
                <Link href="/rfq" className="rounded-xl px-2 py-2.5 text-lg font-semibold hover:bg-canvas">
                  Quote basket {lines.length > 0 && <span className="text-leaf-600">({lines.length})</span>}
                </Link>
              </div>
              <div className="mt-6 grid gap-3">
                <Link href="/contact" className="rounded-full bg-brand-600 py-3 text-center font-semibold text-white">
                  Get a Quote
                </Link>
                <a href={`tel:${site.phones[0].tel}`} className="flex items-center justify-center gap-2 rounded-full py-3 font-semibold ring-1 ring-line">
                  <Phone className="size-4" /> {site.phones[0].display}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
