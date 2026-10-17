"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { one } from "@/lib/db";
import { endClientSession, startClientSession, tooManyAttempts, verifyPassword } from "@/lib/auth";

export type LoginState = { error?: string };

export async function clientLogin(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (tooManyAttempts(`client:${ip}`)) return { error: "Too many attempts. Please wait 15 minutes and try again." };
  if (!email || !password) return { error: "Enter your email and password." };

  let row: { id: number; password_hash: string } | undefined;
  try {
    row = await one(`select id, password_hash from clients where lower(email) = $1 and active`, [email]);
  } catch {
    return { error: "The portal is temporarily unavailable. Please try again later." };
  }
  if (!row || !verifyPassword(password, row.password_hash)) return { error: "Email or password is incorrect." };
  await startClientSession(row.id);
  redirect("/portal");
}

export async function clientLogout() {
  await endClientSession();
  redirect("/portal/login");
}
