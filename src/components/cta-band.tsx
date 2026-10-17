import { MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { Button } from "./ui";
import { Reveal } from "./reveal";

export function CtaBand({
  title = "Audit coming up? Equipment due for calibration?",
  body = "Tell us what you need. We'll come back with a plan, a timeline and a clear quote, usually within one working day.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="container-x py-20 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 px-6 py-14 text-white sm:px-12 lg:px-16">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" />
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-leaf-500/25 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
              <p className="mt-4 max-w-xl text-brand-100/85">{body}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button href="/contact" variant="leaf" arrow>
                Request a quote
              </Button>
              <Button
                href={whatsappLink("Hello Nexgen Pharma, I'd like to discuss a requirement.")}
                variant="ghost"
                external
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp {site.phones[0].display}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
