import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type Item = { name: string; category: string; spec: string; qty: string; note: string };
type Payload = {
  kind: "enquiry" | "rfq";
  name: string;
  company: string;
  email: string;
  phone: string;
  location?: string;
  service?: string;
  message?: string;
  items?: Item[];
  website?: string; // honeypot
};

// Best-effort per-instance rate limit: 5 submissions / 10 min / IP.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });

  let body: Partial<Payload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill hidden fields; pretend success.
  if (str(body.website)) return NextResponse.json({ ok: true, delivered: true });

  const data = {
    kind: body.kind === "rfq" ? "rfq" : "enquiry",
    name: str(body.name, 100),
    company: str(body.company, 150),
    email: str(body.email, 150),
    phone: str(body.phone, 30),
    location: str(body.location, 150),
    service: str(body.service, 100),
    message: str(body.message, 4000),
    items: Array.isArray(body.items)
      ? body.items.slice(0, 100).map((i) => ({
          name: str(i?.name, 200),
          category: str(i?.category, 100),
          spec: str(i?.spec, 200),
          qty: str(i?.qty, 30),
          note: str(i?.note, 300),
        }))
      : [],
  };

  const errors: string[] = [];
  if (data.name.length < 2) errors.push("name");
  if (data.company.length < 2) errors.push("company");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("email");
  if (data.phone.replace(/\D/g, "").length < 10) errors.push("phone");
  if (data.kind === "rfq" && data.items.length === 0) errors.push("items");
  if (errors.length) return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields: errors }, { status: 422 });

  const ref = `NX-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const subject =
    data.kind === "rfq"
      ? `RFQ ${ref}: ${data.items.length} item(s) from ${data.company}`
      : `Enquiry ${ref}: ${data.service || "General"} from ${data.company}`;

  const rows = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Location", data.location],
    ["Service", data.service],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#55607a">${k}</td><td style="padding:6px 12px"><b>${esc(v)}</b></td></tr>`)
    .join("");

  const itemsTable = data.items.length
    ? `<h3 style="margin:24px 0 8px">Items</h3><table style="border-collapse:collapse;width:100%;font-size:14px"><tr style="background:#f6f9fd"><th align="left" style="padding:8px">Item</th><th align="left" style="padding:8px">Spec</th><th align="left" style="padding:8px">Qty</th><th align="left" style="padding:8px">Notes</th></tr>${data.items
        .map(
          (i) =>
            `<tr style="border-top:1px solid #e3e9f3"><td style="padding:8px">${esc(i.name)}<br><small style="color:#55607a">${esc(i.category)}</small></td><td style="padding:8px">${esc(i.spec)}</td><td style="padding:8px">${esc(i.qty)}</td><td style="padding:8px">${esc(i.note)}</td></tr>`,
        )
        .join("")}</table>`
    : "";

  const html = `<div style="font-family:Arial,sans-serif;color:#0b1630;max-width:680px">
    <h2 style="color:#1a3f9c;margin:0 0 4px">${esc(subject)}</h2>
    <p style="color:#55607a;margin:0 0 16px">Submitted via ${esc(site.url)}</p>
    <table style="border-collapse:collapse">${rows}</table>
    ${data.message ? `<h3 style="margin:24px 0 8px">Message</h3><p style="white-space:pre-wrap">${esc(data.message)}</p>` : ""}
    ${itemsTable}
  </div>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[enquiry] RESEND_API_KEY not set; logging submission", ref, JSON.stringify(data));
    return NextResponse.json({ ok: true, delivered: false, ref });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM ?? "Nexgen Website <onboarding@resend.dev>",
        to: (process.env.ENQUIRY_TO ?? site.email).split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[enquiry] Resend error", res.status, await res.text());
      return NextResponse.json({ ok: true, delivered: false, ref });
    }
  } catch (e) {
    console.error("[enquiry] send failed", e);
    return NextResponse.json({ ok: true, delivered: false, ref });
  }

  return NextResponse.json({ ok: true, delivered: true, ref });
}
