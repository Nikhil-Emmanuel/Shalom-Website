import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of use",
  description:
    "Terms for using the Shalom Children's Home website, including how donations, visits and photographs are handled.",
};

const UPDATED = "September 2026";

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms of use"
        title="The plain version."
        intro="No small print worth hiding. This sets out who runs this site, what you can expect from it, and what we ask of you."
      />

      <section className="py-20 sm:py-24">
        <Container size="narrow" className="space-y-10 text-body">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Who we are
            </h2>
            <p className="mt-4 leading-relaxed">
              This site is run by {site.name}, a children&rsquo;s home in{" "}
              {site.address.locality}, registered under{" "}
              {site.registration.number} on {site.registration.date}. You can
              reach us at{" "}
              <a
                href={`mailto:${site.contact.emails[0]}`}
                className="text-primary underline underline-offset-4"
              >
                {site.contact.emails[0]}
              </a>
              {site.contact.phone ? ` or ${site.contact.phone}` : ""}.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Donations
            </h2>
            <p className="mt-4 leading-relaxed">
              Donations fund the day-to-day running of the home-food,
              schooling, medical care and the village tuition centres. We cannot
              guarantee that a particular gift pays for a particular child or
              item, because needs shift through the year and the children come
              first.
            </p>
            <p className="mt-4 leading-relaxed">
              {site.registration.taxExemption
                ? `Donations are eligible for ${site.registration.taxExemption} tax exemption; ask us for a receipt.`
                : ""}{" "}
              {!site.acceptsForeignDonations &&
                "We are not currently permitted to receive donations from outside India, so please do not send funds from abroad-we would have to return them."}
            </p>
            <p className="mt-4 leading-relaxed">
              Donations are voluntary and, once given, are generally not
              refundable. If something has gone wrong with a payment, contact us
              and we will put it right.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Visiting
            </h2>
            <p className="mt-4 leading-relaxed">
              Visitors are welcome during our published hours, by arrangement.
              Visits are supervised, and we may decline or end a visit at our
              discretion. This is not about mistrust-a safe home for children
              requires it.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Photographs and content
            </h2>
            <p className="mt-4 leading-relaxed">
              The words and photographs on this site belong to the home. Please
              do not reuse them commercially, or in any way that would identify
              a child in our care, without asking us first. Press and supporters
              are usually very welcome to use them-just get in touch.
            </p>
            <p className="mt-4 leading-relaxed">
              If you photograph the children during a visit, please do not
              publish those images. See our{" "}
              <Link
                href="/privacy"
                className="text-primary underline underline-offset-4"
              >
                child protection and privacy page
              </Link>{" "}
              for why this matters.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Accuracy
            </h2>
            <p className="mt-4 leading-relaxed">
              We keep this site as accurate as we can, but it is maintained by a
              small team alongside the actual work of running a home. Details
              such as visiting hours can change. If something here matters to a
              decision you are making, please check with us directly.
            </p>
            <p className="mt-4 leading-relaxed">
              The site links to other places-a map, social media. We are not
              responsible for what those services do.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Governing law
            </h2>
            <p className="mt-4 leading-relaxed">
              These terms are governed by the laws of India, and the courts of{" "}
              {site.address.locality}, {site.address.region} have jurisdiction.
            </p>
          </div>

          <p className="border-t border-hairline pt-8 text-sm text-muted">
            Last updated {UPDATED}.
          </p>
        </Container>
      </section>
    </>
  );
}
