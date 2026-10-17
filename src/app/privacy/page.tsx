import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" />
      <section className="container-x max-w-3xl space-y-6 py-16 leading-relaxed text-muted">
        <p>
          {site.name} (“we”, “us”) respects your privacy. This page explains what information we collect through this
          website and how we use it.
        </p>
        <h2 className="text-xl font-bold text-ink">Information we collect</h2>
        <p>
          When you submit an enquiry or request for quotation, we collect the details you provide: your name, company,
          email address, phone number, plant location and requirement. Your quote basket is stored only in your own
          browser until you submit it.
        </p>
        <h2 className="text-xl font-bold text-ink">How we use it</h2>
        <p>
          We use these details only to respond to your request, prepare quotations and provide the services you ask
          for. We do not sell or rent your information to anyone.
        </p>
        <h2 className="text-xl font-bold text-ink">Contact</h2>
        <p>
          For any privacy question, or to ask us to delete your information, email{" "}
          <a className="font-semibold text-brand-600" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </section>
    </>
  );
}
