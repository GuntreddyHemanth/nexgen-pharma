import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { AdminHeader, DeleteForm, Field, Flash, Panel, SubmitBtn, type SP } from "@/components/admin-ui";
import { one, q } from "@/lib/db";
import { dueStatus, fmtDate } from "@/lib/format";
import { site } from "@/lib/site";
import { addCertificate, deleteCertificate, deleteClient, updateClient } from "@/app/admin/actions";

type Client = { id: number; company: string; contact_name: string; email: string; active: boolean };
type Cert = {
  id: number;
  instrument: string;
  tag: string;
  cert_no: string;
  calibrated_on: string | null;
  due_on: string | null;
  file_id: number | null;
};

const tone = { good: "text-leaf-700", warning: "text-amber-700", critical: "text-red-600", muted: "text-muted" };

export default async function ClientPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SP }) {
  const id = Number((await params).id);
  const c = Number.isInteger(id) ? await one<Client>(`select id, company, contact_name, email, active from clients where id = $1`, [id]) : undefined;
  if (!c) notFound();
  const certs = await q<Cert>(
    `select id, instrument, tag, cert_no, calibrated_on, due_on, file_id from certificates where client_id = $1 order by due_on asc nulls last, id desc`,
    [id],
  );

  return (
    <>
      <Link href="/admin/clients" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> All clients
      </Link>
      <AdminHeader
        title={c.company}
        sub={
          <>
            Portal login: <b>{c.email}</b> at {site.url.replace(/^https?:\/\//, "")}/portal
          </>
        }
      />
      <Flash searchParams={searchParams} />

      <div className="grid gap-6 2xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Panel title={`Certificates (${certs.length})`}>
            {certs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">No certificates yet. Add the first one below.</p>
            ) : (
              <div className="-mx-5 -my-5 overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-canvas text-left text-xs uppercase tracking-wider text-muted">
                    <tr>
                      <th className="px-5 py-2.5">Instrument</th>
                      <th className="px-5 py-2.5">Cert no.</th>
                      <th className="px-5 py-2.5">Calibrated</th>
                      <th className="px-5 py-2.5">Due</th>
                      <th className="px-5 py-2.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {certs.map((ct) => {
                      const st = dueStatus(ct.due_on);
                      return (
                        <tr key={ct.id}>
                          <td className="px-5 py-3">
                            <span className="font-semibold">{ct.instrument}</span>
                            {ct.tag && <span className="block text-xs text-muted">Tag: {ct.tag}</span>}
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 font-mono text-xs">{ct.cert_no || "—"}</td>
                          <td className="whitespace-nowrap px-5 py-3">{fmtDate(ct.calibrated_on) || "—"}</td>
                          <td className="whitespace-nowrap px-5 py-3">
                            {fmtDate(ct.due_on) || "—"}
                            <span className={`block text-xs font-semibold ${tone[st.tone]}`}>{st.label}</span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-2">
                              {ct.file_id && (
                                <a href={`/portal/certificate/${ct.id}`} target="_blank" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                                  <FileText className="size-4" /> View
                                </a>
                              )}
                              <DeleteForm action={deleteCertificate} fields={{ id: ct.id }} confirm="Delete this certificate and its file?" />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel title="Add certificate">
            <form action={addCertificate} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="client_id" value={c.id} />
              <Field label="Instrument *">
                <input name="instrument" required className="field" placeholder="e.g. Pressure gauge 0–10 bar" />
              </Field>
              <Field label="Tag / ID no.">
                <input name="tag" className="field" placeholder="e.g. PG-104" />
              </Field>
              <Field label="Certificate no.">
                <input name="cert_no" className="field" />
              </Field>
              <Field label="Certificate file" hint="PDF or image, up to 4 MB">
                <input name="file" type="file" accept="application/pdf,image/*" className="field !py-2 text-sm" />
              </Field>
              <Field label="Calibrated on">
                <input name="calibrated_on" type="date" className="field" />
              </Field>
              <Field label="Due on" hint="Reminders go out 30 and 7 days before.">
                <input name="due_on" type="date" className="field" />
              </Field>
              <div className="sm:col-span-2">
                <SubmitBtn tone="leaf">Add certificate</SubmitBtn>
              </div>
            </form>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Client details">
            <form action={updateClient} className="grid gap-4">
              <input type="hidden" name="id" value={c.id} />
              <Field label="Company">
                <input name="company" defaultValue={c.company} required className="field" />
              </Field>
              <Field label="Contact person">
                <input name="contact_name" defaultValue={c.contact_name} className="field" />
              </Field>
              <Field label="Reset password" hint="Leave blank to keep the current password.">
                <input name="password" minLength={8} className="field font-mono" autoComplete="new-password" />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked={c.active} className="size-4 accent-brand-600" />
                Portal access enabled
              </label>
              <div>
                <SubmitBtn>Save</SubmitBtn>
              </div>
            </form>
          </Panel>
          <DeleteForm
            action={deleteClient}
            fields={{ id: c.id }}
            label="Delete client"
            confirm="Delete this client, their login and ALL their certificates?"
          />
        </div>
      </div>
    </>
  );
}
