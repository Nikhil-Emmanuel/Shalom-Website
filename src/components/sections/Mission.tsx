"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mission } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { useIsomorphicLayoutEffect, whenVisible } from "@/lib/motion";

/**
 * Scrubbed word-by-word reveal: the lead sentence brightens as the section
 * passes through the viewport. Words are pre-split in the markup so the text is
 * fully present for search engines and screen readers.
 */
export function Mission() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    // Opacity only-nothing moves-so this runs at both motion tiers.
    let ctx: gsap.Context | undefined;

    const cancel = whenVisible(() => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-word]",
          // Floor kept legible: if the scrub never updates, this text must
          // still be readable rather than a ghost.
          { opacity: 0.35 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.5,
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} className="py-24 sm:py-32">
      <Container size="narrow" className="text-center">
        <p className="font-display text-[length:var(--text-display-md)] leading-[1.25] font-semibold text-ink">
          {mission.lead.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} data-word className="inline-block">
              {word}&nbsp;
            </span>
          ))}
        </p>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-body">
          {mission.body}
        </p>
      </Container>
    </section>
  );
}
