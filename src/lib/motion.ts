"use client";

import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect warns during SSR; fall back to useEffect on the server. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Read the OS-level motion preference.
 *
 * Note this is commonly on without people realising — Windows turning off
 * "Show animations", or macOS "Reduce motion" — so treating it as an on/off
 * switch for all animation makes the site look dead for a lot of visitors.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Always "full" — deliberately not derived from `prefersReducedMotion()`.
 *
 * This site used to drop to opacity-only animation and disable parallax,
 * pinning and the "A Day at Shalom" scroll journey whenever the OS-level
 * motion preference was on — which, per instruction, is not what this site
 * should do: animation should run at full richness on any device capable of
 * rendering it, regardless of that accessibility toggle. `prefersReducedMotion`
 * is kept below as an honest read of the media query in case a future,
 * specific decision needs it — it is just no longer wired to this gate.
 */
export type MotionLevel = "full" | "reduced";

export function motionLevel(): MotionLevel {
  return "full";
}

/**
 * Run an animation setup only while the document is actually visible.
 *
 * Browsers suspend requestAnimationFrame in hidden tabs, so GSAP timelines do
 * not advance. Since our entrance animations start from `opacity: 0`, building
 * them in a hidden tab leaves the content invisible with nothing scheduled to
 * reveal it. Deferring until the page is visible means the untouched, visible
 * markup is what a hidden tab (or a crawler, or a broken script) is left with.
 *
 * Returns a cleanup function that cancels the pending listener.
 */
export function whenVisible(run: () => void): () => void {
  if (typeof document === "undefined") return () => {};

  if (!document.hidden) {
    run();
    return () => {};
  }

  const onVisibilityChange = () => {
    if (document.hidden) return;
    document.removeEventListener("visibilitychange", onVisibilityChange);
    run();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  return () => document.removeEventListener("visibilitychange", onVisibilityChange);
}

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
} as const;

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const;
