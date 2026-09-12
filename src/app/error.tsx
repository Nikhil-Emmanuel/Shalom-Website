"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";

/**
 * Route-level error boundary.
 *
 * A 404 is expected; this is for the unexpected. Without it Next falls back to
 * an unstyled default screen, which on a site asking strangers for money reads
 * as broken rather than as a hiccup-so it keeps the site's own shell and
 * always offers a way to reach a human.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the host's logs. The digest is the only way to tie a report
    // from a visitor back to the actual server-side stack trace.
    console.error("[app error]", error.digest ?? "", error);
  }, [error]);

  return (
    <section className="py-24 sm:py-32">
      <Container size="narrow">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Something went wrong
        </p>
        <h1 className="mt-5 font-display text-[length:var(--text-display-lg)] leading-[1.08] font-semibold tracking-[-0.015em] text-ink">
          That did not load properly.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-body">
          The fault is ours, not yours. Trying again usually sorts it-and if
          you were part-way through sending us a message, please do get in touch
          directly so it is not lost.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" onClick={reset}>
            Try again
            <Icon name="ArrowRight" className="size-4" />
          </Button>
          <ButtonLink href="/" variant="secondary" size="lg">
            Back to the home page
          </ButtonLink>
        </div>

        <p className="mt-12 text-sm text-muted">
          Email{" "}
          <a
            href={`mailto:${site.contact.emails[0]}`}
            className="text-primary underline underline-offset-4"
          >
            {site.contact.emails[0]}
          </a>
          {error.digest ? (
            <>
              {" "}
              and quote reference{" "}
              <code className="rounded bg-surface-card px-1.5 py-0.5 text-xs text-body">
                {error.digest}
              </code>
            </>
          ) : null}
          .
        </p>
      </Container>
    </section>
  );
}
