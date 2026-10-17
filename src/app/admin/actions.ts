"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { one, q, setSetting, getSetting } from "@/lib/db";
import {
  checkAdminPassword,
  endAdminSession,
  hashPassword,
  requireAdmin,
  startAdminSession,
  tooManyAttempts,
} from "@/lib/auth";
import { saveUpload, UploadError } from "@/lib/files";
import type { Service } from "@/lib/services";
import { LEAD_STATUSES } from "@/lib/leads";

const s = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const lines = (v: string) => v.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const slugify = (v: string) =>
  v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const back = (target: string, msg: string, kind: "ok" | "err" = "ok"): never => {
  const [path, hash] = target.split("#");
  redirect(`${path}${path.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(msg)}${hash ? `#${hash}` : ""}`);
};
const refreshSite = () => revalidatePath("/", "layout");

/* ---------------- auth ---------------- */

export async function adminLogin(_prev: { error?: string }, fd: FormData) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (tooManyAttempts(`admin:${ip}`)) return { error: "Too many attempts. Please wait 15 minutes." };
  if (!checkAdminPassword(String(fd.get("password") ?? ""))) return { error: "Incorrect password." };
  await startAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await endAdminSession();
  redirect("/admin/login");
}

/* ---------------- leads ---------------- */

export async function updateLead(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const status = s(fd, "status");
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) back(`/admin/leads/${id}`, "Invalid status", "err");
  await q(`update leads set status = $1, notes = $2, updated_at = now() where id = $3`, [status, s(fd, "notes", 5000), id]);
  back(`/admin/leads/${id}`, "Lead updated");
}

export async function deleteLead(fd: FormData) {
  await requireAdmin();
  await q(`delete from leads where id = $1`, [Number(fd.get("id"))]);
  back("/admin/leads", "Lead deleted");
}

/* ---------------- catalogue ---------------- */

export async function saveItem(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id", 60);
  const category = s(fd, "category", 80);
  const name = s(fd, "name", 200);
  const spec = s(fd, "spec", 200);
  if (!name) back(`/admin/catalogue#${category}`, "Item name is required", "err");
  if (id) {
    await q(`update items set name = $1, spec = $2 where id = $3`, [name, spec, id]);
  } else {
    const newId = `${category.slice(0, 3)}-${Date.now().toString(36)}`;
    const sort = (await one<{ n: number }>(`select coalesce(max(sort), 0) + 1 as n from items where category_slug = $1`, [category]))?.n ?? 0;
    await q(`insert into items (id, category_slug, name, spec, sort) values ($1,$2,$3,$4,$5)`, [newId, category, name, spec, sort]);
  }
  refreshSite();
  back(`/admin/catalogue?cat=${category}`, id ? "Item saved" : "Item added");
}

export async function deleteItem(fd: FormData) {
  await requireAdmin();
  await q(`delete from items where id = $1`, [s(fd, "id", 60)]);
  refreshSite();
  back(`/admin/catalogue?cat=${s(fd, "category", 80)}`, "Item deleted");
}

export async function saveCategory(fd: FormData) {
  await requireAdmin();
  const original = s(fd, "original", 80);
  const title = s(fd, "title", 120);
  const summary = s(fd, "summary", 400);
  const icon = s(fd, "icon", 20) || "box";
  if (!title) back("/admin/catalogue", "Category title is required", "err");
  if (original) {
    await q(`update categories set title = $1, summary = $2, icon = $3 where slug = $4`, [title, summary, icon, original]);
    refreshSite();
    back(`/admin/catalogue?cat=${original}`, "Category saved");
  }
  const slug = slugify(title);
  if (await one(`select 1 from categories where slug = $1`, [slug])) back("/admin/catalogue", "A category with that name exists", "err");
  const sort = (await one<{ n: number }>(`select coalesce(max(sort), 0) + 1 as n from categories`))?.n ?? 0;
  await q(`insert into categories (slug, title, icon, summary, sort) values ($1,$2,$3,$4,$5)`, [slug, title, icon, summary, sort]);
  refreshSite();
  back(`/admin/catalogue?cat=${slug}`, "Category added");
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  await q(`delete from categories where slug = $1`, [s(fd, "slug", 80)]);
  refreshSite();
  back("/admin/catalogue", "Category deleted");
}

/* ---------------- services ---------------- */

export async function saveService(fd: FormData) {
  await requireAdmin();
  const slug = s(fd, "slug", 80);
  const row = await one<{ data: Service }>(`select data from services where slug = $1`, [slug]);
  if (!row) back("/admin/services", "Service not found", "err");
  const pairs = (v: string) =>
    lines(v).map((l) => {
      const [a, ...rest] = l.split("|");
      return [a.trim(), rest.join("|").trim()] as const;
    });
  const scopeItems = lines(s(fd, "scopeItems", 4000));
  const data: Service = {
    ...row!.data,
    title: s(fd, "title", 120) || row!.data.title,
    summary: s(fd, "summary", 400),
    intro: s(fd, "intro", 2000),
    offerings: pairs(s(fd, "offerings", 6000)).map(([title, body]) => ({ title, body })),
    scope: scopeItems.length ? { label: s(fd, "scopeLabel", 120) || "Scope", items: scopeItems } : undefined,
    deliverables: lines(s(fd, "deliverables", 4000)),
    faqs: pairs(s(fd, "faqs", 8000)).map(([q, a]) => ({ q, a })),
  };
  await q(`update services set data = $1 where slug = $2`, [JSON.stringify(data), slug]);
  refreshSite();
  back(`/admin/services/${slug}`, "Service saved. The website updates within a minute.");
}

/* ---------------- clients & certificates ---------------- */

export async function createClient(fd: FormData) {
  await requireAdmin();
  const company = s(fd, "company", 150);
  const email = s(fd, "email", 150).toLowerCase();
  const password = s(fd, "password", 100);
  if (!company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back("/admin/clients", "Company and a valid email are required", "err");
  if (password.length < 8) back("/admin/clients", "Password must be at least 8 characters", "err");
  if (await one(`select 1 from clients where lower(email) = $1`, [email])) back("/admin/clients", "That email already has a login", "err");
  const row = await one<{ id: number }>(
    `insert into clients (company, contact_name, email, password_hash) values ($1,$2,$3,$4) returning id`,
    [company, s(fd, "contact_name", 120), email, hashPassword(password)],
  );
  back(`/admin/clients/${row!.id}`, "Client created. Share the email and password with them.");
}

export async function updateClient(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const password = s(fd, "password", 100);
  await q(`update clients set company = $1, contact_name = $2, active = $3 where id = $4`, [
    s(fd, "company", 150),
    s(fd, "contact_name", 120),
    fd.get("active") === "on",
    id,
  ]);
  if (password) {
    if (password.length < 8) back(`/admin/clients/${id}`, "Password must be at least 8 characters", "err");
    await q(`update clients set password_hash = $1 where id = $2`, [hashPassword(password), id]);
  }
  back(`/admin/clients/${id}`, password ? "Client saved and password reset" : "Client saved");
}

export async function deleteClient(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const files = await q<{ file_id: number }>(`select file_id from certificates where client_id = $1 and file_id is not null`, [id]);
  await q(`delete from clients where id = $1`, [id]);
  for (const f of files) await q(`delete from files where id = $1`, [f.file_id]);
  back("/admin/clients", "Client and their certificates deleted");
}

export async function addCertificate(fd: FormData) {
  await requireAdmin();
  const clientId = Number(fd.get("client_id"));
  const instrument = s(fd, "instrument", 200);
  if (!instrument) back(`/admin/clients/${clientId}`, "Instrument name is required", "err");
  const date = (k: string) => (/^\d{4}-\d{2}-\d{2}$/.test(s(fd, k, 10)) ? s(fd, k, 10) : null);
  let fileId: number | null = null;
  const file = fd.get("file");
  if (file instanceof File && file.size > 0) {
    try {
      fileId = await saveUpload(file, "image-or-pdf");
    } catch (e) {
      back(`/admin/clients/${clientId}`, e instanceof UploadError ? e.message : "Upload failed", "err");
    }
  }
  await q(
    `insert into certificates (client_id, instrument, tag, cert_no, calibrated_on, due_on, file_id) values ($1,$2,$3,$4,$5,$6,$7)`,
    [clientId, instrument, s(fd, "tag", 80), s(fd, "cert_no", 80), date("calibrated_on"), date("due_on"), fileId],
  );
  back(`/admin/clients/${clientId}`, "Certificate added");
}

export async function deleteCertificate(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const row = await one<{ client_id: number; file_id: number | null }>(`delete from certificates where id = $1 returning client_id, file_id`, [id]);
  if (row?.file_id) await q(`delete from files where id = $1`, [row.file_id]);
  back(`/admin/clients/${row?.client_id ?? ""}`, "Certificate deleted");
}

/* ---------------- posts ---------------- */

export async function savePost(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const title = s(fd, "title", 200);
  const slug = slugify(s(fd, "slug", 100) || title);
  const published = fd.get("published") === "on";
  if (!title || !slug) back(`/admin/posts/${id ?? "new"}`, "Title is required", "err");
  const clash = await one<{ id: number }>(`select id from posts where slug = $1`, [slug]);
  if (clash && clash.id !== id) back(`/admin/posts/${id ?? "new"}`, "Another article uses that URL", "err");
  const vals = [title, slug, s(fd, "excerpt", 400), s(fd, "body", 50000), published];
  let saved: number;
  if (id) {
    await q(
      `update posts set title=$1, slug=$2, excerpt=$3, body=$4, published=$5,
       published_at = case when $5 and published_at is null then now() else published_at end, updated_at = now() where id = $6`,
      [...vals, id],
    );
    saved = id;
  } else {
    saved = (await one<{ id: number }>(
      `insert into posts (title, slug, excerpt, body, published, published_at) values ($1,$2,$3,$4,$5, case when $5 then now() end) returning id`,
      vals,
    ))!.id;
  }
  refreshSite();
  back(`/admin/posts/${saved}`, published ? "Article saved and published" : "Draft saved");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  await q(`delete from posts where id = $1`, [Number(fd.get("id"))]);
  refreshSite();
  back("/admin/posts", "Article deleted");
}

/* ---------------- media, testimonials, catalogue ---------------- */

export async function uploadMedia(fd: FormData) {
  await requireAdmin();
  const kind = s(fd, "kind") === "logo" ? "logo" : "gallery";
  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) back("/admin/media", "Choose at least one image", "err");
  let n = 0;
  for (const f of files) {
    try {
      const fileId = await saveUpload(f, "image");
      await q(`insert into media (kind, file_id, caption, category) values ($1,$2,$3,$4)`, [
        kind,
        fileId,
        files.length === 1 ? s(fd, "caption", 200) : "",
        s(fd, "category", 60),
      ]);
      n++;
    } catch (e) {
      back("/admin/media", `${f.name}: ${e instanceof UploadError ? e.message : "upload failed"}`, "err");
    }
  }
  refreshSite();
  back("/admin/media", `${n} image${n === 1 ? "" : "s"} uploaded`);
}

export async function updateMedia(fd: FormData) {
  await requireAdmin();
  await q(`update media set caption = $1, category = $2 where id = $3`, [s(fd, "caption", 200), s(fd, "category", 60), Number(fd.get("id"))]);
  refreshSite();
  back("/admin/media", "Saved");
}

export async function deleteMedia(fd: FormData) {
  await requireAdmin();
  const row = await one<{ file_id: number }>(`delete from media where id = $1 returning file_id`, [Number(fd.get("id"))]);
  if (row) await q(`delete from files where id = $1`, [row.file_id]);
  refreshSite();
  back("/admin/media", "Image deleted");
}

export async function saveTestimonial(fd: FormData) {
  await requireAdmin();
  const quote = s(fd, "quote", 1000);
  const name = s(fd, "name", 120);
  if (!quote || !name) back("/admin/media#testimonials", "Quote and name are required", "err");
  await q(`insert into testimonials (quote, name, role, company) values ($1,$2,$3,$4)`, [quote, name, s(fd, "role", 120), s(fd, "company", 150)]);
  refreshSite();
  back("/admin/media#testimonials", "Testimonial added");
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  await q(`delete from testimonials where id = $1`, [Number(fd.get("id"))]);
  refreshSite();
  back("/admin/media#testimonials", "Testimonial deleted");
}

export async function uploadCatalogue(fd: FormData) {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File)) back("/admin/media#catalogue", "Choose a PDF", "err");
  let id = 0;
  try {
    id = await saveUpload(file as File, "pdf");
  } catch (e) {
    back("/admin/media#catalogue", e instanceof UploadError ? e.message : "Upload failed", "err");
  }
  const old = await getSetting("catalogue_file_id");
  await setSetting("catalogue_file_id", String(id));
  if (old) await q(`delete from files where id = $1`, [Number(old)]);
  refreshSite();
  back("/admin/media#catalogue", "Catalogue uploaded. Visitors can now download it.");
}

export async function removeCatalogue() {
  await requireAdmin();
  const old = await getSetting("catalogue_file_id");
  await setSetting("catalogue_file_id", null);
  if (old) await q(`delete from files where id = $1`, [Number(old)]);
  refreshSite();
  back("/admin/media#catalogue", "Catalogue removed");
}
