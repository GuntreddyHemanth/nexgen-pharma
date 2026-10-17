"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, Building2, Images, Inbox, LayoutDashboard, Newspaper, Wrench } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/clients", label: "Clients & certificates", icon: Building2 },
  { href: "/admin/catalogue", label: "Materials catalogue", icon: Boxes },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/posts", label: "Insights", icon: Newspaper },
  { href: "/admin/media", label: "Gallery & catalogue", icon: Images },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Admin">
      {items.map((it) => {
        const active = it.exact ? path === it.href : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? "bg-brand-50 text-brand-700" : "text-ink/75 hover:bg-canvas hover:text-ink"
            }`}
          >
            <it.icon className="size-4" aria-hidden />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
