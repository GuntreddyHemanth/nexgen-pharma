import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AdminHeader } from "@/components/admin-ui";
import { Icon } from "@/components/icon";
import { q } from "@/lib/db";
import type { Service } from "@/lib/services";

export const metadata = { title: "Services" };

export default async function ServicesAdmin() {
  const rows = await q<{ data: Service }>(`select data from services order by sort, slug`);
  return (
    <>
      <AdminHeader title="Services" sub="Edit the wording on each service page: intro, scope, deliverables and FAQs." />
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(({ data: s }) => (
          <Link
            key={s.slug}
            href={`/admin/services/${s.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:border-brand-200"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={s.icon} className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{s.title}</span>
              <span className="block truncate text-sm text-muted">{s.summary}</span>
            </span>
            <ArrowRight className="size-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
          </Link>
        ))}
      </div>
    </>
  );
}
