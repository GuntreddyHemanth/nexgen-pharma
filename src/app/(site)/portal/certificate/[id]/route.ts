import { currentClient, isAdmin } from "@/lib/auth";
import { one } from "@/lib/db";
import { fileResponse, loadFile } from "@/lib/files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Certificate PDFs: only the owning client (or an admin) can download.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return new Response("Not found", { status: 404 });

  const cert = await one<{ client_id: number; file_id: number | null }>(
    `select client_id, file_id from certificates where id = $1`,
    [id],
  );
  if (!cert?.file_id) return new Response("Not found", { status: 404 });

  const admin = await isAdmin();
  if (!admin) {
    const client = await currentClient();
    if (!client || client.id !== cert.client_id) return new Response("Not found", { status: 404 });
  }
  const f = await loadFile(cert.file_id);
  if (!f) return new Response("Not found", { status: 404 });
  return fileResponse(f, { cache: "private, no-store" });
}
