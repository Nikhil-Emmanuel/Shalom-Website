import type { Metadata } from "next";
import { getContent } from "@/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/media/GalleryGrid";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from Shalom Children's Home in Hennur, Bangalore — school mornings, meals, football, health camps and celebrations.",
};

export default function GalleryPage() {
  const { gallery } = getContent();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="The everyday, mostly."
        intro="School runs, lunch queues, football practice and the occasional night with fairy lights."
      />

      <section className="py-16 sm:py-20">
        <Container>
          <GalleryGrid photos={gallery} />

          <p className="mt-14 flex max-w-2xl items-start gap-3 rounded-xl border border-hairline bg-surface-soft p-5 text-sm leading-relaxed text-muted">
            <Icon name="ShieldCheck" className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              We publish photographs that do not identify the children in our
              care, and we never publish their names. This is a deliberate
              safeguarding choice, and it is why you will see more wide shots
              here than faces.
            </span>
          </p>
        </Container>
      </section>
    </>
  );
}
