"use client";

import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { useRfq } from "./rfq-context";

export function AddToRfq({
  id,
  name,
  category,
  spec,
  compact,
}: {
  id: string;
  name: string;
  category: string;
  spec: string;
  compact?: boolean;
}) {
  const { add, has } = useRfq();
  const added = has(id);

  if (added)
    return (
      <Link
        href="/rfq"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-leaf-50 px-4 py-2 text-sm font-semibold text-leaf-700 ring-1 ring-leaf-200 transition hover:bg-leaf-100"
      >
        <Check className="size-4" aria-hidden /> {compact ? "Added" : "In basket"}
      </Link>
    );

  return (
    <button
      type="button"
      onClick={() => add({ id, name, category, spec })}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-95"
    >
      <Plus className="size-4" aria-hidden /> {compact ? "Add" : "Add to RFQ"}
    </button>
  );
}
