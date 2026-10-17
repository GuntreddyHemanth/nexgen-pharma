import Link from "next/link";
import { Download } from "lucide-react";
import { AdminHeader, Flash, type SP } from "@/components/admin-ui";
import { q } from "@/lib/db";
import { fmtDate } from "@/lib/format";
import { LEAD_STATUSES, kindLabel, statusStyle, type LeadStatus } from "@/lib/leads";

export const metadata = { title: "Leads" };

type Lead = {
  id: number;
  ref: string;
  kind: string;
  status: LeadStatus;
  name: string;
  company: string;
  phone: string;
  service: string;
  items: unknown[];
  created_at: string;
};

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (LEAD_STATUSES as readonly string[]).includes(sp.status) ? sp.status : "";
  const kind = typeof sp.kind === "string" && sp.kind in kindLabel ? sp.kind : "";
  const search = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";

  const where: string[] = [];
  const params: unknown[] = [];
  if (status) where.push(`status = $${params.push(status)}`);
  if (kind) where.push(`kind = $${params.push(kind)}`);
  if (search) {
    const i = params.push(`%${search}%`);
    where.push(`(company ilike $${i} or name ilike $${i} or email ilike $${i} or phone ilike $${i} or ref ilike $${i})`);
  }
  const leads = await q<Lead>(
    `select id, ref, kind, status, name, company, phone, service, items, created_at from leads
     ${where.length ? `where ${where.join(" and ")}` : ""} order by created_at desc limit 500`,
    params,
  );

  const link = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ ...(status && { status }), ...(kind && { kind }), ...(search && { q: search }), ...patch });
    for (const [k, v] of [...p]) if (!v) p.delete(k);
    return `/admin/leads${p.size ? `?${p}` : ""}`;
  };

  return (
    <>
      <AdminHeader title="Leads" sub="Every enquiry, RFQ and catalogue request from the website.">
        <a
          href={`/admin/leads/export${status || kind ? `?${new URLSearchParams({ ...(status && { status }), ...(kind && { kind }) })}` : ""}`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold ring-1 ring-line hover:bg-white"
        >
          <Download className="size-4" /> Export CSV
        </a>
      </AdminHeader>
      <Flash searchParams={searchParams} />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {["", ...LEAD_STATUSES].map((st) => (
            <Link
              key={st || "all"}
              href={link({ status: st })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize ring-1 ${
                status === st ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:bg-canvas"
              }`}
            >
              {st || "All"}
            </Link>
          ))}
          <span className="mx-1 w-px bg-line" />
          {Object.entries(kindLabel).map(([k, label]) => (
            <Link
              key={k}
              href={link({ kind: kind === k ? "" : k })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ${
                kind === k ? "bg-brand-600 text-white ring-brand-600" : "bg-white ring-line hover:bg-canvas"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          {kind && <input type="hidden" name="kind" value={kind} />}
          <input name="q" defaultValue={search} placeholder="Search company, name, phone, ref…" className="field !py-2 lg:w-72" />
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {leads.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">No leads match.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-canvas text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 font-semibold">Company / contact</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Interest</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-canvas/60">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/leads/${l.id}`} className="block">
                        <span className="block">{fmtDate(l.created_at)}</span>
                        <span className="font-mono text-xs text-muted">{l.ref}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/leads/${l.id}`} className="block">
                        <span className="block font-semibold text-ink">{l.company}</span>
                        <span className="text-xs text-muted">
                          {l.name} · {l.phone}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">{kindLabel[l.kind] ?? l.kind}</td>
                    <td className="px-5 py-3.5 text-muted">
                      {l.kind === "rfq" ? `${(l.items as unknown[]).length} item(s)` : l.service || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${statusStyle[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
