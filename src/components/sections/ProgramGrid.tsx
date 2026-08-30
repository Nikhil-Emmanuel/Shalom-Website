import Link from "next/link";
import type { ResolvedProgram } from "@/content";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SafeImage } from "@/components/media/SafeImage";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export function ProgramGrid({
  programs,
  heading,
  intro,
  showBody = false,
}: {
  programs: ResolvedProgram[];
  heading: string;
  intro?: string;
  showBody?: boolean;
}) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl font-display text-[length:var(--text-display-md)] leading-tight font-semibold text-ink">
            {heading}
          </h2>
          {intro && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">
              {intro}
            </p>
          )}
        </Reveal>

        <Reveal stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <article
              key={program.slug}
              className={cn(
                "group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-canvas",
                "transition-shadow duration-300 hover:shadow-lift",
              )}
            >
              {program.photo && (
                <div className="relative aspect-16/10 overflow-hidden bg-surface-card">
                  <SafeImage
                    photo={program.photo}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                  />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={program.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {program.summary}
                </p>
                {showBody && (
                  <p className="mt-4 text-sm leading-relaxed text-body">
                    {program.body}
                  </p>
                )}
              </div>
            </article>
          ))}
        </Reveal>

        {!showBody && (
          <div className="mt-7">
            {/* py/-my expands the tap area to 44px without shifting the layout */}
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 py-3 -my-3 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Read more about our work
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
