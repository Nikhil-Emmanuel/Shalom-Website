import { involvementSchema, type Involvement } from "./schema";

/**
 * The home confirmed it accepts volunteers, donation drives, sponsorship and
 * monetary contributions — but supplied no bank or UPI details, so v1 routes
 * every intent through the enquiry form rather than a payment page.
 * See lib/donations.ts for the seam a gateway will slot into.
 */
export const involvements: Involvement[] = [
  {
    slug: "visit",
    title: "Come and spend time",
    summary:
      "The thing the home asks for most is not money. It is people who turn up.",
    points: [
      "Your presence, guidance and encouragement",
      "Help with homework, reading or sport",
      "Visit on a weekday evening or a weekend afternoon",
    ],
    icon: "HeartHandshake",
    intent: "visit",
  },
  {
    slug: "drive",
    title: "Organise a donation drive",
    summary:
      "Run a collection where you already are — at work, at college, or on your street.",
    points: [
      "Workplaces, schools, colleges and residential communities",
      "Books, stationery, clothes and school supplies",
      "We can tell you exactly what is short this month",
    ],
    icon: "Boxes",
    intent: "drive",
  },
  {
    slug: "sponsor",
    title: "Sponsor a child",
    summary:
      "Cover the cost of one child's schooling, meals and care through the year.",
    points: [
      "Supports one child's education and daily needs",
      "Updates on how the year is going",
      "Get in touch and we will walk you through it",
    ],
    icon: "GraduationCap",
    intent: "sponsor",
  },
  {
    slug: "give",
    title: "Give directly",
    summary:
      "Contributions go to school fees, food, medical care and the village centres.",
    points: [
      "Eligible for 80G tax exemption",
      "Registered children's home — BK/IV 5/2018-2019",
      "Donations accepted from within India only",
    ],
    icon: "Heart",
    intent: "give",
  },
].map((i) => involvementSchema.parse(i));

/** Practical items the home can always use. */
export const inKindNeeds = [
  "School notebooks and stationery",
  "School uniforms and shoes",
  "Story books in English and Kannada",
  "Rice, pulses and cooking provisions",
  "Bedding and towels",
  "Sports equipment",
] as const;
