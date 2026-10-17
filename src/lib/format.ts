export const fmtDate = (d: string | Date | null | undefined) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

/** Days from today until a date (negative = overdue). */
export function daysUntil(d: string | Date | null | undefined) {
  if (!d) return null;
  const due = new Date(d);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 864e5);
}

export function dueStatus(d: string | Date | null | undefined) {
  const n = daysUntil(d);
  if (n === null) return { label: "No due date", tone: "muted" as const, days: null };
  if (n < 0) return { label: `Overdue by ${-n} day${n === -1 ? "" : "s"}`, tone: "critical" as const, days: n };
  if (n <= 30) return { label: `Due in ${n} day${n === 1 ? "" : "s"}`, tone: "warning" as const, days: n };
  return { label: "Valid", tone: "good" as const, days: n };
}

/** Postgres `date` values may arrive as Date or string; normalise to YYYY-MM-DD. */
export function isoDate(d: string | Date | null | undefined) {
  if (!d) return "";
  if (typeof d === "string") return d.slice(0, 10);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
