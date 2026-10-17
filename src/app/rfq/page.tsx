import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { RfqBasket } from "@/components/rfq-basket";

export const metadata: Metadata = {
  title: "Quote Basket",
  description: "Review your selected materials and send a request for quotation to Nexgen Pharma Enterprises.",
  robots: { index: false },
};

export default function RfqPage() {
  return (
    <>
      <PageHero
        eyebrow="Request for quotation"
        title="Your quote basket"
        body="Set quantities and add notes for grade, size or make. We'll reply with a consolidated quotation."
      />
      <RfqBasket />
    </>
  );
}
