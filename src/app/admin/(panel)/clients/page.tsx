import Link from "next/link";
import { AdminHeader, Field, Flash, Panel, SubmitBtn, type SP } from "@/components/admin-ui";
import { q } from "@/lib/db";
import { generatePassword } from "@/lib/auth";
import { createClient } from "@/app/admin/actions";

export const metadata = { title: "Clients" };

type Row = { id: number; company: string; contact_name: string; email: string; active: boolean; certs: number; due: number };

export default async function ClientsPage({ searchParams }: { searchParams: SP }) {
  const clients = await q<Row>(
    `select cl.id, cl.company, cl.contact_name, cl.email, cl.active,
       count(c.id)::int as certs,
       count(c.id) filter (where c.due_on <= current_date + 30)::int as due
     from clients cl left join certificates c on c.client_id = cl.id
     group by cl.id order by cl.company`,
  );

  return (
    <>
      <AdminHeader title="Clients & certificates" sub="Give clients a portal login, upload their calibration certificates and track due dates." />
      <Flash searchParams={searchParams} />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          {clients.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted">No clients yet. Create the first portal login on the right.</p>
          ) : (
            <ul className="divide-y divide-line">
              {clients.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/clients/${c.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-canvas/60">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {c.company} {!c.active && <span className="ml-1 text-xs font-medium text-red-600">(disabled)</span>}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {c.contact_name ? `${c.contact_name} · ` : ""}
                        {c.email}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs">
                      <p className="font-semibold">{c.certs} certificate{c.certs === 1 ? "" : "s"}</p>
                      {c.due > 0 && <p className="text-amber-700">{c.due} due / overdue</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Panel title="New client login">
          <form action={createClient} className="grid gap-4">
            <Field label="Company *">
              <input name="company" required className="field" placeholder="e.g. Acme Pharma Ltd, Unit II" />
            </Field>
            <Field label="Contact person">
              <input name="contact_name" className="field" />
            </Field>
            <Field label="Login email *">
              <input name="email" type="email" required className="field" placeholder="qa@client.com" />
            </Field>
            <Field label="Password *" hint="Pre-filled with a strong password. Copy it before saving and share it with the client.">
              <input name="password" required minLength={8} defaultValue={generatePassword()} className="field font-mono" />
            </Field>
            <div>
              <SubmitBtn>Create login</SubmitBtn>
            </div>
          </form>
        </Panel>
      </div>
    </>
  );
}
