"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { categories } from "@/lib/catalog";
import { IconTile } from "./icon";
import { AddToRfq } from "./add-to-rfq";

export function CatalogBrowser() {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return [];
    return categories.flatMap((c) =>
      c.items
        .filter((i) => `${i.name} ${i.spec} ${c.title}`.toLowerCase().includes(term))
        .map((i) => ({ ...i, category: c.title })),
    );
  }, [term]);

  return (
    <>
      <div className="relative mx-auto -mt-8 max-w-2xl">
        <Search className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search e.g. 316L, tri-clover, transmitter, MCB…"
          aria-label="Search materials"
          className="w-full rounded-full border border-line bg-white py-4 pl-14 pr-5 text-base shadow-[0_20px_50px_-24px_rgb(15_37_87/0.35)] outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
        />
      </div>

      {term ? (
        <div className="mt-10">
          <p className="text-sm text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
          </p>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {results.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-600">{r.category}</p>
                  <p className="mt-0.5 font-semibold text-ink">{r.name}</p>
                  <p className="text-sm text-muted">{r.spec}</p>
                </div>
                <AddToRfq id={r.id} name={r.name} category={r.category} spec={r.spec} />
              </li>
            ))}
            {results.length === 0 && (
              <li className="p-8 text-center text-sm text-muted">
                Not listed? We source to specification.{" "}
                <Link href="/contact?service=materials" className="font-semibold text-brand-600">
                  Send us your requirement →
                </Link>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/materials/${c.slug}`} className="card card-hover group flex flex-col p-7">
              <div className="flex items-start justify-between">
                <IconTile name={c.icon} tone="leaf" />
                <span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-muted">
                  {c.items.length} lines
                </span>
              </div>
              <h2 className="mt-6 text-xl font-bold">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {c.items.slice(0, 4).map((i) => (
                  <li key={i.id} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink/80">
                    {i.name}
                  </li>
                ))}
              </ul>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-600">
                View products <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
