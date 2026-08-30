import type { Stat } from "@/content/schema";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="Shalom in numbers" className="border-y border-hairline bg-surface-soft py-16 sm:py-20">
      <Container>
        <Reveal stagger className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-[length:var(--text-display-lg)] leading-none font-semibold text-primary">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-4 font-sans text-base font-semibold text-ink">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.detail}</p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
