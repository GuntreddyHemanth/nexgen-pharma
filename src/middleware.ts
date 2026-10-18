import { NextResponse, type NextRequest } from "next/server";

// Send visitors on the old Vercel address to the real domain (production only).
const OLD_HOSTS = new Set(["nexgen-pharma.vercel.app"]);
const CANONICAL = "https://www.nexgenpharma.co.in";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host")?.toLowerCase() ?? "";
  if (!OLD_HOSTS.has(host)) return NextResponse.next();
  const url = new URL(req.nextUrl.pathname + req.nextUrl.search, CANONICAL);
  return NextResponse.redirect(url, 308);
}

export const config = {
  // API routes (cron, forms) and static assets are left alone.
  matcher: ["/((?!api/|_next/|media/|favicon|icon|apple-icon).*)"],
};
