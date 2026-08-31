"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Drives Lenis smooth scrolling and hands scroll control to GSAP's ticker so
 * ScrollTrigger stays in sync with the eased scroll position. Without this,
 * pinned sections drift from the pointer.
 *
 * Runs unconditionally — the OS-level reduced-motion preference no longer
 * gates this, per instruction (see lib/motion.ts).
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Images and webfonts settle after hydration and change section heights.
    // This MUST happen whatever the motion preference: ScrollTrigger positions
    // computed against a shorter, pre-image document can leave a `once` trigger
    // that never matches, stranding its target at opacity 0. Keeping it below
    // the reduced-motion return did exactly that.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    const detachRefresh = () => window.removeEventListener("load", refresh);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      detachRefresh();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
