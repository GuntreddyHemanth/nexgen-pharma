"use client";

import Link from "next/link";
import { ClipboardList, Trash2 } from "lucide-react";
import { useRfq } from "./rfq-context";
import { EnquiryForm } from "./enquiry-form";

export function RfqBasket() {
  const { lines, update, remove } = useRfq();

  return (
    <section className="container-x grid gap-10 py-14 lg:grid-cols-[1.25fr_1fr] lg:py-20">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Items <span className="text-muted">({lines.length})</span>
          </h2>
          <Link href="/materials" className="text-sm font-semibold text-brand-600 hover:underline">
            + Add more items
          </Link>
        </div>

        {lines.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-line bg-canvas p-10 text-center">
            <ClipboardList className="mx-auto size-10 text-brand-300" aria-hidden />
            <p className="mt-4 font-semibold">Your basket is empty</p>
            <p className="mt-1 text-sm text-muted">Browse the catalogue and tap “Add to RFQ” on the items you need.</p>
            <Link
              href="/materials"
              className="mt-6 inline-flex rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Browse materials
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {lines.map((l) => (
              <li key={l.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-600">{l.category}</p>
                    <p className="mt-0.5 font-semibold">{l.name}</p>
                    <p className="text-sm text-muted">{l.spec}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(l.id)}
                    className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${l.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr]">
                  <label className="grid gap-1 text-xs font-medium text-muted">
                    Quantity
                    <input
                      value={l.qty}
                      onChange={(e) => update(l.id, { qty: e.target.value })}
                      className="field !py-2"
                      placeholder="e.g. 10 nos"
                    />
                  </label>
                  <label className="grid gap-1 text-xs font-medium text-muted">
                    Grade / size / make
                    <input
                      value={l.note}
                      onChange={(e) => update(l.id, { note: e.target.value })}
                      className="field !py-2"
                      placeholder='e.g. SS 316L, 1.5" TC, with MTC'
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="card p-6 shadow-[0_30px_80px_-40px_rgb(15_37_87/0.35)] sm:p-8">
          <h2 className="text-xl font-bold">Your details</h2>
          <p className="mt-1 text-sm text-muted">We typically respond within one working day.</p>
          <div className="mt-6">
            <EnquiryForm kind="rfq" />
          </div>
        </div>
      </div>
    </section>
  );
}
