import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist. Find your way back to Shalom Children's Home in Hennur, Bangalore.",
  // A 404 should never be indexed, and never dilute the pages that should be.
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: "/about", label: "About the home", hint: "Who we are, and how we began" },
  { href: "/programs", label: "What we do", hint: "Care, schooling, meals, health" },
  { href: "/get-involved", label: "Ways to help", hint: "Volunteer, sponsor, give" },
  { href: "/contact", label: "Visit us", hint: "Where we are and when to come" },
];

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container size="narrow">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          404
        </p>
        <h1 className="mt-5 font-display text-[length:var(--text-display-lg)] leading-[1.08] font-semibold tracking-[-0.015em] text-ink">
          We could not find that page.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-body">
          It may have moved, or the link may have a typo in it. Everything on
          the site is a click away below.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" size="lg">
            Back to the home page
            <Icon name="ArrowRight" className="size-4" />
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            Get in touch
          </ButtonLink>
        </div>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-xl border border-hairline bg-canvas p-5 transition-colors duration-200 hover:border-primary/40 hover:bg-surface-soft"
              >
                <span className="flex items-center gap-2 font-medium text-ink">
                  {item.label}
                  <Icon
                    name="ArrowRight"
                    className="size-4 text-primary transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
                <span className="mt-1 text-sm text-muted">{item.hint}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm text-muted">
          Still stuck? Email{" "}
          <a
            href={`mailto:${site.contact.emails[0]}`}
            className="text-primary underline underline-offset-4"
          >
            {site.contact.emails[0]}
          </a>
          {site.contact.phone ? (
            <>
              {" "}
              or call{" "}
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="text-primary underline underline-offset-4"
              >
                {site.contact.phone}
              </a>
            </>
          ) : null}
          .
        </p>
      </Container>
    </section>
  );
}
