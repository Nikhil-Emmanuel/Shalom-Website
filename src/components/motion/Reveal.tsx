"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Seconds to wait after the element enters the viewport. */
  delay?: number;
  /** Stagger direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  y?: number;
};

/**
 * Scroll-triggered entrance, built on IntersectionObserver and CSS transitions
 * rather than GSAP ScrollTrigger.
 *
 * This used to use ScrollTrigger and could strand content at opacity 0 forever:
 * trigger positions are measured at creation, and if they were computed against
 * a shorter pre-image document and never refreshed, a `once` trigger simply
 * never fired. Cards flashed in and vanished. IntersectionObserver reports the
 * element's initial state as soon as it is observed, so there is no equivalent
 * failure — and it needs no ticker, so it is unaffected by rAF throttling.
 *
 * Content is visible in the markup. The hiding class is only ever applied by
 * this effect, so no-JS, a crawler, or a hidden tab all see the finished state.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  stagger = false,
  y = 28,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Hidden tab: leave the content alone. Nothing is scheduled to reveal it.
    if (document.hidden) return;

    const targets = (
      stagger ? Array.from(el.children) : [el]
    ) as HTMLElement[];

    // Applied in a layout effect, so it lands before paint — no flash of the
    // final state followed by it disappearing.
    targets.forEach((target, index) => {
      target.dataset.reveal = "";
      target.style.setProperty(
        "--reveal-delay",
        `${delay + (stagger ? index * 0.08 : 0)}s`,
      );
      target.style.setProperty("--reveal-y", `${y}px`);
    });

    const show = () => targets.forEach((t) => (t.dataset.revealIn = ""));

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        show();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);

    // Belt and braces: whatever happens, this content becomes visible.
    const failsafe = window.setTimeout(show, 3000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
      targets.forEach((target) => {
        delete target.dataset.reveal;
        delete target.dataset.revealIn;
        target.style.removeProperty("--reveal-delay");
        target.style.removeProperty("--reveal-y");
      });
    };
  }, [delay, stagger, y]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
