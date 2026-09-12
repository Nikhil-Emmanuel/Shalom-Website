import type { Involvement } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";

export function HelpBand({ involvements }: { involvements: Involvement[] }) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal className="rounded-3xl bg-surface-deep px-6 py-14 text-on-dark sm:px-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-[length:var(--text-display-md)] leading-tight font-semibold text-on-dark">
              The children need more than money.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-on-dark-muted">
              When we asked the home what it needs most, the first answer was
              not a number. It was people-turning up, staying in touch, and
              telling someone else about this place.
            </p>
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {involvements.map((item) => (
              <li key={item.slug}>
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-on-dark/10 text-accent">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-sans text-base font-semibold text-on-dark">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                  {item.summary}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <ButtonLink href="/get-involved" variant="onDark" size="lg">
              Ways to help
              <Icon name="ArrowRight" className="size-4" />
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
