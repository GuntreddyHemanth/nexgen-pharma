import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BellRing, FileCheck2, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { currentClient } from "@/lib/auth";
import { site, whatsappLink } from "@/lib/site";
import { clientLogin } from "../actions";

export const metadata: Metadata = { title: "Client Login", robots: { index: false } };

export default async function PortalLogin() {
  if (await currentClient().catch(() => null)) redirect("/portal");
  return (
    <section className="relative overflow-hidden bg-brand-950 pb-20 pt-32 sm:pt-40">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_25%,transparent_70%)]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <div className="text-white">
          <p className="eyebrow !text-leaf-300">Client portal</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">Your calibration records, always at hand.</h1>
          <ul className="mt-8 space-y-4 text-brand-100/85">
            {[
              [FileCheck2, "Download every calibration certificate, any time"],
              [BellRing, "Automatic email reminders before calibration falls due"],
              [ShieldCheck, "Audit-ready: see what's valid, due soon or overdue"],
            ].map(([I, t]) => {
              const Ico = I as typeof FileCheck2;
              return (
                <li key={t as string} className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-leaf-300">
                    <Ico className="size-5" aria-hidden />
                  </span>
                  {t as string}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card p-7 sm:p-10">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Use the login shared by the Nexgen team.</p>
          <div className="mt-7">
            <LoginForm action={clientLogin} />
          </div>
          <p className="mt-6 text-sm text-muted">
            No login yet?{" "}
            <a
              href={whatsappLink("Hello Nexgen Pharma, please set up a client portal login for our company.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600"
            >
              Request access
            </a>{" "}
            or call {site.phones[0].display}.
          </p>
        </div>
      </div>
    </section>
  );
}
