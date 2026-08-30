import { z } from "zod";

export const INTENTS = [
  { value: "visit", label: "Visit the home" },
  { value: "drive", label: "Organise a donation drive" },
  { value: "sponsor", label: "Sponsor a child" },
  { value: "give", label: "Make a donation" },
  { value: "other", label: "Something else" },
] as const;

export const intentValues = INTENTS.map((i) => i.value) as [string, ...string[]];

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  intent: z.enum(intentValues),
  message: z
    .string()
    .trim()
    .min(10, "A sentence or two is plenty — just tell us how you'd like to help.")
    .max(2000),
  /** Honeypot: real people leave this empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export function intentLabel(value: string): string {
  return INTENTS.find((i) => i.value === value)?.label ?? value;
}
