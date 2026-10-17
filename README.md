# Nexgen Pharma Enterprises: Website

Next.js 15 · TypeScript · Tailwind CSS v4 · Motion · Postgres (Neon in production, embedded PGlite locally).

- **Public site**: services, materials catalogue + RFQ basket, capabilities, gallery, insights (blog), contact.
- **Admin** (`/admin`): lead pipeline (New → Contacted → Quoted → Won/Lost, CSV export), materials catalogue, service text, insights articles, gallery photos, client logos, testimonials, downloadable catalogue PDF, client portal logins and calibration certificates.
- **Client portal** (`/portal`): clients download their certificates and see due dates. A daily job emails reminders 30 and 7 days before calibration is due.

If the database is unreachable, public pages fall back to the built-in content in `src/lib/*.ts`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

## Local admin

`npm run dev`, open http://localhost:3000/admin, password `admin123` (local only). Data is stored in `./.data`.

## Where content lives

Once the database is connected, edit everything from `/admin`. The files below are the initial seed and the fallback:

| What | File |
|---|---|
| Phone, email, WhatsApp, address, hours, clusters | `src/lib/site.ts` |
| Services (text, scope, deliverables, FAQs) | `src/lib/services.ts` |
| Materials catalogue (categories & items) | `src/lib/catalog.ts` |
| Logo / icons | `public/brand/logo.png`, `src/app/icon.png` |

## Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres. Added automatically by Vercel → Storage → Neon. Tables are created and seeded on first use. |
| `ADMIN_PASSWORD` | Password for `/admin`. Use a long one. |
| `SESSION_SECRET` | Random string, 32+ characters, used to sign login cookies. |
| `CRON_SECRET` | Random string; Vercel sends it to the daily reminder job (`/api/cron/reminders`). |
| `NEXT_PUBLIC_SITE_URL` | Live URL, e.g. `https://nexgenpharma.in` (used for SEO, sitemap) |
| `RESEND_API_KEY` | Enables enquiry/RFQ emails (free at resend.com). Without it, forms still work and offer WhatsApp hand-off. |
| `ENQUIRY_TO` | Inbox for leads (comma-separated). Defaults to the Gmail in `site.ts`. |
| `ENQUIRY_FROM` | Sender, e.g. `Nexgen Website <website@nexgenpharma.in>` (after verifying the domain in Resend). |

## Deploy to Vercel (free)

```bash
npx vercel login
npx vercel --prod      # run inside this folder; accept defaults
```

Or push to GitHub and import the repo at vercel.com/new.

## Custom domain (GoDaddy)

1. Buy the domain on GoDaddy. **Skip** GoDaddy's SSL and "website security" add-ons: Vercel issues free, auto-renewing HTTPS.
2. Vercel → Project → Settings → Domains → add `nexgenpharma.in` and `www.nexgenpharma.in`.
3. GoDaddy → DNS: `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com` (use the exact values Vercel shows).
4. Business email: Zoho Mail (free tier) or Google Workspace. Add their MX/TXT records in GoDaddy DNS. Then verify the domain in Resend and set `ENQUIRY_FROM`.
5. Set `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy. Submit `/sitemap.xml` in Google Search Console.
