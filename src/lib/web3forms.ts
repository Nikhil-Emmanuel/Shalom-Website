import { site } from "@/content/site";
import { intentLabel, type EnquiryInput } from "@/lib/enquiry";

/**
 * Web3Forms submission, from the browser.
 *
 * This deliberately runs client-side rather than through our own API route.
 * Web3Forms sits behind Cloudflare's bot protection: a server-side fetch is
 * answered with the "Just a moment..." interstitial and a 403, never the API —
 * verified against this key, which succeeds from a browser and fails from
 * Node with identical headers. Datacenter IPs (Vercel's included) are the ones
 * that challenge most readily, so routing it through the server would have
 * failed in production while looking correct in the code.
 *
 * Browser submission is Web3Forms' documented model, and the access key is
 * designed to be public — every example in their docs puts it in a plain hidden
 * input. It identifies a destination inbox, not an account; it cannot read
 * anything, and abuse is handled by their own rate limiting.
 *
 * Once the home owns a domain, Resend through `lib/mailer.ts` is the better
 * path — mail then comes from the home's own address, and the key stays server
 * side. This exists so the form works *today*, without a domain.
 */
export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export async function submitViaWeb3Forms(input: EnquiryInput): Promise<void> {
  if (!WEB3FORMS_KEY) throw new Error("Web3Forms is not configured.");

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: `${site.shortName} website — ${intentLabel(input.intent)} — ${input.name}`,
      from_name: `${site.shortName} website`,
      // Lets the home hit reply and reach the sender directly.
      replyto: input.email,
      name: input.name,
      email: input.email,
      phone: input.phone || "—",
      intent: intentLabel(input.intent),
      message: input.message,
      // Web3Forms' own honeypot, in addition to ours. A filled `botcheck` is
      // discarded on their side without an email being sent.
      botcheck: "",
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? `Web3Forms responded ${response.status}`);
  }
}
