import { FileText } from "lucide-react";
import { AdminHeader, DeleteForm, Field, Flash, Panel, SubmitBtn, type SP } from "@/components/admin-ui";
import { getSetting, q } from "@/lib/db";
import {
  deleteMedia,
  deleteTestimonial,
  removeCatalogue,
  saveTestimonial,
  updateMedia,
  uploadCatalogue,
  uploadMedia,
} from "@/app/admin/actions";

export const metadata = { title: "Gallery & catalogue" };

const GALLERY_CATEGORIES = ["Calibration lab", "CNC machining", "SS fabrication", "Site work", "Team"];

type Media = { id: number; kind: string; file_id: number; caption: string; category: string };
type T = { id: number; quote: string; name: string; role: string; company: string };

export default async function MediaAdmin({ searchParams }: { searchParams: SP }) {
  const [media, testimonials, catalogueId] = await Promise.all([
    q<Media>(`select id, kind, file_id, caption, category from media order by sort, id desc`),
    q<T>(`select id, quote, name, role, company from testimonials order by sort, id desc`),
    getSetting("catalogue_file_id"),
  ]);
  const catalogue = catalogueId
    ? (await q<{ name: string; size: number }>(`select name, size from files where id = $1`, [Number(catalogueId)]))[0]
    : undefined;
  const gallery = media.filter((m) => m.kind === "gallery");
  const logos = media.filter((m) => m.kind === "logo");

  return (
    <>
      <AdminHeader title="Gallery & catalogue" sub="Photos, client logos, testimonials and the downloadable catalogue." />
      <Flash searchParams={searchParams} />

      <div className="space-y-6">
        <Panel title={`Gallery photos (${gallery.length})`}>
          <form action={uploadMedia} className="grid gap-3 rounded-xl bg-canvas p-4 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
            <input type="hidden" name="kind" value="gallery" />
            <Field label="Photos" hint="JPG/PNG, up to 4 MB each. Resized automatically.">
              <input name="files" type="file" accept="image/*" multiple required className="field !py-2 text-sm" />
            </Field>
            <Field label="Section">
              <select name="category" className="field">
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Caption (single photo)">
              <input name="caption" className="field" />
            </Field>
            <SubmitBtn tone="leaf">Upload</SubmitBtn>
          </form>
          {gallery.length > 0 && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {gallery.map((m) => (
                <div key={m.id} className="overflow-hidden rounded-xl border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/${m.file_id}`} alt={m.caption} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="space-y-2 p-3">
                    <form action={updateMedia} className="grid gap-2">
                      <input type="hidden" name="id" value={m.id} />
                      <input name="caption" defaultValue={m.caption} placeholder="Caption" aria-label="Caption" className="field !py-1.5 text-sm" />
                      <div className="flex gap-2">
                        <select name="category" defaultValue={m.category} aria-label="Section" className="field !py-1.5 text-sm">
                          {GALLERY_CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <SubmitBtn tone="ghost">Save</SubmitBtn>
                      </div>
                    </form>
                    <DeleteForm action={deleteMedia} fields={{ id: m.id }} confirm="Delete this photo?" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title={`Client logos (${logos.length})`}>
            <p className="mb-3 text-xs text-muted">Shown on the home page under “Trusted by”. Only add logos with the client&apos;s permission.</p>
            <form action={uploadMedia} className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <input type="hidden" name="kind" value="logo" />
              <Field label="Logo images">
                <input name="files" type="file" accept="image/*" multiple required className="field !py-2 text-sm" />
              </Field>
              <Field label="Company (single logo)">
                <input name="caption" className="field" />
              </Field>
              <SubmitBtn tone="leaf">Upload</SubmitBtn>
            </form>
            {logos.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {logos.map((m) => (
                  <div key={m.id} className="flex flex-col items-center gap-2 rounded-xl border border-line p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/media/${m.file_id}`} alt={m.caption} className="h-12 w-auto object-contain" />
                    <p className="truncate text-xs text-muted">{m.caption || "—"}</p>
                    <DeleteForm action={deleteMedia} fields={{ id: m.id }} confirm="Remove this logo?" label="Remove" />
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Downloadable catalogue (PDF)" id="catalogue">
            {catalogue ? (
              <div className="flex items-center justify-between gap-4 rounded-xl bg-leaf-50 p-4">
                <div className="flex items-center gap-3">
                  <FileText className="size-8 text-leaf-600" />
                  <div>
                    <p className="font-semibold">{catalogue.name}</p>
                    <p className="text-xs text-muted">{(catalogue.size / 1024 / 1024).toFixed(1)} MB · live on the Materials page</p>
                  </div>
                </div>
                <form action={removeCatalogue}>
                  <button className="text-xs font-semibold text-red-600">Remove</button>
                </form>
              </div>
            ) : (
              <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                No PDF uploaded. Visitors can still request the catalogue, and those requests appear in Leads.
              </p>
            )}
            <form action={uploadCatalogue} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field label={catalogue ? "Replace PDF" : "Upload PDF"} hint="Up to 4 MB. Visitors give their contact details to download it.">
                <input name="file" type="file" accept="application/pdf" required className="field !py-2 text-sm" />
              </Field>
              <SubmitBtn tone="leaf">Upload</SubmitBtn>
            </form>
          </Panel>
        </div>

        <Panel title={`Testimonials (${testimonials.length})`} id="testimonials">
          <form action={saveTestimonial} className="grid gap-3 rounded-xl bg-canvas p-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Field label="Quote *">
                <textarea name="quote" rows={2} required className="field" />
              </Field>
            </div>
            <Field label="Name *">
              <input name="name" required className="field" />
            </Field>
            <Field label="Role">
              <input name="role" className="field" placeholder="e.g. Head of Engineering" />
            </Field>
            <Field label="Company">
              <input name="company" className="field" />
            </Field>
            <div className="sm:col-span-3">
              <SubmitBtn tone="leaf">Add testimonial</SubmitBtn>
            </div>
          </form>
          {testimonials.length > 0 && (
            <ul className="mt-5 divide-y divide-line">
              {testimonials.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm">“{t.quote}”</p>
                    <p className="mt-1 text-xs text-muted">
                      {t.name}
                      {t.role && `, ${t.role}`}
                      {t.company && `, ${t.company}`}
                    </p>
                  </div>
                  <DeleteForm action={deleteTestimonial} fields={{ id: t.id }} confirm="Delete this testimonial?" />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
