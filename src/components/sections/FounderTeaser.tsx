import Link from "next/link";
import type { Photo } from "@/content/schema";
import { founder } from "@/content/site";
import { story } from "@/content/about";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/media/SafeImage";
import { Reveal } from "@/components/motion/Reveal";

export function FounderTeaser({ photo }: { photo: Photo | null }) {
  return (
    <section className="border-y border-hairline bg-surface-soft py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {photo && (
          <Reveal className="relative aspect-4/3 overflow-hidden rounded-2xl shadow-soft">
            <SafeImage
              photo={photo}
              sizes="(max-width: 1024px) 92vw, 46vw"
            />
          </Reveal>
        )}

        <Reveal>
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Our story
          </p>
          <h2 className="mt-5 font-display text-[length:var(--text-display-md)] leading-tight font-semibold text-ink">
            {story.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-body">
            {story.paragraphs[0]}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-body">
            {story.paragraphs[1]}
          </p>
          <p className="mt-6 text-sm text-muted">
            {founder.name}-{founder.role}
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 py-3 -mb-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Read the whole story
            <Icon name="ArrowRight" className="size-4" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
