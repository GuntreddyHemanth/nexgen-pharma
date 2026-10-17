import { readSignedLink } from "@/lib/auth";
import { getSetting } from "@/lib/db";
import { fileResponse, loadFile } from "@/lib/files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("t") ?? undefined;
  if (readSignedLink(token) !== "catalogue") return new Response("This download link has expired.", { status: 403 });
  const id = Number(await getSetting("catalogue_file_id"));
  const f = id ? await loadFile(id) : undefined;
  if (!f) return new Response("Catalogue not available.", { status: 404 });
  return fileResponse(f, { cache: "private, no-store", download: true });
}
