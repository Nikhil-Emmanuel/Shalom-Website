import { Container } from "@/components/ui/Container";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="border-b border-hairline bg-surface-soft py-16 sm:py-20">
      <Container>
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-[length:var(--text-display-lg)] leading-[1.08] font-semibold tracking-[-0.015em] text-ink">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body">
            {intro}
          </p>
        )}
      </Container>
    </section>
  );
}
