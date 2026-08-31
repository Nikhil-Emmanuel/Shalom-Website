"use client";

import { useCallback, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useAnimate, useInView, stagger } from "framer-motion";
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

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.7;
const STAGGER_STEP = 0.08;

/**
 * Scroll-triggered entrance, driven by Framer Motion.
 *
 * Uses the imperative `useAnimate` scope with a `"& > *"` selector rather than
 * declarative `<motion.div>` children. That is deliberate: every staggered call
 * site here is a CSS grid whose direct children ARE the grid items, so wrapping
 * each child in a motion element would make the wrapper the grid item and
 * silently break card stretching and aspect ratios. Animating the existing
 * children in place leaves the DOM exactly as authored.
 *
 * Content is visible in the markup and only ever hidden by the effect below, so
 * no-JS, crawlers and hidden tabs are all left with the finished state. That
 * ordering matters — a declarative `initial={{ opacity: 0 }}` would be
 * server-rendered as inline `opacity: 0` and leave content invisible if
 * hydration never happened.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  stagger: staggered = false,
  y = 28,
}: RevealProps) {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, margin: "0px 0px -8% 0px" });
  const revealed = useRef(false);

  const targets = useCallback(
    () => (staggered ? "& > *" : scope.current),
    [staggered, scope],
  );

  // Applied in a layout effect so the hidden state lands before paint — no
  // flash of the final state followed by it disappearing.
  useIsomorphicLayoutEffect(() => {
    // Hidden tab: leave the content alone. IntersectionObserver does not fire
    // while a tab is hidden, so nothing would be scheduled to reveal it again.
    if (!scope.current || document.hidden) return;
    animate(targets(), { opacity: 0, y }, { duration: 0 });
  }, []);

  const reveal = useCallback(
    (duration: number) => {
      if (revealed.current || !scope.current) return;
      revealed.current = true;
      animate(
        targets(),
        { opacity: 1, y: 0 },
        {
          duration,
          ease: EASE,
          delay: staggered
            ? stagger(STAGGER_STEP, { startDelay: delay })
            : delay,
        },
      );
    },
    [animate, targets, staggered, delay, scope],
  );

  useEffect(() => {
    if (inView) reveal(DURATION);
  }, [inView, reveal]);

  // Belt and braces: whatever happens, this content becomes visible.
  useEffect(() => {
    const id = window.setTimeout(() => reveal(0.3), 3000);
    return () => window.clearTimeout(id);
  }, [reveal]);

  return (
    <Tag ref={scope} className={cn(className)}>
      {children}
    </Tag>
  );
}
