import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { AdminHeader, DeleteForm, Field, Flash, Panel, SubmitBtn, type SP } from "@/components/admin-ui";
import { one } from "@/lib/db";
import { fmtDate } from "@/lib/format";
import { LEAD_STATUSES, kindLabel, statusStyle, type LeadStatus } from "@/lib/leads";
import { deleteLead, updateLead } from "../../../actions";

type Lead = {
  id: number;
  ref: string;
  kind: string;
  status: LeadStatus;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  message: string;
  items: { name: string; category: string; spec: string; qty: string; note: string }[];
  notes: string;
  created_at: string;
};

export default async function LeadPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SP }) {
  const id = Number((await params).id);
  const l = Number.isInteger(id) ? await one<Lead>(`select * from leads where id = $1`, [id]) : undefined;
  if (!l) notFound();
  const wa = `https://wa.me/${l.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}?text=${encodeURIComponent(
    `Hello ${l.name}, this is Nexgen Pharma regarding your ${kindLabel[l.kind]?.toLowerCase() ?? "enquiry"} ${l.ref}.`,
  )}`;

  return (
    <>
      <Link href="/admin/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> All leads
      </Link>
      <AdminHeader
        title={l.company}
        sub={
          <>
            <span className="font-mono">{l.ref}</span> · {kindLabel[l.kind] ?? l.kind} · received {fmtDate(l.created_at)}
          </>
        }
      >
        <span className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ring-1 ${statusStyle[l.status]}`}>{l.status}</span>
      </AdminHeader>
      <Flash searchParams={searchParams} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="Contact">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Name", l.name],
                ["Company", l.company],
                ["Email", l.email],
                ["Phone", l.phone],
                ["Location", l.location],
                ["Interested in", l.service],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs uppercase tracking-wider text-muted">{k}</dt>
                    <dd className="mt-0.5 font-medium">{v}</dd>
                  </div>
                ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                <Phone className="size-4" /> Call
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              <a
                href={`mailto:${l.email}?subject=${encodeURIComponent(`Re: your request ${l.ref}`)}`}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-line"
              >
                <Mail className="size-4" /> Email
              </a>
            </div>
          </Panel>

          {l.message && (
            <Panel title="Message">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{l.message}</p>
            </Panel>
          )}

          {l.items.length > 0 && (
            <Panel title={`Requested items (${l.items.length})`}>
              <div className="-mx-5 -my-5 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-canvas text-left text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-2.5">Item</th>
                      <th className="px-5 py-2.5">Spec</th>
                      <th className="px-5 py-2.5">Qty</th>
                      <th className="px-5 py-2.5">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {l.items.map((it, i) => (
                      <tr key={i}>
                        <td className="px-5 py-3">
                          <span className="font-semibold">{it.name}</span>
                          <span className="block text-xs text-muted">{it.category}</span>
                        </td>
                        <td className="px-5 py-3 text-muted">{it.spec}</td>
                        <td className="px-5 py-3">{it.qty}</td>
                        <td className="px-5 py-3 text-muted">{it.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="Pipeline">
            <form action={updateLead} className="grid gap-4">
              <input type="hidden" name="id" value={l.id} />
              <Field label="Status">
                <select name="status" defaultValue={l.status} className="field capitalize">
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Internal notes" hint="Only visible to your team.">
                <textarea name="notes" rows={6} defaultValue={l.notes} className="field" placeholder="Quote sent on…, follow up on…" />
              </Field>
              <div>
                <SubmitBtn>Save</SubmitBtn>
              </div>
            </form>
          </Panel>
          <DeleteForm action={deleteLead} fields={{ id: l.id }} label="Delete lead" confirm="Delete this lead permanently?" />
        </div>
      </div>
    </>
  );
}
