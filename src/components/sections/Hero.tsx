"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Photo } from "@/content/schema";
import { hero } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SafeImage } from "@/components/media/SafeImage";
import { HeroMotif } from "@/components/sections/HeroMotif";
import { Icon } from "@/components/ui/Icon";
import { useIsomorphicLayoutEffect, motionLevel, whenVisible } from "@/lib/motion";

/**
 * Editorial hero: a serif headline set against a parallaxing cluster of three
 * photographs. The headline animates in line-by-line on load; the images drift
 * at different rates on scroll.
 */
export function Hero({ photos }: { photos: Photo[] }) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduced = motionLevel() === "reduced";
    let ctx: gsap.Context | undefined;

    let failsafe = 0;

    const cancel = whenVisible(() => {
      ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // The hero is the highest-stakes element on the site and this timeline
      // starts it at opacity 0. If it is ever interrupted — the tab is hidden
      // mid-flight, the ticker stalls — the whole hero would be left blank.
      // Jump to the end state if it has not finished in a generous window.
      failsafe = window.setTimeout(() => {
        if (tl.progress() < 1) tl.progress(1);
      }, 4000);

      if (reduced) {
        // Same choreography and rhythm, expressed purely in opacity.
        tl.from("[data-hero-line]", { opacity: 0, duration: 0.6, stagger: 0.1 })
          .from(
            "[data-hero-fade]",
            { opacity: 0, duration: 0.5, stagger: 0.09 },
            "-=0.35",
          )
          .from(
            "[data-hero-photo]",
            { opacity: 0, duration: 0.7, stagger: 0.12 },
            "-=0.5",
          );
        return;
      }

      tl.from("[data-hero-line]", { yPercent: 110, duration: 1, stagger: 0.09 })
        .from(
          "[data-hero-fade]",
          { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 },
          "-=0.55",
        )
        .from(
          "[data-hero-photo]",
          { opacity: 0, scale: 1.06, duration: 1.1, stagger: 0.12 },
          "-=0.9",
        );

      // Each frame drifts at its own rate, which reads as depth.
      gsap.utils.toArray<HTMLElement>("[data-hero-photo]").forEach((frame) => {
        const depth = Number(frame.dataset.depth ?? 1);
        gsap.to(frame, {
          yPercent: -12 * depth,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
      }, el);
    });

    return () => {
      cancel();
      window.clearTimeout(failsafe);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden pt-16 pb-20 sm:pt-24 lg:pt-28 lg:pb-32">
      {/* Warm wash behind the type, keeps the cream from reading as flat white */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 size-[36rem] rounded-full bg-accent/10 blur-3xl"
      />

      <HeroMotif />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div>
          <p
            data-hero-fade
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-primary uppercase"
          >
            <Icon name="MapPin" className="size-4" />
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-[length:var(--text-display-xl)] leading-[1.03] font-semibold tracking-[-0.02em] text-ink">
            {hero.headline.split("\n").map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span data-hero-line className="block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-hero-fade
            className="mt-7 max-w-xl text-lg leading-relaxed text-body"
          >
            {hero.body}
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <Icon name="ArrowRight" className="size-4" />
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="secondary"
              size="lg"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        {/* Photo cluster — hidden from AT, it is decorative here; the gallery
            page carries the same images with full captions. */}
        <div aria-hidden className="relative">
          <div className="grid grid-cols-5 grid-rows-6 gap-3 sm:gap-4 h-[26rem] sm:h-[32rem] lg:h-[34rem]">
            {photos[0] && (
              <figure
                data-hero-photo
                data-depth="1"
                className="relative col-span-3 row-span-4 overflow-hidden rounded-2xl shadow-lift"
              >
                <SafeImage
                  photo={photos[0]}
                  priority
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
              </figure>
            )}
            {photos[1] && (
              <figure
                data-hero-photo
                data-depth="2.2"
                className="relative col-span-2 col-start-4 row-span-3 row-start-2 overflow-hidden rounded-2xl shadow-lift"
              >
                <SafeImage
                  photo={photos[1]}
                  sizes="(max-width: 1024px) 40vw, 20vw"
                />
              </figure>
            )}
            {photos[2] && (
              <figure
                data-hero-photo
                data-depth="0.4"
                className="relative col-span-3 col-start-2 row-span-2 row-start-5 overflow-hidden rounded-2xl shadow-lift"
              >
                <SafeImage
                  photo={photos[2]}
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
              </figure>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
