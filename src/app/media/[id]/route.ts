import { one } from "@/lib/db";
import { fileResponse, loadFile } from "@/lib/files";

export const runtime = "nodejs";

// Public images only: files attached to gallery photos or client logos.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return new Response("Not found", { status: 404 });
  const ok = await one(`select 1 from media where file_id = $1`, [id]).catch(() => undefined);
  if (!ok) return new Response("Not found", { status: 404 });
  const f = await loadFile(id);
  if (!f) return new Response("Not found", { status: 404 });
  return fileResponse(f, { cache: "public, max-age=86400, s-maxage=31536000, immutable" });
}
