import type { Metadata } from "next";
import { getContent } from "@/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProgramGrid } from "@/components/sections/ProgramGrid";
import { HelpBand } from "@/components/sections/HelpBand";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "Residential care, schooling, nutrition, medical camps, village tuition centres and sport — the six programmes running at Shalom Children's Home in Hennur, Bangalore.",
};

export default function ProgramsPage() {
  const { programs, involvements } = getContent();

  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Six programmes, one aim."
        intro="Everything here exists to get a child through school with their health intact and somewhere safe to sleep. This is how that breaks down."
      />
      <ProgramGrid
        programs={programs}
        heading="Our work, in detail"
        showBody
      />
      <HelpBand involvements={involvements} />
    </>
  );
}
