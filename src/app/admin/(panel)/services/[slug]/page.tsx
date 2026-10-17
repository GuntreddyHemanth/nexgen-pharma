import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminHeader, Field, Flash, Panel, SubmitBtn, type SP } from "@/components/admin-ui";
import { one } from "@/lib/db";
import type { Service } from "@/lib/services";
import { saveService } from "@/app/admin/actions";

export default async function EditService({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  const { slug } = await params;
  const row = await one<{ data: Service }>(`select data from services where slug = $1`, [slug]);
  if (!row) notFound();
  const s = row.data;

  return (
    <>
      <Link href="/admin/services" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> All services
      </Link>
      <AdminHeader title={s.title} sub={s.pillar}>
        <a href={`/services/${s.slug}`} target="_blank" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold ring-1 ring-line hover:bg-white">
          View page <ExternalLink className="size-4" />
        </a>
      </AdminHeader>
      <Flash searchParams={searchParams} />

      <form action={saveService} className="space-y-6">
        <input type="hidden" name="slug" value={s.slug} />
        <Panel title="Basics">
          <div className="grid gap-4">
            <Field label="Title">
              <input name="title" defaultValue={s.title} required className="field" />
            </Field>
            <Field label="Summary" hint="Shown on service cards and in Google results.">
              <textarea name="summary" rows={2} defaultValue={s.summary} className="field" />
            </Field>
            <Field label="Intro" hint="The paragraph at the top of the service page.">
              <textarea name="intro" rows={4} defaultValue={s.intro} className="field" />
            </Field>
          </div>
        </Panel>

        <Panel title="Scope of service">
          <Field label="Offerings" hint="One per line, as: Title | description">
            <textarea
              name="offerings"
              rows={7}
              defaultValue={s.offerings.map((o) => `${o.title} | ${o.body}`).join("\n")}
              className="field font-mono text-xs"
            />
          </Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_2fr]">
            <Field label="List heading" hint="e.g. Parameters we calibrate">
              <input name="scopeLabel" defaultValue={s.scope?.label ?? ""} className="field" />
            </Field>
            <Field label="List items" hint="One per line. Leave empty to hide this list.">
              <textarea name="scopeItems" rows={6} defaultValue={s.scope?.items.join("\n") ?? ""} className="field" />
            </Field>
          </div>
        </Panel>

        <Panel title="Deliverables & FAQs">
          <div className="grid gap-4">
            <Field label="What the client receives" hint="One per line.">
              <textarea name="deliverables" rows={4} defaultValue={s.deliverables.join("\n")} className="field" />
            </Field>
            <Field label="FAQs" hint="One per line, as: Question | Answer">
              <textarea name="faqs" rows={6} defaultValue={s.faqs.map((f) => `${f.q} | ${f.a}`).join("\n")} className="field font-mono text-xs" />
            </Field>
          </div>
        </Panel>

        <div className="sticky bottom-4 flex justify-end">
          <div className="rounded-full bg-white p-1 shadow-lg">
            <SubmitBtn>Save service</SubmitBtn>
          </div>
        </div>
      </form>
    </>
  );
}
