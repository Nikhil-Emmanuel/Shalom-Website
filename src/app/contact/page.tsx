import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Visit us",
  description:
    "Shalom Children's Home, Sai Layout, Vadrapalaya, Horamavu Agara Road, Hennur, Bangalore. Visitors welcome on weekday evenings and weekend afternoons.",
};

export default function ContactPage() {
  const { address, contact, social, visiting } = site;

  return (
    <>
      <PageHeader
        eyebrow="Visit us"
        title="Come and see it for yourself."
        intro={visiting.note}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="space-y-10">
            <div>
              <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                Where we are
              </h2>
              <address className="mt-4 text-lg not-italic leading-relaxed text-body">
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
              <p className="mt-3 text-sm text-muted">
                Near Shirdi Sai Temple, Hennur Cross.
              </p>
            </div>

            <div>
              <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                When to come
              </h2>
              <ul className="mt-4 space-y-2.5">
                {visiting.slots.map((slot) => (
                  <li key={slot} className="flex items-start gap-2.5 text-body">
                    <Icon name="Clock" className="mt-1 size-4 shrink-0 text-primary" />
                    {slot}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-sans text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                Get in touch
              </h2>
              <ul className="mt-4 space-y-2.5">
                {contact.emails.map((email) => (
                  <li key={email}>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2.5 text-body underline-offset-4 hover:text-primary hover:underline"
                    >
                      <Icon name="Mail" className="size-4 shrink-0 text-primary" />
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
                      className="inline-flex items-center gap-1.5 text-body underline-offset-4 hover:text-primary hover:underline"
                    >
                      Instagram
                      <Icon name="ArrowUpRight" className="size-3.5" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-[length:var(--text-display-sm)] font-semibold text-ink">
              Send us a message
            </h2>
            <p className="mt-3 text-body">
              Let us know you are coming, or ask us anything.
            </p>
            <div className="mt-8">
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
