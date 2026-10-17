import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { q } from "@/lib/db";
import { adminInbox, emailShell, esc, sendEmail } from "@/lib/email";
import { getSetting } from "@/lib/db";
import { signedLink } from "@/lib/auth";

export const runtime = "nodejs";

type Item = { name: string; category: string; spec: string; qty: string; note: string };

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

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill hidden fields; pretend success.
  if (str(body.website)) return NextResponse.json({ ok: true, delivered: true });

  const kind = body.kind === "rfq" ? "rfq" : body.kind === "catalogue" ? "catalogue" : "enquiry";
  const data = {
    kind,
    name: str(body.name, 100),
    company: str(body.company, 150),
    email: str(body.email, 150),
    phone: str(body.phone, 30),
    location: str(body.location, 150),
    service: kind === "catalogue" ? "Catalogue download" : str(body.service, 100),
    message: str(body.message, 4000),
    items: (Array.isArray(body.items) ? body.items : []).slice(0, 100).map((i: Partial<Item>) => ({
      name: str(i?.name, 200),
      category: str(i?.category, 100),
      spec: str(i?.spec, 200),
      qty: str(i?.qty, 30),
      note: str(i?.note, 300),
    })),
  };

  const errors: string[] = [];
  if (data.name.length < 2) errors.push("name");
  if (data.company.length < 2) errors.push("company");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("email");
  if (data.phone.replace(/\D/g, "").length < 10) errors.push("phone");
  if (kind === "rfq" && data.items.length === 0) errors.push("items");
  if (errors.length)
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fields: errors }, { status: 422 });

  const ref = `NX-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  let stored = false;
  try {
    await q(
      `insert into leads (ref, kind, name, company, email, phone, location, service, message, items)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [ref, kind, data.name, data.company, data.email, data.phone, data.location, data.service, data.message, JSON.stringify(data.items)],
    );
    stored = true;
  } catch (e) {
    console.error("[enquiry] could not store lead", ref, (e as Error).message, JSON.stringify(data));
  }

  let download: string | undefined;
  if (kind === "catalogue") {
    try {
      if (await getSetting("catalogue_file_id")) download = `/api/catalogue?t=${encodeURIComponent(signedLink("catalogue", 3600))}`;
    } catch {}
  }

  const label = kind === "rfq" ? "RFQ" : kind === "catalogue" ? "Catalogue request" : "Enquiry";
  const subject =
    kind === "rfq"
      ? `RFQ ${ref}: ${data.items.length} item(s) from ${data.company}`
      : `${label} ${ref}: ${data.service || "General"} from ${data.company}`;

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

  const html = emailShell(
    subject,
    `<p style="color:#55607a;margin:0 0 16px">Submitted via ${esc(site.url)}${stored ? ` · <a href="${esc(site.url)}/admin/leads">open in admin</a>` : ""}</p>
     <table style="border-collapse:collapse">${rows}</table>
     ${data.message ? `<h3 style="margin:24px 0 8px">Message</h3><p style="white-space:pre-wrap">${esc(data.message)}</p>` : ""}
     ${itemsTable}`,
  );

  const delivered = await sendEmail({ to: adminInbox(), subject, html, replyTo: data.email });

  return NextResponse.json({ ok: true, delivered: delivered || stored, ref, download });
}
