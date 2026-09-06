"use client";

import { useLinkStatus } from "next/link";

/**
 * Thin progress bar shown while a navigation is in flight.
 *
 * Rendered inside a <Link>, which is what `useLinkStatus` requires — it reports
 * the pending state of its nearest Link ancestor. Only the link actually being
 * navigated to reports pending, so despite one of these sitting in every nav
 * link, at most one bar is ever on screen.
 *
 * This replaces an earlier route-level `loading.tsx`. That created a Suspense
 * boundary around every page and, on this Next version, left the fallback and
 * the real page mounted at the same time — tiles never rendered and nothing
 * hydrated, in production as well as dev. Since every page here is prerendered
 * there is no data to wait on anyway; navigation feedback is the only loading
 * state a static site actually needs.
 */
export function NavPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span
      aria-hidden
      className="fixed inset-x-0 top-0 z-100 h-0.5 origin-left animate-[nav-progress_1.2s_ease-out_infinite] bg-primary"
    />
  );
}
