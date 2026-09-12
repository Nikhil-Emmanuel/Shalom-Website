import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Child protection & privacy",
  description:
    "How Shalom Children's Home protects the identity of the children in its care, and what happens to information you send us.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Child protection & privacy"
        title="How we protect the children here."
      />

      <section className="py-20 sm:py-24">
        <Container size="narrow" className="space-y-10 text-body">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Photographs
            </h2>
            <p className="mt-4 leading-relaxed">
              We do not publish photographs in which a child in our care is
              individually identifiable, and we never publish a child&rsquo;s
              name alongside their image. Every photograph on this site is
              reviewed before it goes up, and those showing identifiable
              children are withheld.
            </p>
            <p className="mt-4 leading-relaxed">
              This follows the protections set out for children in care under
              the Juvenile Justice (Care and Protection of Children) Act, 2015.
              If you have photographed the children during a visit, please do
              not publish those images without speaking to us first.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Visiting
            </h2>
            <p className="mt-4 leading-relaxed">
              Visitors are welcome during our published hours, and we ask that
              you contact us beforehand. Visits are supervised. This is not
              about mistrust-it is what a safe home for children requires.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Information you send us
            </h2>
            <p className="mt-4 leading-relaxed">
              When you use a form on this site, the details you enter are sent
              to the home by email so that we can reply. We use them for that
              purpose only. We do not sell them, share them with anyone else, or
              add you to a mailing list without asking.
            </p>
            <p className="mt-4 leading-relaxed">
              Our visit page embeds a Google map so you can find us. Loading it
              means Google may set cookies in your browser, as it would on any
              site showing a map. Nothing you type into our forms is shared with
              them.
            </p>
            <p className="mt-4 leading-relaxed">
              To have your details removed from our records, email{" "}
              <a
                href={`mailto:${site.contact.emails[0]}`}
                className="text-primary underline underline-offset-4"
              >
                {site.contact.emails[0]}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Donations
            </h2>
            <p className="mt-4 leading-relaxed">
              Shalom Children&rsquo;s Home is registered under{" "}
              {site.registration.number}
              {site.registration.taxExemption
                ? `, and donations are eligible for ${site.registration.taxExemption} tax exemption`
                : ""}
              .
              {!site.acceptsForeignDonations &&
                " We are not currently permitted to receive donations from outside India."}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
