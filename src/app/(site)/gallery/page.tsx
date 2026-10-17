import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { PageHero, Button } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";
import { getMedia } from "@/lib/content";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Inside Nexgen's calibration lab, CNC machining and SS fabrication facilities, and work at client sites.",
};

export default async function GalleryPage() {
  const photos = await getMedia("gallery");
  const groups = [...new Set(photos.map((p) => p.category || "Other"))];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Our facilities and work, as they are."
        body="The calibration lab, CNC and fabrication shop floors, and jobs delivered at client sites."
      />
      <section className="container-x py-16 sm:py-20">
        {photos.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-line bg-canvas p-12 text-center">
            <Camera className="mx-auto size-10 text-brand-300" aria-hidden />
            <p className="mt-4 font-semibold">Photos coming soon</p>
            <p className="mt-1 text-sm text-muted">We&apos;re photographing our facilities. Meanwhile, see what we can do.</p>
            <div className="mt-6">
              <Button href="/capabilities" variant="outline" arrow>
                Our capabilities
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-14">
            {groups.map((g) => (
              <div key={g}>
                <h2 className="text-2xl font-bold">{g}</h2>
                <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3">
                  {photos
                    .filter((p) => (p.category || "Other") === g)
                    .map((p) => (
                      <figure key={p.id} className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-line bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/media/${p.file_id}`} alt={p.caption || g} loading="lazy" className="w-full" />
                        {p.caption && <figcaption className="px-4 py-3 text-sm text-muted">{p.caption}</figcaption>}
                      </figure>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
