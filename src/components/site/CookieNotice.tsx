"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useConsent, useHydrated } from "@/lib/consent";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Asks about the embedded map, and nothing else.
 *
 * Deliberately not a blocking modal. The site sets no cookies of its own and
 * its analytics are cookieless, so there is nothing here that justifies
 * standing between a visitor and the page — the only consequence of ignoring
 * this is that the map on the Visit page stays unloaded.
 */
export function CookieNotice() {
  const [consent, decide] = useConsent();
  const hydrated = useHydrated();

  return (
    <AnimatePresence>
      {hydrated && consent === "unset" && (
        <motion.div
          key="cookie-notice"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="region"
          aria-label="Cookie notice"
          className="pointer-events-auto border-t border-hairline bg-canvas/95 backdrop-blur-md"
        >
          <Container className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm leading-relaxed text-body">
              We use no tracking cookies. The only one is Google&rsquo;s, if you
              choose to load the map on our{" "}
              <Link
                href="/contact"
                className="text-primary underline underline-offset-4"
              >
                Visit
              </Link>{" "}
              page — so we ask first.{" "}
              <Link
                href="/privacy"
                className="text-primary underline underline-offset-4"
              >
                More detail
              </Link>
              .
            </p>

            <div className="flex shrink-0 gap-2">
              <Button
                variant="secondary"
                onClick={() => decide("declined")}
                className="flex-1 sm:flex-none"
              >
                No thanks
              </Button>
              <Button
                onClick={() => decide("granted")}
                className="flex-1 sm:flex-none"
              >
                Allow the map
              </Button>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
