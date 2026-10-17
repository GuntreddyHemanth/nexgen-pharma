import { q } from "@/lib/db";
import { adminInbox, emailShell, esc, sendEmail } from "@/lib/email";
import { fmtDate } from "@/lib/format";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Due = {
  id: number;
  instrument: string;
  tag: string;
  cert_no: string;
  due_on: string;
  reminded_30: boolean;
  reminded_7: boolean;
  client_id: number;
  company: string;
  contact_name: string;
  email: string;
};

/**
 * Runs daily (vercel.json). Emails each client a list of certificates due within 30 days
 * (and again within 7 days), then sends the Nexgen team a summary.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`)
    return new Response("Unauthorized", { status: 401 });

  const rows = await q<Due>(
    `select c.id, c.instrument, c.tag, c.cert_no, c.due_on, c.reminded_30, c.reminded_7,
            cl.id as client_id, cl.company, cl.contact_name, cl.email
     from certificates c join clients cl on cl.id = c.client_id
     where cl.active and c.due_on is not null and c.due_on <= current_date + 30
       and ((not c.reminded_30) or (c.due_on <= current_date + 7 and not c.reminded_7))
     order by cl.id, c.due_on`,
  );

  const byClient = new Map<number, Due[]>();
  for (const r of rows) byClient.set(r.client_id, [...(byClient.get(r.client_id) ?? []), r]);

  let emailed = 0;
  const summary: string[] = [];
  for (const certs of byClient.values()) {
    const c = certs[0];
    const list = certs
      .map(
        (r) =>
          `<tr style="border-top:1px solid #e3e9f3"><td style="padding:8px">${esc(r.instrument)}${r.tag ? `<br><small style="color:#55607a">Tag ${esc(r.tag)}</small>` : ""}</td><td style="padding:8px">${esc(r.cert_no)}</td><td style="padding:8px"><b>${fmtDate(r.due_on)}</b></td></tr>`,
      )
      .join("");
    const html = emailShell(
      "Calibration due soon",
      `<p>Dear ${esc(c.contact_name || c.company)},</p>
       <p>The following instruments at <b>${esc(c.company)}</b> are due for calibration soon:</p>
       <table style="border-collapse:collapse;width:100%;font-size:14px"><tr style="background:#f6f9fd"><th align="left" style="padding:8px">Instrument</th><th align="left" style="padding:8px">Certificate</th><th align="left" style="padding:8px">Due</th></tr>${list}</table>
       <p>Reply to this email or call ${esc(site.phones[0].display)} to schedule calibration. You can view all your certificates at <a href="${esc(site.url)}/portal">${esc(site.url.replace(/^https?:\/\//, ""))}/portal</a>.</p>`,
    );
    const ok = await sendEmail({
      to: [c.email],
      subject: `Calibration due: ${certs.length} instrument${certs.length === 1 ? "" : "s"} at ${c.company}`,
      html,
      replyTo: adminInbox()[0],
    });
    if (ok) {
      emailed++;
      for (const r of certs) {
        const within7 = new Date(r.due_on).getTime() - Date.now() <= 7 * 864e5;
        await q(`update certificates set reminded_30 = true, reminded_7 = reminded_7 or $2 where id = $1`, [r.id, within7]);
      }
    }
    summary.push(`<li><b>${esc(c.company)}</b>: ${certs.length} instrument(s) due ${ok ? "(client emailed)" : "(email NOT sent)"}</li>`);
  }

  if (summary.length)
    await sendEmail({
      to: adminInbox(),
      subject: `Calibration reminders: ${summary.length} client(s) with instruments due`,
      html: emailShell("Today's calibration reminders", `<ul>${summary.join("")}</ul><p><a href="${esc(site.url)}/admin">Open admin</a></p>`),
    });

  return Response.json({ ok: true, clients: byClient.size, emailed });
}
