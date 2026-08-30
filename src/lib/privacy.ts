import policy from "@/content/media.policy.json";
import type { FaceVisibility, Photo } from "@/content/schema";

/**
 * Child-safeguarding policy for photography.
 *
 * The home returned its information sheet with the photo-permission question
 * left blank, while supplying photographs in which children are clearly
 * identifiable. India's Juvenile Justice (Care and Protection of Children)
 * Act 2015 restricts publishing details that identify a child in care, so the
 * site defaults to protecting them.
 *
 * The policy lives in content/media.policy.json because scripts/prepare-media.mjs
 * reads it too: under "protect" a withheld photograph is never written into
 * public/ in the first place. Filtering only here would still leave the file
 * fetchable by direct URL.
 *
 * To publish faces — only after the home gives written permission:
 *   1. set facePolicy to "open" in src/content/media.policy.json
 *   2. re-run `node scripts/prepare-media.mjs` to emit the withheld images
 */
export type FacePolicy = "protect" | "open";

export const FACE_POLICY = policy.facePolicy as FacePolicy;

/** Children are never named on this site, under either policy. */
export const NAMES_POLICY = "no-child-names" as const;

const ALLOWED_UNDER_PROTECT: readonly FaceVisibility[] = ["none", "incidental"];

type PolicyFields = Pick<Photo, "faceVisibility" | "redacted">;

/** Can this photograph be published under the active policy? */
export function isPublishable(photo: PolicyFields): boolean {
  if (FACE_POLICY === "open") return true;
  // Faces already obscured by scripts/redact_faces.py and checked by eye.
  if (photo.redacted) return true;
  return ALLOWED_UNDER_PROTECT.includes(photo.faceVisibility);
}

/** Filters a set of photographs down to those the policy permits. */
export function publishable<T extends PolicyFields>(photos: readonly T[]): T[] {
  return photos.filter(isPublishable);
}
