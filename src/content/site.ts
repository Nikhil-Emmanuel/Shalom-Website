import { siteSchema, type Site } from "./schema";

/**
 * Organisation facts, taken from the information sheet the home returned.
 *
 * Fields that are `null` are genuinely unknown-the home has not supplied them
 * yet. The UI hides those rather than inventing a value, so nothing incorrect
 * reaches structured data or a donor.
 */
export const site: Site = siteSchema.parse({
  name: "Shalom Children's Home",
  shortName: "Shalom",
  tagline: "A home, a family, and a future.",
  description:
    "Shalom Children's Home in Hennur, Bangalore provides shelter, food, education and medical care to 30 children, and supports 57 more through village tuition centres.",

  // Single source of truth for the site's own address: drives metadataBase,
  // every canonical URL, the sitemap, robots.txt and the JSON-LD @ids. Change
  // it here and nowhere else. No trailing slash-the consumers append paths.
  url: "https://shalomhome.in",

  // Dimensions must match public/logo.png exactly-next/image upscales a
  // source smaller than the declared width, which softens it. Both numbers are
  // printed by `python scripts/prepare_logo.py`; update them if it is re-run.
  logo: { src: "/logo.png", width: 388, height: 440 },

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
    // The information sheet read 570043 (a Mysuru code); confirmed as the
    // Hennur code below.
    postalCode: "560043",
    country: "IN",
    mapsUrl:
      "https://www.google.com/maps/place/Shalom+Children's+Home/@13.0411968,77.645622,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae174905d95bdb:0x751e1bb538f2ec0!8m2!3d13.0411968!4d77.645622!16s%2Fg%2F11cmc48cwb",
    geo: { lat: 13.0411968, lng: 77.645622 },
  },

  contact: {
    emails: ["pgsamuel07@gmail.com", "lakshanyango@gmail.com"],
    phone: "+91 94805 11642",
    whatsapp: "+91 94805 11642",
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

/** Studio credit, shown in the footer and emitted in structured data. */
export const builtBy = {
  name: "Nevark Technologies",
  llpin: "ACP-8830",
} as const;

export const founder = {
  name: "Samuel P. G.",
  role: "Founder",
  bio: "Samuel P. G. founded Shalom and runs it together with his family, driven by a conviction he has held since 1978-that no child should go without a home, a meal, or a chance at school.",
} as const;
