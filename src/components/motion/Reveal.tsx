"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect, motionLevel, whenVisible } from "@/lib/motion";
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
 * Scroll-triggered entrance. The element starts hidden via GSAP (not CSS) so
 * that when motion is reduced — or JS fails — the content is simply visible.
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

    gsap.registerPlugin(ScrollTrigger);
    const reduced = motionLevel() === "reduced";
    let ctx: gsap.Context | undefined;

    const cancel = whenVisible(() => {
      ctx = gsap.context(() => {
        const targets = stagger ? Array.from(el.children) : el;

        gsap.from(targets, {
          opacity: 0,
          // Fade only when movement is unwelcome; never travel the screen.
          y: reduced ? 0 : y,
          duration: reduced ? 0.5 : 0.7,
          delay,
          ease: "power3.out",
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }, el);
    });

    return () => {
      cancel();
      ctx?.revert();
    };
  }, [delay, stagger, y]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
