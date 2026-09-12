"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect, motionLevel, whenVisible } from "@/lib/motion";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Counts up when scrolled into view. The final value is rendered on the server,
 * so it is correct for search engines, screen readers and reduced-motion users;
 * the animation only rewrites it afterwards.
 */
export function Counter({ value, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    // A number ticking up changes text, it does not move anything-safe to
    // keep when motion is reduced, just quicker.
    const duration = motionLevel() === "reduced" ? 0.9 : 1.6;

    let ctx: gsap.Context | undefined;

    const cancel = whenVisible(() => {
      ctx = gsap.context(() => {
        const counter = { n: 0 };
        gsap.to(counter, {
          n: value,
          duration,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.n)}${suffix}`;
          },
        });
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
