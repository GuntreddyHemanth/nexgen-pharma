import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ExternalLink, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { dbIsLocal, dbMissing } from "@/lib/db";
import { AdminNav } from "@/components/admin-nav";
import { adminLogout } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-5 py-5">
            <Link href="/admin">
              <Image src="/brand/logo.png" alt="Nexgen Pharma" width={913} height={242} className="h-9 w-auto" />
            </Link>
          </div>
          <AdminNav />
          <div className="mt-auto hidden space-y-1 border-t border-line p-3 lg:block">
            <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-canvas hover:text-ink">
              <ExternalLink className="size-4" /> View website
            </Link>
            <form action={adminLogout}>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-canvas hover:text-ink">
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">
        {dbMissing && (
          <div className="mb-6 flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800">
            <AlertTriangle className="size-5 shrink-0" />
            <p>
              <b>Database not connected.</b> In Vercel open Storage → Create Database → Neon, connect it to this project,
              then redeploy. Until then nothing here can be saved.
            </p>
          </div>
        )}
        {dbIsLocal && !dbMissing && (
          <p className="mb-6 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
            Local development database. Data is stored on this computer only.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
