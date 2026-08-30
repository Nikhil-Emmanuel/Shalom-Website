import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  const { address, contact, social, registration, visiting } = site;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-hairline bg-surface-soft">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-xl font-semibold text-ink">
            {site.name}
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">{site.tagline}</p>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] text-muted uppercase">
            Find us
          </h2>
          <address className="mt-4 text-sm not-italic text-body">
            {address.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block">
              {address.locality}
              {address.postalCode ? ` — ${address.postalCode}` : ""}
            </span>
            <span className="block">{address.region}</span>
          </address>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] text-muted uppercase">
            Get in touch
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {contact.emails.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 py-2 -my-1 text-body underline-offset-4 hover:text-primary hover:underline"
                >
                  <Icon name="Mail" className="size-4 shrink-0" />
                  {email}
                </a>
              </li>
            ))}
            {contact.phone && (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="text-body underline-offset-4 hover:text-primary hover:underline"
                >
                  {contact.phone}
                </a>
              </li>
            )}
            {social.instagram && (
              <li>
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 py-2 -my-1 text-body underline-offset-4 hover:text-primary hover:underline"
                >
                  Instagram
                  <Icon name="ArrowUpRight" className="size-3.5" />
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.12em] text-muted uppercase">
            Visiting
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-body">
            {visiting.slots.map((slot) => (
              <li key={slot} className="flex items-start gap-2">
                <Icon name="Clock" className="mt-0.5 size-4 shrink-0" />
                {slot}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-hairline">
        <Container className="flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <Icon name="ShieldCheck" className="size-4 shrink-0" />
            Registered children&rsquo;s home · {registration.number}
            {registration.taxExemption
              ? ` · ${registration.taxExemption} tax exemption`
              : ""}
          </p>
          <p>
            © {year} {site.name}.{" "}
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              Child protection &amp; privacy
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
