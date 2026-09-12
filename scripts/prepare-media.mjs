/**
 * Optimises the home's supplied photographs into public/media and records their
 * dimensions, blur placeholder and privacy classification for next/image.
 *
 * IMPORTANT-this script enforces the safeguarding policy at the *file* level.
 * A photograph classified `prominent` is never written into public/ while the
 * policy is "protect", because anything under public/ is fetchable by direct
 * URL whether or not a page renders it. Filtering only at render time would
 * leave identifiable children one guessed filename away from the public.
 *
 * `faceVisibility` lives here (rather than in the TS manifest) precisely so the
 * build step can act on it. Editorial metadata-captions, alt text, category —
 * stays human-authored in src/content/media.manifest.ts.
 *
 *   none        no children, or none whose face is visible (adults only)
 *   incidental  children present, but nobody is an identifiable subject
 *   prominent   at least one child's face is clearly identifiable
 *
 * Run: node scripts/prepare-media.mjs
 */
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC_DIR = path.join(ROOT, "MEDIA FILES");
const OUT_DIR = path.join(ROOT, "public", "media");
const DIMS_FILE = path.join(ROOT, "src", "content", "media.dimensions.json");
const POLICY_FILE = path.join(ROOT, "src", "content", "media.policy.json");

/** Each photo was reviewed individually to assign faceVisibility. */
const FILES = [
  // ---- Adults only ----
  ["founder with guests and friends.jpeg", "founder-with-guests", "none"],
  ["Independance_day_cheif guest.jpeg", "independence-day-chief-guest", "none"],

  // ---- Children present, not identifiable subjects ----
  ["WhatsApp Image 2026-08-20 at 1.32.44 PM (2).jpeg", "school-bus-morning", "incidental"],
  ["students in queue to get lunch.jpeg", "lunch-queue", "incidental"],
  ["children playing in play aream.jpeg", "play-area", "incidental"],
  ["medical check camp.jpeg", "medical-camp", "incidental"],
  ["football camp training.jpeg", "football-training", "incidental"],
  ["football team group pic.jpeg", "football-team", "incidental"],
  ["celebration group pic.jpeg", "celebration-performance", "incidental"],

  // ---- Identifiable faces ----
  ["Independance day_group photo.jpeg", "independence-day-group", "prominent"],
  ["Independanceday_students.jpeg", "independence-day-students", "prominent"],
  ["Students eating lunch.jpeg", "lunch-together", "prominent"],
  ["children eating lunch on tables.jpeg", "lunch-younger-children", "prominent"],
  ["students boarding bus.jpeg", "school-bus-lineup", "prominent"],
  ["students boarding school bus .jpeg", "school-bus-boarding", "prominent"],
  ["students in bus.jpeg", "school-bus-inside", "prominent"],
  ["founder distributing stationary to children.jpeg", "village-stationery-1", "prominent"],
  ["founder distributing stationary to children - 2.jpeg", "village-stationery-2", "prominent"],
  ["founder distributing stationary to children -3.jpeg", "village-stationery-3", "prominent"],
  ["founder distributing stationary to children -4.jpeg", "village-stationery-4", "prominent"],
  ["founder distributing stationary to children-5.jpeg", "village-stationery-5", "prominent"],
  ["founder distributing stationary to childre-6n.jpeg", "village-stationery-6", "prominent"],
  ["WhatsApp Image 2026-08-20 at 6.00.23 PM.jpeg", "village-stationery-7", "prominent"],
  ["WhatsApp Image 2026-08-20 at 6.00.23 PM (1).jpeg", "village-stationery-8", "prominent"],
];

/**
 * Photographs whose faces have been redacted by scripts/redact_faces.py AND
 * checked by eye afterwards-every child's face is either obscured or not
 * visible, and the picture still reads. These publish despite being classified
 * `prominent`, sourced from MEDIA FILES/redacted/ rather than the original.
 *
 * Must stay in sync with VERIFIED in redact_faces.py. Never add a slug here
 * without looking at the redacted output first: the detector is a labour-saver,
 * not the safety mechanism, and a missed face fails silently.
 */
const REDACTED = new Set([
  "village-stationery-1",
  "village-stationery-2",
  "village-stationery-3",
  "village-stationery-4",
  "village-stationery-5",
  "village-stationery-6",
  "village-stationery-7",
  "village-stationery-8",
  "school-bus-lineup",
  "school-bus-boarding",
  "school-bus-inside",
  "lunch-younger-children",
]);

/**
 * Published from the ORIGINAL, unredacted photograph at the client's explicit
 * instruction, overriding the classification.
 *
 * This shows an identifiable child. It needs the home's written consent before
 * the site goes live-see the note in README under Child safeguarding.
 */
const UNREDACTED_OVERRIDE = new Set(["village-stationery-7"]);

const MAX_WIDTH = 2000;
const PUBLISHABLE_UNDER_PROTECT = new Set(["none", "incidental"]);

async function run() {
  const { facePolicy } = JSON.parse(await readFile(POLICY_FILE, "utf8"));
  const publishes = (faceVisibility, slug) =>
    facePolicy === "open" ||
    PUBLISHABLE_UNDER_PROTECT.has(faceVisibility) ||
    REDACTED.has(slug) ||
    UNREDACTED_OVERRIDE.has(slug);

  // Rebuilt from scratch so that tightening the policy actually removes files
  // that a previous, looser run had published.
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(DIMS_FILE), { recursive: true });

  const manifest = {};
  let withheld = 0;

  for (const [file, slug, faceVisibility] of FILES) {
    if (!publishes(faceVisibility, slug)) {
      // Recorded so the TS manifest still knows the photo exists and why it is
      // absent-but no file is emitted, so there is nothing to fetch.
      manifest[slug] = {
        faceVisibility,
        published: false,
        redacted: false,
        explicitOverride: false,
      };
      withheld += 1;
      continue;
    }

    // Redacted photographs are read from the processed copy; the original —
    // with faces intact-is never the source for anything under public/.
    const isRedacted =
      facePolicy !== "open" &&
      REDACTED.has(slug) &&
      !UNREDACTED_OVERRIDE.has(slug);
    const source = isRedacted
      ? path.join(SRC_DIR, "redacted", `${slug}.jpg`)
      : path.join(SRC_DIR, file);

    const buf = await readFile(source);
    const pipeline = sharp(buf).rotate(); // honour EXIF orientation
    const meta = await pipeline.metadata();

    const out = await pipeline
      .resize({
        width: Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH),
        withoutEnlargement: true,
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    await writeFile(path.join(OUT_DIR, `${slug}.jpg`), out);
    const outMeta = await sharp(out).metadata();

    // 16px-wide placeholder, inlined as a data URL so there is no extra request.
    const blur = await sharp(buf).rotate().resize(16).webp({ quality: 40 }).toBuffer();

    manifest[slug] = {
      faceVisibility,
      published: true,
      redacted: isRedacted,
      explicitOverride: UNREDACTED_OVERRIDE.has(slug),
      width: outMeta.width,
      height: outMeta.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };

    console.log(
      `  ${(isRedacted ? "redacted " : "published").padEnd(10)} ${slug.padEnd(28)} ${outMeta.width}x${outMeta.height}  ${(out.length / 1024).toFixed(0)}kb`,
    );
  }

  await writeFile(DIMS_FILE, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\npolicy "${facePolicy}": ${FILES.length - withheld} published, ${withheld} withheld (not written to public/)`,
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
