import "server-only";
import { categories as seedCategories } from "./catalog";
import { services as seedServices } from "./services";

type Row = Record<string, unknown>;
type Runner = (text: string, params?: unknown[]) => Promise<Row[]>;

/** True when running on Vercel without a database configured. */
export const dbMissing = !process.env.DATABASE_URL && !!process.env.VERCEL;
export const dbIsLocal = !process.env.DATABASE_URL;

let runnerPromise: Promise<Runner> | null = null;

async function createRunner(): Promise<Runner> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    return (text, params = []) => sql.query(text, params) as Promise<Row[]>;
  }
  if (process.env.VERCEL) throw new Error("DATABASE_URL is not configured");
  // Build workers run in parallel; an embedded DB can't be shared, so builds use static content.
  if (process.env.NEXT_PHASE === "phase-production-build") throw new Error("local DB unavailable during build");
  // Local development: embedded Postgres persisted to ./.data
  const { PGlite } = await import("@electric-sql/pglite");
  const { mkdirSync } = await import("node:fs");
  mkdirSync("./.data", { recursive: true });
  const g = globalThis as unknown as { __pglite?: InstanceType<typeof PGlite> };
  g.__pglite ??= new PGlite("./.data/pglite");
  const db = g.__pglite;
  return async (text, params = []) => (await db.query<Row>(text, params)).rows;
}

async function runner() {
  runnerPromise ??= createRunner().then(async (run) => {
    // Parallel build workers can race on first-time DDL; a short retry lets the winner finish.
    for (let attempt = 1; ; attempt++) {
      try {
        await migrate(run);
        return run;
      } catch (e) {
        if (attempt >= 4) throw e;
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
  });
  try {
    return await runnerPromise;
  } catch (e) {
    runnerPromise = null;
    throw e;
  }
}

export async function q<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  const run = await runner();
  return (await run(text, params)) as T[];
}

export async function one<T = Row>(text: string, params: unknown[] = []): Promise<T | undefined> {
  return (await q<T>(text, params))[0];
}

const schema = [
  `create table if not exists settings (key text primary key, value text not null)`,
  `create table if not exists files (
     id serial primary key, name text not null, mime text not null, size int not null,
     data_b64 text not null, created_at timestamptz not null default now())`,
  `create table if not exists leads (
     id serial primary key, ref text unique not null, kind text not null, status text not null default 'new',
     name text not null, company text not null, email text not null, phone text not null,
     location text not null default '', service text not null default '', message text not null default '',
     items jsonb not null default '[]', notes text not null default '',
     created_at timestamptz not null default now(), updated_at timestamptz not null default now())`,
  `create table if not exists categories (
     slug text primary key, title text not null, icon text not null, summary text not null, sort int not null default 0)`,
  `create table if not exists items (
     id text primary key, category_slug text not null references categories(slug) on delete cascade,
     name text not null, spec text not null default '', sort int not null default 0)`,
  `create table if not exists services (slug text primary key, data jsonb not null, sort int not null default 0)`,
  `create table if not exists clients (
     id serial primary key, company text not null, contact_name text not null default '',
     email text unique not null, password_hash text not null, active boolean not null default true,
     created_at timestamptz not null default now())`,
  `create table if not exists certificates (
     id serial primary key, client_id int not null references clients(id) on delete cascade,
     instrument text not null, tag text not null default '', cert_no text not null default '',
     calibrated_on date, due_on date, file_id int references files(id) on delete set null,
     reminded_30 boolean not null default false, reminded_7 boolean not null default false,
     created_at timestamptz not null default now())`,
  `create table if not exists posts (
     id serial primary key, slug text unique not null, title text not null, excerpt text not null default '',
     body text not null default '', published boolean not null default false, published_at timestamptz,
     created_at timestamptz not null default now(), updated_at timestamptz not null default now())`,
  `create table if not exists media (
     id serial primary key, kind text not null, file_id int not null references files(id) on delete cascade,
     caption text not null default '', category text not null default '', sort int not null default 0,
     created_at timestamptz not null default now())`,
  `create table if not exists testimonials (
     id serial primary key, quote text not null, name text not null, role text not null default '',
     company text not null default '', published boolean not null default true, sort int not null default 0)`,
  `create index if not exists leads_created_idx on leads (created_at desc)`,
  `create index if not exists certs_client_idx on certificates (client_id)`,
  `create index if not exists certs_due_idx on certificates (due_on)`,
];

async function migrate(run: Runner) {
  for (const stmt of schema) await run(stmt);
  const seeded = await run(`select value from settings where key = 'seeded_v1'`);
  if (seeded.length) return;

  for (const [ci, c] of seedCategories.entries()) {
    await run(
      `insert into categories (slug, title, icon, summary, sort) values ($1,$2,$3,$4,$5) on conflict do nothing`,
      [c.slug, c.title, c.icon, c.summary, ci],
    );
    for (const [ii, it] of c.items.entries())
      await run(
        `insert into items (id, category_slug, name, spec, sort) values ($1,$2,$3,$4,$5) on conflict do nothing`,
        [it.id, c.slug, it.name, it.spec, ii],
      );
  }
  for (const [si, s] of seedServices.entries())
    await run(`insert into services (slug, data, sort) values ($1,$2,$3) on conflict do nothing`, [
      s.slug,
      JSON.stringify(s),
      si,
    ]);
  const { seedPosts } = await import("./seed-posts");
  for (const p of seedPosts)
    await run(
      `insert into posts (slug, title, excerpt, body, published, published_at) values ($1,$2,$3,$4,true,now()) on conflict do nothing`,
      [p.slug, p.title, p.excerpt, p.body],
    );
  await run(`insert into settings (key, value) values ('seeded_v1', '1') on conflict do nothing`);
}

/** Run a DB read, falling back to a default if the database is unavailable. */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error("[db] falling back to static content:", (e as Error).message);
    return fallback;
  }
}

export async function getSetting(key: string) {
  return (await one<{ value: string }>(`select value from settings where key = $1`, [key]))?.value;
}
export async function setSetting(key: string, value: string | null) {
  if (value === null) await q(`delete from settings where key = $1`, [key]);
  else
    await q(`insert into settings (key, value) values ($1,$2) on conflict (key) do update set value = excluded.value`, [
      key,
      value,
    ]);
}
