"use client";

import { useSyncExternalStore } from "react";

/**
 * Consent for the one third party that can set cookies here: the embedded
 * Google map on the Visit page.
 *
 * The site's own analytics are cookieless and carry no identifier, so they need
 * no consent and are not covered by this. That is the whole reason this is a
 * single narrow question rather than the usual wall of toggles — a banner that
 * asks about things the site does not actually do is theatre, and it trains
 * people to dismiss the ones that matter.
 *
 * Until consent is given the map iframe is never mounted, so no request reaches
 * Google at all. Asking and then loading it anyway would be worse than not
 * asking.
 */
export const CONSENT_KEY = "shalom:map-consent";
const CONSENT_EVENT = "shalom:map-consent-change";

export type Consent = "granted" | "declined" | "unset";

export function readConsent(): Consent {
  if (typeof window === "undefined") return "unset";
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "declined" ? value : "unset";
}

export function setConsent(value: Exclude<Consent, "unset">): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  // Same-tab listeners: the native `storage` event only fires in OTHER tabs,
  // so the banner and the map would not see each other's updates without this.
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Server and first client render agree on "unset", so hydration matches. */
const serverSnapshot = (): Consent => "unset";

const noopSubscribe = () => () => {};

/**
 * False during SSR and the hydration render, true immediately after.
 *
 * localStorage cannot be read on the server, so anything that depends on it
 * must render its "unknown" state first. Without this the cookie notice would
 * appear on every single page load for people who already answered it, then
 * animate itself away once the stored value was read — which looks broken and
 * is precisely the nagging these banners are hated for.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useConsent(): [Consent, (value: Exclude<Consent, "unset">) => void] {
  // useSyncExternalStore rather than useState + useEffect: localStorage is an
  // external store, and this is the primitive built for exactly that — it gets
  // the SSR snapshot right and re-reads without a render-then-correct flash.
  const consent = useSyncExternalStore(subscribe, readConsent, serverSnapshot);
  return [consent, setConsent];
}
