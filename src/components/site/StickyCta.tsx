"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Persistent call to action on small screens.
 *
 * Only appears once the visitor has scrolled past roughly the first viewport,
 * so it never sits on top of the hero's own buttons — a second identical CTA
 * competing with the first is the thing that makes these look bolted on.
 *
 * Hidden entirely on /get-involved and /contact: on those pages the real form
 * is the point, and a floating shortcut to the page you are already reading is
 * just an obstruction over the content.
 */
const HIDDEN_ON = ["/get-involved", "/contact"];

export function StickyCta() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = past && !HIDDEN_ON.includes(pathname);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="sticky-cta"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          // pb keeps it clear of the iPhone home indicator.
          className="pointer-events-auto border-t border-hairline bg-canvas/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
          <div className="flex items-center gap-3">
            <p className="min-w-0 flex-1 text-sm leading-snug text-body">
              <span className="font-medium text-ink">Thirty children</span> are
              counting on people like you.
            </p>
            <ButtonLink href="/get-involved" className="shrink-0">
              Help
              <Icon name="ArrowRight" className="size-4" />
            </ButtonLink>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
