import { getContent } from "@/content";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Mission } from "@/components/sections/Mission";
import { DayJourney } from "@/components/sections/DayJourney";
import { ProgramGrid } from "@/components/sections/ProgramGrid";
import { FounderTeaser } from "@/components/sections/FounderTeaser";
import { HelpBand } from "@/components/sections/HelpBand";

export default function HomePage() {
  const content = getContent();

  // Hero and teaser images are picked from the already-filtered gallery, so a
  // change to the safeguarding policy can never leave a withheld photo here.
  const pick = (slug: string) => content.gallery.find((p) => p.slug === slug);
  const heroPhotos = [
    pick("celebration-performance"),
    pick("school-bus-morning"),
    pick("football-training"),
  ].filter((p) => p !== undefined);

  return (
    <>
      <Hero photos={heroPhotos} />
      <Stats stats={content.stats} />
      <Mission />
      <DayJourney stops={content.journey} />
      <ProgramGrid
        programs={content.programs.slice(0, 3)}
        heading="What we actually do, day to day."
        intro="Six programmes, one aim: that a child who arrives here leaves with an education and somewhere to stand."
      />
      <FounderTeaser photo={pick("founder-with-guests") ?? null} />
      <HelpBand involvements={content.involvements} />
    </>
  );
}
