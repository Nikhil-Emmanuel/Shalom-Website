import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/enquiry";
import { deliverEnquiry } from "@/lib/mailer";

/**
 * Receives an enquiry and emails it to the home.
 *
 * Delivery lives in lib/mailer.ts. Until a provider is configured this replies
 * with `mailUnconfigured` so the form can fall back to a prefilled mailto-a
 * message must never be accepted and then silently dropped, which for this
 * organisation could mean a lost donor.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  // Honeypot tripped-accept silently so the bot learns nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const result = await deliverEnquiry(parsed.data);

  if (result.status === "unconfigured") {
    return NextResponse.json(
      { error: "mailUnconfigured", mailUnconfigured: true },
      { status: 503 },
    );
  }

  if (result.status === "failed") {
    // Logged for whoever maintains the site; never shown to the visitor, since
    // provider errors leak configuration detail and mean nothing to them.
    console.error("[enquiry] delivery failed:", result.detail);
    return NextResponse.json(
      { error: "We could not send that just now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
