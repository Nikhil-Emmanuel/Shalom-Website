import { siteSchema, type Site } from "./schema";

/**
 * Organisation facts, taken from the information sheet the home returned.
 *
 * Fields that are `null` are genuinely unknown — the home has not supplied them
 * yet. The UI hides those rather than inventing a value, so nothing incorrect
 * reaches structured data or a donor.
 */
export const site: Site = siteSchema.parse({
  name: "Shalom Children's Home",
  shortName: "Shalom",
  tagline: "A home, a family, and a future.",
  description:
    "Shalom Children's Home in Hennur, Bangalore provides shelter, food, education and medical care to 30 children, and supports 57 more through village tuition centres.",

  // TODO: replace once the home registers a domain — drives metadataBase,
  // the sitemap and every canonical URL.
  url: "https://shalomchildrenshome.org",

  founded: 2018,
  registration: {
    number: "BK/IV 5/2018-2019",
    date: "3 April 2018",
    taxExemption: "80G",
  },

  // The home confirmed it is NOT permitted to receive foreign donations.
  // Donation copy must stay India-only while this is false.
  acceptsForeignDonations: false,

  address: {
    lines: ["Shalom Ashram", "No. 19, 6th Cross Road, Sai Layout", "Vadrapalaya, Horamavu Agara Road"],
    locality: "Bangalore",
    region: "Karnataka",
    // The sheet reads 570043, which is a Mysuru code — Hennur is 560043.
    // Left null until the home confirms, so we never publish a wrong PIN.
    postalCode: null,
    country: "IN",
    mapsUrl: null,
  },

  contact: {
    emails: ["pgsamuel07@gmail.com", "lakshanyango@gmail.com"],
    // The sheet listed contact *channels* rather than a number.
    phone: null,
    whatsapp: null,
  },

  social: {
    instagram: "https://www.instagram.com/shalomcare2025",
    // Page name is "Karunalaya Shalom Children's Home" but no URL was supplied.
    facebook: null,
  },

  visiting: {
    note: "Visitors are welcome. Please get in touch before you come so the children's routine isn't interrupted.",
    slots: ["Weekday evenings, 5–6 pm", "Saturday and Sunday afternoons"],
  },
});

export const founder = {
  name: "Samuel P. G.",
  role: "Founder",
  bio: "Samuel P. G. founded Shalom and runs it together with his family, driven by a conviction he has held since 1978 — that no child should go without a home, a meal, or a chance at school.",
} as const;
