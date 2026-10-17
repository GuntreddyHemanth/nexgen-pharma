import Link from "next/link";
import { ArrowRight, Building2, Clock, Inbox, Trophy } from "lucide-react";
import { AdminHeader, Panel } from "@/components/admin-ui";
import { q, safe } from "@/lib/db";
import { dueStatus, fmtDate } from "@/lib/format";
import { kindLabel, statusStyle, type LeadStatus } from "@/lib/leads";

type Lead = { id: number; ref: string; kind: string; status: LeadStatus; name: string; company: string; created_at: string };
type DueCert = { id: number; instrument: string; due_on: string; client_id: number; company: string };

export default async function Dashboard() {
  const [stats, recent, due, clients] = await Promise.all([
    safe(
      () =>
        q<{ status: string; n: number }>(`select status, count(*)::int as n from leads group by status`),
      [],
    ),
    safe(
      () =>
        q<Lead>(`select id, ref, kind, status, name, company, created_at from leads order by created_at desc limit 8`),
      [],
    ),
    safe(
      () =>
        q<DueCert>(
          `select c.id, c.instrument, c.due_on, c.client_id, cl.company from certificates c join clients cl on cl.id = c.client_id
           where c.due_on is not null and c.due_on <= current_date + 30 order by c.due_on limit 10`,
        ),
      [],
    ),
    safe(() => q<{ n: number }>(`select count(*)::int as n from clients where active`), []),
  ]);
  const count = (s: string) => stats.find((x) => x.status === s)?.n ?? 0;
  const total = stats.reduce((a, b) => a + b.n, 0);

  const tiles = [
    { label: "New leads", value: count("new"), icon: Inbox, href: "/admin/leads?status=new", tone: "text-brand-600" },
    { label: "Quoted", value: count("quoted"), icon: Clock, href: "/admin/leads?status=quoted", tone: "text-amber-600" },
    { label: "Won", value: count("won"), icon: Trophy, href: "/admin/leads?status=won", tone: "text-leaf-600" },
    { label: "Portal clients", value: clients[0]?.n ?? 0, icon: Building2, href: "/admin/clients", tone: "text-brand-600" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" sub={`${total} lead${total === 1 ? "" : "s"} captured from the website so far`} />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="rounded-2xl border border-line bg-white p-5 transition hover:border-brand-200">
            <t.icon className={`size-5 ${t.tone}`} aria-hidden />
            <p className="mt-3 font-display text-3xl font-extrabold">{t.value}</p>
            <p className="text-sm text-muted">{t.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Latest leads"
          actions={
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
              All leads <ArrowRight className="size-4" />
            </Link>
          }
        >
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No leads yet. Website enquiries, RFQs and catalogue requests appear here.</p>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {recent.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads/${l.id}`} className="flex items-center justify-between gap-4 py-3 hover:opacity-80">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{l.company}</p>
                      <p className="truncate text-xs text-muted">
                        {l.name} · {kindLabel[l.kind] ?? l.kind} · {fmtDate(l.created_at)}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${statusStyle[l.status]}`}>
                      {l.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Calibrations due in 30 days">
          {due.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Nothing due in the next 30 days.</p>
          ) : (
            <ul className="-my-2 divide-y divide-line">
              {due.map((c) => {
                const st = dueStatus(c.due_on);
                return (
                  <li key={c.id}>
                    <Link href={`/admin/clients/${c.client_id}`} className="flex items-center justify-between gap-4 py-3 hover:opacity-80">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{c.instrument}</p>
                        <p className="truncate text-xs text-muted">{c.company}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-semibold ${st.tone === "critical" ? "text-red-600" : "text-amber-700"}`}>
                        {st.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
