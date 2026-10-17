import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminHeader, DeleteForm, Field, Flash, Panel, SubmitBtn, type SP } from "@/components/admin-ui";
import { one } from "@/lib/db";
import { deletePost, savePost } from "@/app/admin/actions";

type Post = { id: number; title: string; slug: string; excerpt: string; body: string; published: boolean };

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SP }) {
  const raw = (await params).id;
  const isNew = raw === "new";
  const p: Post = isNew
    ? { id: 0, title: "", slug: "", excerpt: "", body: "", published: false }
    : ((await one<Post>(`select id, title, slug, excerpt, body, published from posts where id = $1`, [Number(raw) || 0])) ?? notFound());

  return (
    <>
      <Link href="/admin/posts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> All articles
      </Link>
      <AdminHeader title={isNew ? "New article" : p.title}>
        {!isNew && p.published && (
          <a href={`/insights/${p.slug}`} target="_blank" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold ring-1 ring-line hover:bg-white">
            View <ExternalLink className="size-4" />
          </a>
        )}
      </AdminHeader>
      <Flash searchParams={searchParams} />

      <form action={savePost} className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <input type="hidden" name="id" value={p.id || ""} />
        <Panel>
          <div className="grid gap-4">
            <Field label="Title">
              <input name="title" defaultValue={p.title} required className="field text-lg font-semibold" />
            </Field>
            <Field label="Summary" hint="One or two sentences shown on the Insights page and in Google.">
              <textarea name="excerpt" rows={2} defaultValue={p.excerpt} className="field" />
            </Field>
            <Field
              label="Article"
              hint='Formatting: "## Heading", "- bullet point", "**bold**", "[link text](https://…)". Leave a blank line between paragraphs.'
            >
              <textarea name="body" rows={22} defaultValue={p.body} className="field font-mono text-sm leading-relaxed" />
            </Field>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Publish">
            <div className="grid gap-4">
              <Field label="URL" hint="Leave blank to create it from the title.">
                <div className="flex items-center rounded-xl border border-line bg-canvas pl-3 text-sm text-muted">
                  /insights/
                  <input name="slug" defaultValue={p.slug} className="w-full rounded-r-xl border-0 bg-white px-2 py-2.5 text-ink outline-none" />
                </div>
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={p.published} className="size-4 accent-brand-600" />
                Published on the website
              </label>
              <div>
                <SubmitBtn>Save article</SubmitBtn>
              </div>
            </div>
          </Panel>
          {!isNew && <DeleteForm action={deletePost} fields={{ id: p.id }} label="Delete article" confirm="Delete this article?" />}
        </div>
      </form>
    </>
  );
}
