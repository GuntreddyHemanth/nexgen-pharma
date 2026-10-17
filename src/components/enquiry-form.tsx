"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { services } from "@/lib/services";
import { whatsappLink } from "@/lib/site";
import { useRfq } from "./rfq-context";

const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: "materials", label: "Material supply" },
  { value: "catalogue", label: "Request material catalogue" },
  { value: "other", label: "Something else" },
];

type Status = { state: "idle" } | { state: "sending" } | { state: "error"; msg: string; fields?: string[] } | { state: "done"; ref?: string; delivered: boolean; wa: string };

export function EnquiryForm({ kind = "enquiry", defaultService = "" }: { kind?: "enquiry" | "rfq"; defaultService?: string }) {
  const { lines, clear } = useRfq();
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      kind,
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      location: fd.get("location"),
      service: kind === "rfq" ? "Material RFQ" : serviceOptions.find((o) => o.value === fd.get("service"))?.label ?? "",
      message: fd.get("message"),
      website: fd.get("website"),
      items: kind === "rfq" ? lines : undefined,
    };
    if (kind === "rfq" && lines.length === 0) {
      setStatus({ state: "error", msg: "Your basket is empty. Add items from the catalogue first." });
      return;
    }
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) {
        setStatus({ state: "error", msg: json.error ?? "Something went wrong.", fields: json.fields });
        return;
      }
      const summary =
        kind === "rfq"
          ? `Hello Nexgen Pharma, RFQ ${json.ref ?? ""} from ${payload.name} (${payload.company}):\n` +
            lines.map((l, i) => `${i + 1}. ${l.name} (${l.spec}) × ${l.qty}${l.note ? ` [${l.note}]` : ""}`).join("\n")
          : `Hello Nexgen Pharma, enquiry ${json.ref ?? ""} from ${payload.name} (${payload.company}) regarding ${payload.service || "your services"}.`;
      setStatus({ state: "done", ref: json.ref, delivered: json.delivered, wa: whatsappLink(summary) });
      if (kind === "rfq") clear();
    } catch {
      setStatus({ state: "error", msg: "Network error. Please try again or contact us on WhatsApp." });
    }
  }

  if (status.state === "done")
    return (
      <div className="rounded-3xl border border-leaf-200 bg-leaf-50/60 p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto size-14 text-leaf-500" aria-hidden />
        <h3 className="mt-5 text-2xl font-bold">Thank you, we&apos;ve got it.</h3>
        {status.ref && (
          <p className="mt-2 text-sm text-muted">
            Reference <span className="font-mono font-semibold text-ink">{status.ref}</span>
          </p>
        )}
        <p className="mx-auto mt-4 max-w-md text-muted">
          {status.delivered
            ? "Our team will get back to you within one working day."
            : "For the fastest response, send a copy of your request on WhatsApp as well."}
        </p>
        <a
          href={status.wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-95"
        >
          <MessageCircle className="size-4" aria-hidden /> Send on WhatsApp
        </a>
      </div>
    );

  const bad = (f: string) => status.state === "error" && status.fields?.includes(f);
  const fieldCls = (f: string) => `field ${bad(f) ? "!border-red-400 !ring-4 !ring-red-500/10" : ""}`;

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Full name *
          <input name="name" required autoComplete="name" className={fieldCls("name")} placeholder="Your name" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Company *
          <input name="company" required autoComplete="organization" className={fieldCls("company")} placeholder="Company / plant name" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Work email *
          <input name="email" type="email" required autoComplete="email" className={fieldCls("email")} placeholder="you@company.com" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Phone / WhatsApp *
          <input name="phone" type="tel" required autoComplete="tel" className={fieldCls("phone")} placeholder="+91" />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Plant location
          <input name="location" className="field" placeholder="e.g. Genome Valley, Hyderabad" />
        </label>
        {kind === "enquiry" && (
          <label className="grid gap-1.5 text-sm font-medium">
            I&apos;m interested in
            <select name="service" defaultValue={defaultService} className="field">
              <option value="">Select a service</option>
              {serviceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <label className="grid gap-1.5 text-sm font-medium">
        {kind === "rfq" ? "Additional notes (delivery location, timelines, makes)" : "Requirement"}
        <textarea
          name="message"
          rows={kind === "rfq" ? 3 : 5}
          className="field resize-y"
          placeholder={
            kind === "rfq"
              ? "Any preferred makes, delivery timeline, test certificates required…"
              : "e.g. Calibration of 120 instruments (pressure, temperature) before our audit in March."
          }
        />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status.state === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.msg}
        </p>
      )}

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">We use your details only to respond to this request.</p>
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
        >
          {status.state === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {kind === "rfq" ? `Send RFQ (${lines.length} item${lines.length === 1 ? "" : "s"})` : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
