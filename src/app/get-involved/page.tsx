import type { Metadata } from "next";
import { getContent } from "@/content";
import { site } from "@/content/site";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  alternates: { canonical: "/get-involved" },
  title: "Ways to help",
  description:
    "Volunteer, sponsor a child, organise a donation drive or give directly to Shalom Children's Home in Hennur, Bangalore. 80G tax exemption available.",
};

export default function GetInvolvedPage() {
  const { involvements, inKindNeeds } = getContent();

  return (
    <>
      <PageHeader
        eyebrow="Ways to help"
        title="There is more than one way in."
        intro="Money helps. So does an afternoon of your time, a boot full of notebooks, or telling one other person that this place exists."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal stagger className="grid gap-6 sm:grid-cols-2">
            {involvements.map((item) => (
              <article
                key={item.slug}
                id={item.slug}
                className="flex flex-col rounded-2xl border border-hairline p-7"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-semibold text-ink">
                  {item.title}
                </h2>
                <p className="mt-3 leading-relaxed text-body">{item.summary}</p>
                <ul className="mt-5 space-y-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-sm text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-hairline bg-surface-soft py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="font-display text-[length:var(--text-display-md)] font-semibold text-ink">
              What the home actually needs
            </h2>
            <p className="mt-5 leading-relaxed text-body">
              If you are running a collection, these are the things that get
              used immediately.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {inKindNeeds.map((need) => (
                <li
                  key={need}
                  className="flex items-start gap-2.5 text-sm text-body"
                >
                  <Icon name="Boxes" className="mt-0.5 size-4 shrink-0 text-primary" />
                  {need}
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-xl border border-hairline bg-canvas p-5 text-sm leading-relaxed text-muted">
              <p className="flex items-start gap-2.5">
                <Icon name="ShieldCheck" className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  Shalom is a registered children&rsquo;s home
                  {site.registration.taxExemption
                    ? `, and donations are eligible for ${site.registration.taxExemption} tax exemption`
                    : ""}
                  .
                  {!site.acceptsForeignDonations &&
                    " Donations can be accepted from within India only."}
                </span>
              </p>
            </div>
          </div>

          <div id="enquire">
            <h2 className="font-display text-[length:var(--text-display-sm)] font-semibold text-ink">
              Tell us how you&rsquo;d like to help
            </h2>
            <p className="mt-3 text-body">
              Send a message and someone from the home will reply.
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
