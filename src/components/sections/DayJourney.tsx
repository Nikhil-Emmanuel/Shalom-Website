"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ResolvedJourneyStop } from "@/content";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/media/SafeImage";
import { useIsomorphicLayoutEffect } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * "A Day at Shalom"-the signature interaction.
 *
 * Progressive enhancement, deliberately: the server renders a plain grid in
 * which every panel is reachable. Only when the viewport is wide enough do we
 * switch to the pinned horizontal track-narrow viewports keep the grid
 * because pinning a horizontal scroll there is bad UX regardless of motion
 * preference, not because of the OS-level reduced-motion setting, which no
 * longer gates this (see lib/motion.ts).
 *
 * This ordering matters. An earlier version applied the horizontal layout in
 * CSS and relied on the pin to scroll it-so when the pin did not run, half
 * the panels sat inside an overflow-hidden track with no way to reach them.
 * Enhancement must never be load-bearing for content.
 */
export function DayJourney({ stops }: { stops: ResolvedJourneyStop[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setEnhanced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const sectionEl = section.current;
    const trackEl = track.current;
    if (!enhanced || !sectionEl || !trackEl) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Measured on every refresh so a resize or a late-loading image cannot
      // leave the end point stale and clip the final panel.
      const distance = () => trackEl.scrollWidth - window.innerWidth;

      gsap.to(trackEl, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) {
              progress.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    }, sectionEl);

    // The layout just changed from grid to track; positions must be recomputed.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [enhanced, stops.length]);

  return (
    <section
      ref={section}
      aria-labelledby="journey-heading"
      className={cn(
        "relative bg-surface-deep text-on-dark",
        enhanced ? "h-screen overflow-hidden" : "py-20 sm:py-24",
      )}
    >
      <div className={cn(enhanced && "flex h-full flex-col justify-center")}>
        <Container className={cn(enhanced && "shrink-0")}>
          <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
            A day at Shalom
          </p>
          <h2
            id="journey-heading"
            className="mt-4 max-w-2xl font-display text-[length:var(--text-display-md)] leading-tight font-semibold text-on-dark"
          >
            From the seven o&rsquo;clock bus to the lights going down.
          </h2>
        </Container>

        <div
          ref={track}
          className={cn(
            "mt-10 md:mt-14",
            enhanced
              ? "flex items-start gap-10 pl-[max(2rem,calc((100vw-72rem)/2+2rem))] will-change-transform"
              : "mx-auto grid w-full max-w-6xl gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3",
          )}
        >
          {stops.map((stop, index) => (
            <article
              key={stop.id}
              className={cn(enhanced && "w-[24rem] shrink-0 lg:w-[27rem]")}
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-surface-deep-soft">
                <SafeImage
                  photo={stop.photo}
                  sizes="(max-width: 768px) 92vw, 27rem"
                />
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-sans text-xs font-semibold tracking-[0.12em] text-accent uppercase">
                  {stop.time}
                </span>
                <span aria-hidden className="text-xs text-on-dark-muted">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(stops.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-on-dark">
                {stop.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-dark-muted">
                {stop.body}
              </p>
            </article>
          ))}

          {/* Trailing gutter so the final panel clears the right edge */}
          {enhanced && <div aria-hidden className="w-[8vw] shrink-0" />}
        </div>

        {enhanced && (
          <div aria-hidden className="mt-16 h-px w-full bg-on-dark/15">
            <div ref={progress} className="h-px origin-left scale-x-0 bg-accent" />
          </div>
        )}
      </div>
    </section>
  );
}
