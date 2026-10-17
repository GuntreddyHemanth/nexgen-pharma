import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader, Flash, type SP } from "@/components/admin-ui";
import { q } from "@/lib/db";
import { fmtDate } from "@/lib/format";

export const metadata = { title: "Insights" };

type Row = { id: number; title: string; slug: string; published: boolean; published_at: string | null; updated_at: string };

export default async function PostsAdmin({ searchParams }: { searchParams: SP }) {
  const posts = await q<Row>(`select id, title, slug, published, published_at, updated_at from posts order by coalesce(published_at, updated_at) desc`);
  return (
    <>
      <AdminHeader title="Insights" sub="Articles help customers find Nexgen on Google.">
        <Link href="/admin/posts/new" className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          <Plus className="size-4" /> New article
        </Link>
      </AdminHeader>
      <Flash searchParams={searchParams} />
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {posts.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">No articles yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-canvas/60">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.title}</p>
                    <p className="truncate text-xs text-muted">/insights/{p.slug}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                      p.published ? "bg-leaf-50 text-leaf-700 ring-leaf-200" : "bg-canvas text-muted ring-line"
                    }`}
                  >
                    {p.published ? `Published ${fmtDate(p.published_at)}` : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
