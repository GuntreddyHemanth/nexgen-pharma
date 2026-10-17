"use client";

import { useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";

type State =
  | { s: "idle" }
  | { s: "sending" }
  | { s: "error"; msg: string; fields?: string[] }
  | { s: "done"; download?: string };

export function CatalogueForm({ instant }: { instant: boolean }) {
  const [state, setState] = useState<State>({ s: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState({ s: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "catalogue", ...Object.fromEntries(fd) }),
      });
      const json = await res.json();
      if (!json.ok) return setState({ s: "error", msg: json.error ?? "Something went wrong.", fields: json.fields });
      setState({ s: "done", download: json.download });
      if (json.download) window.location.href = json.download;
    } catch {
      setState({ s: "error", msg: "Network error. Please try again." });
    }
  }

  if (state.s === "done")
    return (
      <div className="py-6 text-center">
        <CheckCircle2 className="mx-auto size-12 text-leaf-500" aria-hidden />
        <p className="mt-4 text-lg font-bold">Thank you!</p>
        {state.download ? (
          <>
            <p className="mt-1 text-sm text-muted">Your download should start automatically.</p>
            <a
              href={state.download}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Download className="size-4" aria-hidden /> Download catalogue
            </a>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted">We&apos;ll send the catalogue to your email or WhatsApp shortly.</p>
        )}
      </div>
    );

  const bad = (f: string) => state.s === "error" && state.fields?.includes(f);
  const cls = (f: string) => `field ${bad(f) ? "!border-red-400" : ""}`;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      <input name="name" placeholder="Full name *" aria-label="Full name" autoComplete="name" className={cls("name")} />
      <input name="company" placeholder="Company *" aria-label="Company" autoComplete="organization" className={cls("company")} />
      <input name="email" type="email" placeholder="Work email *" aria-label="Work email" autoComplete="email" className={cls("email")} />
      <input name="phone" type="tel" placeholder="Phone / WhatsApp *" aria-label="Phone" autoComplete="tel" className={cls("phone")} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state.s === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {state.msg}
        </p>
      )}
      <button
        type="submit"
        disabled={state.s === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-leaf-600 disabled:opacity-60 sm:col-span-2"
      >
        {state.s === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        {instant ? "Download catalogue (PDF)" : "Request the catalogue"}
      </button>
    </form>
  );
}
