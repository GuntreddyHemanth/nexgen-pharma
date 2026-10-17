import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { one } from "./db";

const ADMIN_COOKIE = "nx_admin";
const CLIENT_COOKIE = "nx_client";
const WEEK = 7 * 24 * 3600;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.VERCEL) throw new Error("SESSION_SECRET must be set (16+ characters)");
  return "dev-only-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function makeToken(subject: string, maxAge: number) {
  const body = `${subject}.${Math.floor(Date.now() / 1000) + maxAge}`;
  return `${body}.${sign(body)}`;
}

function readToken(token: string | undefined): string | null {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const body = token.slice(0, i);
  const sig = token.slice(i + 1);
  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const j = body.lastIndexOf(".");
  const exp = Number(body.slice(j + 1));
  if (!exp || exp < Date.now() / 1000) return null;
  return body.slice(0, j);
}

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
});

/* ---------- passwords ---------- */

export function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(pw, salt, 64).toString("base64url");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(pw: string, stored: string) {
  const [alg, salt, hash] = stored.split("$");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const a = scryptSync(pw, salt, 64);
  const b = Buffer.from(hash, "base64url");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(12);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/* ---------- login throttling (best effort, per instance) ---------- */

const attempts = new Map<string, number[]>();
export function tooManyAttempts(key: string) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < 15 * 60_000);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > 8;
}

/* ---------- admin ---------- */

export function adminPassword() {
  const p = process.env.ADMIN_PASSWORD;
  if (p) return p;
  if (process.env.VERCEL) return null;
  return "admin123";
}

export function checkAdminPassword(pw: string) {
  const expected = adminPassword();
  if (!expected) return false;
  const a = Buffer.from(sign(pw));
  const b = Buffer.from(sign(expected));
  return timingSafeEqual(a, b);
}

export async function startAdminSession() {
  (await cookies()).set(ADMIN_COOKIE, makeToken("admin", WEEK), cookieOpts(WEEK));
}

export async function isAdmin() {
  return readToken((await cookies()).get(ADMIN_COOKIE)?.value) === "admin";
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function endAdminSession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

/* ---------- client portal ---------- */

export type ClientUser = { id: number; company: string; contact_name: string; email: string };

export async function startClientSession(id: number) {
  (await cookies()).set(CLIENT_COOKIE, makeToken(`c${id}`, WEEK), cookieOpts(WEEK));
}

export async function currentClient(): Promise<ClientUser | null> {
  const sub = readToken((await cookies()).get(CLIENT_COOKIE)?.value);
  if (!sub?.startsWith("c")) return null;
  const id = Number(sub.slice(1));
  if (!id) return null;
  return (
    (await one<ClientUser>(`select id, company, contact_name, email from clients where id = $1 and active`, [id])) ??
    null
  );
}

export async function requireClient() {
  const c = await currentClient();
  if (!c) redirect("/portal/login");
  return c;
}

export async function endClientSession() {
  (await cookies()).delete(CLIENT_COOKIE);
}

/* ---------- short-lived signed links (catalogue download) ---------- */

export function signedLink(subject: string, seconds: number) {
  return makeToken(subject, seconds);
}
export function readSignedLink(token: string | undefined) {
  return readToken(token);
}
