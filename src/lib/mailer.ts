import { site } from "@/content/site";
import { intentLabel, type EnquiryInput } from "@/lib/enquiry";

/**
 * Delivers a contact-form enquiry to the home's inbox.
 *
 * This is the Resend path, used once the home owns a domain: mail then comes
 * *from* that domain rather than a relay, and the key never leaves the server.
 * Resend will not send to arbitrary recipients until a domain is verified,
 * which is why it cannot be used yet.
 *
 * Web3Forms is NOT handled here, despite being the provider actually in use.
 * Its API sits behind Cloudflare bot protection and answers a server-side
 * fetch with the "Just a moment..." interstitial and a 403 — verified against
 * a valid key, which succeeds from a browser and fails from Node. It is
 * submitted from the client instead; see `lib/web3forms.ts`.
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
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.ENQUIRY_FROM_EMAIL;
  if (resendKey && resendFrom) return viaResend(input, resendKey, resendFrom);

  return { status: "unconfigured" };
}
