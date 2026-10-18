import "server-only";
import { site } from "./site";

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const adminInbox = () => (process.env.ENQUIRY_TO ?? `${site.email},${site.altEmail}`).split(",").map((s) => s.trim());

/** Sends via Resend when RESEND_API_KEY is set. Returns true if delivered. */
export async function sendEmail(opts: { to: string[]; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email] RESEND_API_KEY not set; skipped:", opts.subject, "→", opts.to.join(", "));
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM ?? "Nexgen Pharma Website <website@nexgenpharma.co.in>",
        to: opts.to,
        reply_to: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      console.error("[email] Resend error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] send failed", e);
    return false;
  }
}

export function emailShell(title: string, inner: string) {
  return `<div style="font-family:Arial,sans-serif;color:#0b1630;max-width:640px">
    <div style="border-bottom:3px solid #3ea92e;padding-bottom:12px;margin-bottom:20px">
      <b style="color:#1a3f9c;font-size:18px">Nexgen Pharma Enterprises LLP</b>
    </div>
    <h2 style="color:#1a3f9c;margin:0 0 12px">${esc(title)}</h2>
    ${inner}
    <p style="color:#55607a;font-size:12px;margin-top:28px">${esc(site.tagline)} · ${esc(site.phones[0].display)} · ${esc(site.email)}</p>
  </div>`;
}
