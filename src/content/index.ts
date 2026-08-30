import { publishable } from "@/lib/privacy";
import { findPhoto, photos } from "./media.manifest";
import { site, founder } from "./site";
import { hero, stats, mission, journey } from "./home";
import { story, timeline, values } from "./about";
import { programs } from "./programs";
import { involvements, inKindNeeds } from "./involve";
import type { JourneyStop, Photo, Program } from "./schema";

/**
 * The single accessor every component reads from.
 *
 * Components must never import the content files directly — going through here
 * means (a) the safeguarding filter cannot be bypassed by accident, and (b) a
 * CMS can replace the file-backed source in phase 2 by changing this module
 * alone.
 */

export type ResolvedJourneyStop = Omit<JourneyStop, "photo"> & { photo: Photo };
export type ResolvedProgram = Omit<Program, "photo"> & { photo: Photo | null };

/** Stops whose photograph the policy withholds are dropped from the journey. */
function resolveJourney(): ResolvedJourneyStop[] {
  return journey.flatMap((stop) => {
    const image = findPhoto(stop.photo);
    if (!image || publishable([image]).length === 0) return [];
    return [{ ...stop, photo: image }];
  });
}

function resolvePrograms(): ResolvedProgram[] {
  return programs.map((program) => {
    const image = program.photo ? findPhoto(program.photo) : null;
    return {
      ...program,
      photo: image && publishable([image]).length > 0 ? image : null,
    };
  });
}

/** Only photographs the safeguarding policy permits. */
export function getGalleryPhotos(): Photo[] {
  return publishable(photos);
}

export function getContent() {
  return {
    site,
    founder,
    hero,
    stats,
    mission,
    journey: resolveJourney(),
    story,
    timeline,
    values,
    programs: resolvePrograms(),
    involvements,
    inKindNeeds,
    gallery: getGalleryPhotos(),
  };
}

export type Content = ReturnType<typeof getContent>;
export type { Photo, Program } from "./schema";
