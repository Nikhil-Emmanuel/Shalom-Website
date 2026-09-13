import type { Metadata } from "next";
import { getContent } from "@/content";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/media/SafeImage";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "How Shalom Children's Home began-a promise made in Bangalore in 1978, and a registered children's home since 2008.",
};

export default function AboutPage() {
  const { story, timeline, values, founder, gallery } = getContent();
  const portrait = gallery.find((p) => p.slug === "independence-day-chief-guest");

  return (
    <>
      <PageHeader eyebrow="Our story" title={story.title} />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <Reveal>
            {story.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="mb-6 text-lg leading-relaxed text-body last:mb-0"
              >
                {paragraph}
              </p>
            ))}
            <p className="mt-10 border-l-2 border-primary pl-5 font-display text-xl leading-snug text-ink">
              {founder.bio}
            </p>
            <p className="mt-4 pl-5 text-sm text-muted">
              {founder.name}-{founder.role}
            </p>
          </Reveal>

          {portrait && (
            <Reveal className="relative aspect-3/4 overflow-hidden rounded-2xl shadow-soft lg:sticky lg:top-24 lg:self-start">
              <SafeImage photo={portrait} sizes="(max-width: 1024px) 92vw, 40vw" />
            </Reveal>
          )}
        </Container>
      </section>

      <section className="border-y border-hairline bg-surface-soft py-20 sm:py-24">
        <Container>
          <h2 className="font-display text-[length:var(--text-display-md)] font-semibold text-ink">
            How we got here
          </h2>
          <Reveal stagger className="mt-12 grid gap-10 sm:grid-cols-3">
            {timeline.map((entry) => (
              <div key={entry.year} className="border-t-2 border-primary pt-5">
                <p className="font-display text-3xl font-semibold text-primary">
                  {entry.year}
                </p>
                <h3 className="mt-3 font-sans text-base font-semibold text-ink">
                  {entry.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {entry.body}
                </p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <h2 className="font-display text-[length:var(--text-display-md)] font-semibold text-ink">
            What we hold to
          </h2>
          <Reveal stagger className="mt-12 grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-hairline p-7"
              >
                <h3 className="font-display text-xl font-semibold text-ink">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-body">{value.body}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-hairline py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Icon name="ShieldCheck" className="size-4 text-primary" />
              Registered {site.registration.date}
            </span>
            <span>Registration {site.registration.number}</span>
            {site.registration.taxExemption && (
              <span>
                {site.registration.taxExemption} tax exemption available
              </span>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
