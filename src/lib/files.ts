import "server-only";
import { one } from "./db";

export const MAX_UPLOAD = 4 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class UploadError extends Error {}

/** Stores an uploaded file. Images are resized to max 1600px and converted to WebP. */
export async function saveUpload(file: File, accept: "image" | "pdf" | "image-or-pdf") {
  if (!file || file.size === 0) throw new UploadError("Please choose a file.");
  if (file.size > MAX_UPLOAD) throw new UploadError("File is larger than 4 MB.");
  const isImage = IMAGE_TYPES.includes(file.type);
  const isPdf = file.type === "application/pdf";
  if (accept === "image" && !isImage) throw new UploadError("Please upload a JPG, PNG or WebP image.");
  if (accept === "pdf" && !isPdf) throw new UploadError("Please upload a PDF.");
  if (accept === "image-or-pdf" && !isImage && !isPdf) throw new UploadError("Please upload a PDF or image.");

  let buf: Buffer = Buffer.from(await file.arrayBuffer());
  let mime = file.type;
  let name = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120) || "file";

  if (isPdf && buf.subarray(0, 5).toString() !== "%PDF-") throw new UploadError("That file is not a valid PDF.");

  if (isImage) {
    const sharp = (await import("sharp")).default;
    buf = await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    mime = "image/webp";
    name = name.replace(/\.\w+$/, "") + ".webp";
  }

  const row = await one<{ id: number }>(
    `insert into files (name, mime, size, data_b64) values ($1,$2,$3,$4) returning id`,
    [name, mime, buf.length, buf.toString("base64")],
  );
  return row!.id;
}

export async function loadFile(id: number) {
  return one<{ name: string; mime: string; data_b64: string }>(`select name, mime, data_b64 from files where id = $1`, [id]);
}

export function fileResponse(f: { name: string; mime: string; data_b64: string }, opts: { cache: string; download?: boolean }) {
  const body = Buffer.from(f.data_b64, "base64");
  return new Response(body, {
    headers: {
      "Content-Type": f.mime,
      "Content-Length": String(body.length),
      "Cache-Control": opts.cache,
      "Content-Disposition": `${opts.download ? "attachment" : "inline"}; filename="${f.name.replace(/"/g, "")}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
