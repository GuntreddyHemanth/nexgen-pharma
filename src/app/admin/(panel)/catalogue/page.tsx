import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminHeader, DeleteForm, Field, Flash, Panel, SubmitBtn, type SP } from "@/components/admin-ui";
import { q } from "@/lib/db";
import { deleteCategory, deleteItem, saveCategory, saveItem } from "@/app/admin/actions";

export const metadata = { title: "Materials catalogue" };

const ICONS = ["cog", "pipe", "layers", "sparkles", "droplet", "zap", "cpu", "box", "wrench", "gauge", "shield"];

type Cat = { slug: string; title: string; icon: string; summary: string; n: number };
type Item = { id: string; name: string; spec: string };

export default async function CataloguePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const cats = await q<Cat>(
    `select c.slug, c.title, c.icon, c.summary, count(i.id)::int as n from categories c left join items i on i.category_slug = c.slug group by c.slug order by c.sort, c.title`,
  );
  const sel = cats.find((c) => c.slug === sp.cat) ?? cats[0];
  const items = sel ? await q<Item>(`select id, name, spec from items where category_slug = $1 order by sort, name`, [sel.slug]) : [];

  return (
    <>
      <AdminHeader title="Materials catalogue" sub="Changes appear on the website's Materials pages within a minute." />
      <Flash searchParams={searchParams} />
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <nav className="overflow-hidden rounded-2xl border border-line bg-white p-2">
            {cats.map((c) => (
              <Link
                key={c.slug}
                href={`/admin/catalogue?cat=${c.slug}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  sel?.slug === c.slug ? "bg-brand-50 font-semibold text-brand-700" : "hover:bg-canvas"
                }`}
              >
                {c.title}
                <span className="text-xs text-muted">{c.n}</span>
              </Link>
            ))}
          </nav>
          <Panel title="New category">
            <form action={saveCategory} className="grid gap-3">
              <input name="title" required placeholder="Category name" className="field" />
              <textarea name="summary" rows={2} placeholder="One-line description" className="field" />
              <input type="hidden" name="icon" value="box" />
              <div>
                <SubmitBtn tone="ghost">Add category</SubmitBtn>
              </div>
            </form>
          </Panel>
        </div>

        {sel && (
          <div className="space-y-6">
            <Panel
              title={`${sel.title} · ${items.length} items`}
              actions={
                <a href={`/materials/${sel.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  View on site <ExternalLink className="size-3.5" />
                </a>
              }
            >
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="flex flex-col gap-2 rounded-xl border border-line p-3 sm:flex-row sm:items-center">
                    <form action={saveItem} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                      <input type="hidden" name="id" value={it.id} />
                      <input type="hidden" name="category" value={sel.slug} />
                      <input name="name" defaultValue={it.name} required aria-label="Item name" className="field !py-2 sm:flex-1" />
                      <input name="spec" defaultValue={it.spec} aria-label="Specification" className="field !py-2 sm:flex-1" />
                      <SubmitBtn tone="ghost">Save</SubmitBtn>
                    </form>
                    <DeleteForm action={deleteItem} fields={{ id: it.id, category: sel.slug }} confirm={`Delete "${it.name}"?`} />
                  </div>
                ))}
              </div>
              <form action={saveItem} className="mt-5 flex flex-col gap-2 rounded-xl bg-canvas p-3 sm:flex-row sm:items-center">
                <input type="hidden" name="category" value={sel.slug} />
                <input name="name" required placeholder="New item name" aria-label="New item name" className="field !py-2 sm:flex-1" />
                <input name="spec" placeholder='Grades / sizes, e.g. SS 316L · ½" to 4"' aria-label="Specification" className="field !py-2 sm:flex-1" />
                <SubmitBtn tone="leaf">Add item</SubmitBtn>
              </form>
            </Panel>

            <Panel title="Category details">
              <form action={saveCategory} className="grid gap-4 sm:grid-cols-2">
                <input type="hidden" name="original" value={sel.slug} />
                <Field label="Title">
                  <input name="title" defaultValue={sel.title} required className="field" />
                </Field>
                <Field label="Icon">
                  <select name="icon" defaultValue={sel.icon} className="field">
                    {ICONS.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Summary">
                    <textarea name="summary" rows={2} defaultValue={sel.summary} className="field" />
                  </Field>
                </div>
                <div className="flex items-center justify-between sm:col-span-2">
                  <SubmitBtn>Save category</SubmitBtn>
                </div>
              </form>
              <div className="mt-4 border-t border-line pt-4">
                <DeleteForm
                  action={deleteCategory}
                  fields={{ slug: sel.slug }}
                  label="Delete category"
                  confirm={`Delete "${sel.title}" and all its items?`}
                />
              </div>
            </Panel>
          </div>
        )}
      </div>
    </>
  );
}
