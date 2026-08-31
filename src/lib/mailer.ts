import { site } from "@/content/site";
import { intentLabel, type EnquiryInput } from "@/lib/enquiry";

/**
 * Delivers a contact-form enquiry to the home's inbox.
 *
 * Two providers, picked by whichever environment variable is present:
 *
 *   WEB3FORMS_ACCESS_KEY  Recommended for now. Delivers to an ordinary Gmail
 *                         address, needs no domain and no DNS, and setup is one
 *                         key pasted into the environment.
 *
 *   RESEND_API_KEY        Better once the home owns a domain, since mail then
 *                         comes *from* that domain rather than a relay. Resend
 *                         cannot send to arbitrary recipients until a domain is
 *                         verified, which is exactly why it is not the default.
 *
 * Returns a discriminated result rather than throwing, so the route can tell
 * "nobody configured this yet" apart from "the provider failed" — those need
 * different things said to the person who just typed out a message.
 */
export type DeliveryResult =
  | { status: "sent" }
  | { status: "unconfigured" }
  | { status: "failed"; detail: string };

function composeBody(input: EnquiryInput): string {
  return [
    `Intent: ${intentLabel(input.intent)}`,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    "",
    input.message,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function subjectFor(input: EnquiryInput): string {
  return `${site.shortName} website — ${intentLabel(input.intent)} — ${input.name}`;
}

async function viaWeb3Forms(
  input: EnquiryInput,
  accessKey: string,
): Promise<DeliveryResult> {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: subjectFor(input),
      from_name: `${site.shortName} website`,
      // Lets the home hit reply and reach the sender directly.
      replyto: input.email,
      name: input.name,
      email: input.email,
      phone: input.phone || "—",
      intent: intentLabel(input.intent),
      message: input.message,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || !data.success) {
    return {
      status: "failed",
      detail: data.message ?? `Web3Forms responded ${response.status}`,
    };
  }
  return { status: "sent" };
}

async function viaResend(
  input: EnquiryInput,
  apiKey: string,
  from: string,
): Promise<DeliveryResult> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: site.contact.emails,
      reply_to: input.email,
      subject: subjectFor(input),
      text: composeBody(input),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      status: "failed",
      detail: detail || `Resend responded ${response.status}`,
    };
  }
  return { status: "sent" };
}

export async function deliverEnquiry(
  input: EnquiryInput,
): Promise<DeliveryResult> {
  const web3 = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3) return viaWeb3Forms(input, web3);

  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.ENQUIRY_FROM_EMAIL;
  if (resendKey && resendFrom) return viaResend(input, resendKey, resendFrom);

  return { status: "unconfigured" };
}
