import { isAdmin } from "@/lib/auth";
import { q } from "@/lib/db";
import { LEAD_STATUSES, kindLabel } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Prefix cells that spreadsheet apps would treat as formulas.
const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });
  const sp = new URL(req.url).searchParams;
  const where: string[] = [];
  const params: unknown[] = [];
  const status = sp.get("status");
  const kind = sp.get("kind");
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) where.push(`status = $${params.push(status)}`);
  if (kind && kind in kindLabel) where.push(`kind = $${params.push(kind)}`);

  const rows = await q<Record<string, unknown>>(
    `select ref, created_at, kind, status, company, name, email, phone, location, service, message, items, notes from leads
     ${where.length ? `where ${where.join(" and ")}` : ""} order by created_at desc`,
    params,
  );
  const header = ["Ref", "Received", "Type", "Status", "Company", "Name", "Email", "Phone", "Location", "Service", "Message", "Items", "Notes"];
  const lines = rows.map((r) => {
    const items = (r.items as { name: string; spec: string; qty: string; note: string }[])
      .map((i) => `${i.name} (${i.spec}) x ${i.qty}${i.note ? ` [${i.note}]` : ""}`)
      .join("; ");
    return [
      r.ref,
      new Date(r.created_at as string).toISOString().slice(0, 16).replace("T", " "),
      kindLabel[r.kind as string] ?? r.kind,
      r.status,
      r.company,
      r.name,
      r.email,
      r.phone,
      r.location,
      r.service,
      r.message,
      items,
      r.notes,
    ]
      .map(cell)
      .join(",");
  });
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nexgen-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
