"use client";

import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect warns during SSR; fall back to useEffect on the server. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Read the OS-level motion preference.
 *
 * globals.css already neutralises CSS transitions when this is set, but GSAP
 * timelines run outside CSS — every animation module checks this before it
 * builds a timeline, and renders the final state instead.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
