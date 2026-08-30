import { NextResponse } from "next/server";
import { enquirySchema, intentLabel } from "@/lib/enquiry";
import { site } from "@/content/site";

/**
 * Receives an enquiry and emails it to the home.
 *
 * Delivery needs RESEND_API_KEY and ENQUIRY_FROM_EMAIL. Until those are set,
 * the route replies with `mailUnconfigured` so the form can fall back to a
 * prefilled mailto link — a message must never be accepted and then silently
 * dropped, which for this organisation could mean a lost donor.
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

  const { name, email, phone, intent, message, website } = parsed.data;

  // Honeypot tripped — accept silently so the bot learns nothing.
  if (website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "mailUnconfigured", mailUnconfigured: true },
      { status: 503 },
    );
  }

  const body = [
    `Intent: ${intentLabel(intent)}`,
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: site.contact.emails,
      reply_to: email,
      subject: `${site.shortName} website — ${intentLabel(intent)} — ${name}`,
      text: body,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "We could not send that just now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
