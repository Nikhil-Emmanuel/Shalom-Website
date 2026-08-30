import generated from "./media.dimensions.json";
import { photoSchema, faceVisibilitySchema, type Photo } from "./schema";

/**
 * Human-authored editorial metadata for the photographs the home supplied.
 *
 * Captions come from the filenames the home sent; alt text describes the scene
 * for screen readers and never identifies a child.
 *
 * The privacy classification (`faceVisibility`) deliberately lives in
 * scripts/prepare-media.mjs instead, because the build step has to act on it —
 * a withheld photograph is never written into public/ at all. This file only
 * surfaces photographs that the script actually published; anything withheld
 * has no image on disk and is skipped entirely.
 *
 * When new photos arrive: add them to the script (with a classification), run
 * `node scripts/prepare-media.mjs`, then add the caption and alt text here.
 */
type Curated = Pick<Photo, "slug" | "caption" | "alt" | "category">;

const curated: Curated[] = [
  // ---- People (adults only) ----
  {
    slug: "founder-with-guests",
    caption: "The founder with staff and guests on Independence Day",
    alt: "Five adults standing together for a photograph in front of Indian flags and festive decorations.",
    category: "people",
  },
  {
    slug: "independence-day-chief-guest",
    caption: "Welcoming the chief guest on Independence Day",
    alt: "Two men shaking hands outdoors under a tree, one wearing a garland of flowers.",
    category: "people",
  },

  // ---- Daily life ----
  {
    slug: "school-bus-morning",
    caption: "The morning school run",
    alt: "Children in school uniform with backpacks stepping onto a yellow school bus.",
    category: "education",
  },
  {
    slug: "lunch-queue",
    caption: "Waiting in line for lunch",
    alt: "Children queuing with plates at a serving hatch while a cook serves rice.",
    category: "nutrition",
  },
  {
    slug: "play-area",
    caption: "Afternoons in the play area",
    alt: "Children climbing a slide and play frame among trees.",
    category: "daily-life",
  },
  {
    slug: "medical-camp",
    caption: "A health check-up camp at the home",
    alt: "A doctor with a stethoscope seated at a desk of medical records while a child is measured.",
    category: "health",
  },
  {
    slug: "football-training",
    caption: "Football training",
    alt: "A long line of children spread across a green football pitch during a training drill.",
    category: "sport",
  },
  {
    slug: "football-team",
    caption: "The football squad",
    alt: "A group of children and two coaches gathered on a football pitch with match balls in the foreground.",
    category: "sport",
  },
  {
    slug: "celebration-performance",
    caption: "A performance on celebration night",
    alt: "Children performing on a red carpet stage under strings of fairy lights and coloured drapes.",
    category: "celebration",
  },

  // ---- Withheld under the current policy: no file is emitted for these, so
  // they are skipped at build time. Metadata is kept so that flipping the
  // policy and re-running the media script restores them intact.
  {
    slug: "independence-day-group",
    caption: "Independence Day, everyone together",
    alt: "A large group photograph of children and adults in white clothing with tricolour sashes.",
    category: "celebration",
  },
  {
    slug: "independence-day-students",
    caption: "Watching the Independence Day programme",
    alt: "Children in white clothing with tricolour headbands seated on a mat holding small flags.",
    category: "celebration",
  },
  {
    slug: "lunch-together",
    caption: "Lunch together at the long table",
    alt: "Children seated along a wooden table eating rice and curry from coloured plates.",
    category: "nutrition",
  },
  {
    slug: "lunch-younger-children",
    caption: "The younger children at lunch",
    alt: "Four young children eating a meal at a table while staff serve from a hatch behind.",
    category: "nutrition",
  },
  {
    slug: "school-bus-lineup",
    caption: "Ready for school",
    alt: "Children in white school uniform lined up beside a yellow school bus with an adult.",
    category: "education",
  },
  {
    slug: "school-bus-boarding",
    caption: "Boarding the bus",
    alt: "Children in school uniform with backpacks waiting to board a yellow bus.",
    category: "education",
  },
  {
    slug: "school-bus-inside",
    caption: "On the way to school",
    alt: "Children seated in the green and blue seats of a school bus with a staff member.",
    category: "education",
  },
  // One distribution day at a village tuition centre, in sequence.
  {
    slug: "village-stationery-7",
    caption: "Pencils and notebooks, handed over one by one",
    alt: "The founder passing a set of pencils and notebooks to a student outside a village building.",
    category: "outreach",
  },
  {
    slug: "village-stationery-1",
    caption: "A geometry set for the new school year",
    alt: "A student receiving a geometry set and notebooks, with others waiting behind.",
    category: "outreach",
  },
  {
    slug: "village-stationery-2",
    caption: "Waiting your turn at the village centre",
    alt: "A boy accepting a bundle of stationery while villagers look on.",
    category: "outreach",
  },
  {
    slug: "village-stationery-4",
    caption: "Notebooks enough for the whole term",
    alt: "A student taking a stack of notebooks and a pen from the founder.",
    category: "outreach",
  },
  {
    slug: "village-stationery-3",
    caption: "A hand on the head, and a bag of books",
    alt: "The founder resting a hand on a child's head in blessing while handing over school books.",
    category: "outreach",
  },
  {
    slug: "village-stationery-5",
    caption: "A blessing with the books",
    alt: "The founder offering a blessing to a student who is receiving a set of school supplies.",
    category: "outreach",
  },
  {
    slug: "village-stationery-6",
    caption: "Colour pens, and a crowd to match",
    alt: "Children gathered closely around the founder as sets of colour pens are handed out.",
    category: "outreach",
  },
  {
    slug: "village-stationery-8",
    caption: "The last of the supplies going out",
    alt: "Children reaching for the remaining stationery sets at the end of a distribution.",
    category: "outreach",
  },
];

type GeneratedEntry = {
  faceVisibility: string;
  published: boolean;
  redacted: boolean;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

function build(): Photo[] {
  const photos: Photo[] = [];

  for (const entry of curated) {
    const meta = (generated as Record<string, GeneratedEntry>)[entry.slug];
    if (!meta) {
      throw new Error(
        `No generated data for "${entry.slug}". Run: node scripts/prepare-media.mjs`,
      );
    }
    // Withheld by the safeguarding policy — no file exists to render.
    if (!meta.published) continue;

    photos.push(
      photoSchema.parse({
        ...entry,
        // Say so, rather than describing faces a screen-reader user cannot see.
        alt: meta.redacted
          ? `${entry.alt} Faces are obscured to protect the children's privacy.`
          : entry.alt,
        faceVisibility: faceVisibilitySchema.parse(meta.faceVisibility),
        redacted: meta.redacted,
        src: `/media/${entry.slug}.jpg`,
        width: meta.width,
        height: meta.height,
        blurDataURL: meta.blurDataURL,
      }),
    );
  }

  return photos;
}

export const photos: Photo[] = build();

const bySlug = new Map(photos.map((p) => [p.slug, p]));

/** Look up a published photo, or null if the policy withholds it. */
export function findPhoto(slug: string): Photo | null {
  return bySlug.get(slug) ?? null;
}
