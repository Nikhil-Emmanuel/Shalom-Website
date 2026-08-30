"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "What we do" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Visit" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation. Adjusting state during render (rather than
  // in an effect) avoids a cascading re-render, and covers back/forward too.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Stop the page scrolling behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline/70 bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-base leading-none font-semibold tracking-[-0.01em] text-ink sm:text-lg"
        >
          {site.name}
          <span className="text-primary">.</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-primary"
                    : "text-body hover:bg-surface-soft hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/get-involved" className="hidden sm:inline-flex">
            Ways to help
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-ink hover:bg-surface-soft md:hidden"
          >
            <Icon name={open ? "X" : "Menu"} className="size-5" />
          </button>
        </div>
      </Container>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-hairline bg-canvas md:hidden"
        >
          <Container className="flex flex-col py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-base font-medium text-body hover:bg-surface-soft"
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/get-involved" className="mt-2 sm:hidden">
              Ways to help
            </ButtonLink>
          </Container>
        </nav>
      )}
    </header>
  );
}
