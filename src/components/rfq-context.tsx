"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type RfqLine = { id: string; name: string; category: string; spec: string; qty: string; note: string };

type Ctx = {
  lines: RfqLine[];
  add: (line: Omit<RfqLine, "qty" | "note"> & { qty?: string; note?: string }) => void;
  update: (id: string, patch: Partial<Pick<RfqLine, "qty" | "note">>) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const RfqContext = createContext<Ctx | null>(null);
const KEY = "nexgen-rfq-v1";

export function RfqProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<RfqLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback<Ctx["add"]>((line) => {
    setLines((prev) =>
      prev.some((l) => l.id === line.id) ? prev : [...prev, { qty: "1", note: "", ...line }],
    );
  }, []);
  const update = useCallback<Ctx["update"]>((id, patch) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);
  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(
    () => ({ lines, add, update, remove, clear, has: (id) => lines.some((l) => l.id === id) }),
    [lines, add, update, remove, clear],
  );
  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfq() {
  const ctx = useContext(RfqContext);
  if (!ctx) throw new Error("useRfq must be used inside RfqProvider");
  return ctx;
}
