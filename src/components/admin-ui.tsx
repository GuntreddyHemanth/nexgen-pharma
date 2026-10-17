import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ConfirmSubmit } from "./confirm-submit";

export type SP = Promise<Record<string, string | string[] | undefined>>;

export async function Flash({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const ok = typeof sp.ok === "string" ? sp.ok : null;
  const err = typeof sp.err === "string" ? sp.err : null;
  if (!ok && !err) return null;
  return (
    <div
      role="status"
      className={`mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
        err ? "bg-red-50 text-red-700" : "bg-leaf-50 text-leaf-700"
      }`}
    >
      {err ? <AlertCircle className="size-4 shrink-0" /> : <CheckCircle2 className="size-4 shrink-0" />}
      {err ?? ok}
    </div>
  );
}

export function AdminHeader({ title, sub, children }: { title: string; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Panel({ title, children, id, actions }: { title?: string; children: React.ReactNode; id?: string; actions?: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-2xl border border-line bg-white">
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="font-bold">{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function SubmitBtn({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "leaf" | "ghost" }) {
  const cls = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    leaf: "bg-leaf-500 text-white hover:bg-leaf-600",
    ghost: "text-ink ring-1 ring-line hover:bg-canvas",
  }[tone];
  return (
    <button type="submit" className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${cls}`}>
      {children}
    </button>
  );
}

export function DeleteForm({
  action,
  fields,
  label = "Delete",
  confirm = "Delete this permanently?",
}: {
  action: (fd: FormData) => Promise<void>;
  fields: Record<string, string | number>;
  label?: string;
  confirm?: string;
}) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <ConfirmSubmit message={confirm}>{label}</ConfirmSubmit>
    </form>
  );
}
