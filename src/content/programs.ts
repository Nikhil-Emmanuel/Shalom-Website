import { programSchema, type Program } from "./schema";

/**
 * `icon` names map to lucide-react exports (see components/ui/Icon.tsx).
 * `photo` is a slug from media.manifest — or null where every available
 * photograph of that programme shows an identifiable child and is therefore
 * withheld under the current safeguarding policy.
 */
export const programs: Program[] = [
  {
    slug: "home",
    title: "A place to call home",
    summary: "Residential care for thirty boys and girls, aged six to eighteen.",
    body: "A bed, a routine, and adults who know your name. Children stay with us until they are eighteen, in line with government rules, and the home runs as a family rather than an institution.",
    icon: "House",
    photo: "play-area",
  },
  {
    slug: "education",
    title: "School, every single day",
    summary: "Fees, uniforms, books — and a bus that comes every morning.",
    body: "Education is the whole point. We cover school fees and supplies, keep uniforms clean and shoes on feet, and make sure the bus is caught. Nothing about a child's circumstances should decide whether they finish school.",
    icon: "GraduationCap",
    photo: "school-bus-morning",
  },
  {
    slug: "nutrition",
    title: "Three meals, cooked here",
    summary: "Proper food, every day, prepared in our own kitchen.",
    body: "Many of the children arrive undernourished. Regular, cooked meals are the fastest thing that changes — in their health, their concentration at school, and their confidence.",
    icon: "UtensilsCrossed",
    photo: "lunch-queue",
  },
  {
    slug: "health",
    title: "Medical care when it is needed",
    summary: "Regular check-up camps, and treatment without delay.",
    body: "Visiting doctors run health camps at the home, with records kept for every child. Catching things early costs a fraction of what treating them late does — for us, and for the child.",
    icon: "Stethoscope",
    photo: "medical-camp",
  },
  {
    slug: "outreach",
    title: "Village tuition centres",
    summary: "Fifty-seven children taught after school, in their own villages.",
    body: "Not every child needs to leave home — some just need someone to teach them after school and put a pen in their hand. Our village centres reach fifty-seven young people, with tuition, notebooks and stationery, so that they can stay with their families and still keep up.",
    icon: "BookOpen",
    photo: "village-stationery-7",
  },
  {
    slug: "sport",
    title: "Football, and room to play",
    summary: "Coaching on a full-size pitch, and a playground of their own.",
    body: "Sport does things that a classroom cannot — it teaches losing, trying again, and belonging to a team. Our children train regularly, and it shows in how they carry themselves.",
    icon: "Trophy",
    photo: "football-training",
  },
].map((p) => programSchema.parse(p));
