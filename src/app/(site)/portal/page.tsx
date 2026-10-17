import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Clock, Download, FileText, LogOut } from "lucide-react";
import { requireClient } from "@/lib/auth";
import { q } from "@/lib/db";
import { dueStatus, fmtDate } from "@/lib/format";
import { site } from "@/lib/site";
import { clientLogout } from "./actions";

export const metadata: Metadata = { title: "Client Portal", robots: { index: false } };
export const dynamic = "force-dynamic";

type Cert = {
  id: number;
  instrument: string;
  tag: string;
  cert_no: string;
  calibrated_on: string | null;
  due_on: string | null;
  file_id: number | null;
};

const toneCls = {
  good: "bg-leaf-50 text-leaf-700 ring-leaf-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-700 ring-red-200",
  muted: "bg-canvas text-muted ring-line",
};

export default async function PortalPage() {
  const client = await requireClient();
  const certs = await q<Cert>(
    `select id, instrument, tag, cert_no, calibrated_on, due_on, file_id from certificates where client_id = $1 order by due_on asc nulls last, id desc`,
    [client.id],
  );
  const withStatus = certs.map((c) => ({ ...c, st: dueStatus(c.due_on) }));
  const counts = {
    total: certs.length,
    overdue: withStatus.filter((c) => c.st.tone === "critical").length,
    soon: withStatus.filter((c) => c.st.tone === "warning").length,
    valid: withStatus.filter((c) => c.st.tone === "good").length,
  };

  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 pb-12 pt-32 text-white sm:pt-40">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
        <div className="container-x relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow !text-leaf-300">Client portal</p>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{client.company}</h1>
            <p className="mt-2 text-brand-100/75">
              Signed in as {client.contact_name ? `${client.contact_name} · ` : ""}
              {client.email}
            </p>
          </div>
          <form action={clientLogout}>
            <button className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-white/25 hover:bg-white/10">
              <LogOut className="size-4" aria-hidden /> Sign out
            </button>
          </form>
        </div>
      </section>

      <section className="container-x -mt-px py-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Instruments", counts.total, FileText, "text-brand-600"],
            ["Valid", counts.valid, CheckCircle2, "text-leaf-600"],
            ["Due in 30 days", counts.soon, Clock, "text-amber-600"],
            ["Overdue", counts.overdue, AlertTriangle, "text-red-600"],
          ].map(([label, n, I, cls]) => {
            const Ico = I as typeof Clock;
            return (
              <div key={label as string} className="card p-5">
                <Ico className={`size-5 ${cls}`} aria-hidden />
                <p className="mt-3 font-display text-3xl font-extrabold">{n as number}</p>
                <p className="text-sm text-muted">{label as string}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-bold">Calibration certificates</h2>
            <p className="text-xs text-muted">Reminders are emailed 30 and 7 days before due date</p>
          </div>
          {certs.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted">
              No certificates yet. They appear here as soon as the Nexgen team uploads them.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-canvas text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Instrument</th>
                    <th className="px-5 py-3 font-semibold">Certificate no.</th>
                    <th className="px-5 py-3 font-semibold">Calibrated</th>
                    <th className="px-5 py-3 font-semibold">Due</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {withStatus.map((c) => (
                    <tr key={c.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-ink">{c.instrument}</p>
                        {c.tag && <p className="text-xs text-muted">Tag: {c.tag}</p>}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs">{c.cert_no || "—"}</td>
                      <td className="px-5 py-4">{fmtDate(c.calibrated_on) || "—"}</td>
                      <td className="px-5 py-4">{fmtDate(c.due_on) || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneCls[c.st.tone]}`}>
                          {c.st.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {c.file_id ? (
                          <a
                            href={`/portal/certificate/${c.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                          >
                            <Download className="size-3.5" aria-hidden /> PDF
                          </a>
                        ) : (
                          <span className="text-xs text-muted">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="mt-6 text-sm text-muted">
          Need to schedule calibration? Call {site.phones[0].display} or email {site.email}.
        </p>
      </section>
    </>
  );
}
