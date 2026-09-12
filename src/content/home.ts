import { journeyStopSchema, statSchema, type JourneyStop, type Stat } from "./schema";

export const hero = {
  eyebrow: "Hennur, Bangalore",
  // Line breaks are deliberate-each renders as its own masked, animated line.
  headline: "Every child\ndeserves a place\nto come home to.",
  body: "Shalom Children's Home gives thirty children a bed, three meals, a school uniform and a family-and reaches fifty-seven more through tuition centres in the villages around us.",
  primaryCta: { label: "Ways to help", href: "/get-involved" },
  secondaryCta: { label: "See our work", href: "/programs" },
} as const;

export const stats: Stat[] = [
  {
    value: 30,
    suffix: "",
    label: "Children call Shalom home",
    detail: "Boys and girls, aged six to eighteen",
  },
  {
    value: 57,
    suffix: "",
    label: "Learn at village tuition centres",
    detail: "After-school teaching, books and supplies",
  },
  {
    value: 48,
    suffix: "",
    label: "Years since the first promise",
    detail: "Made in Bangalore in 1978",
  },
].map((s) => statSchema.parse(s));

export const mission = {
  lead: "We provide shelter, food, education and medical care.",
  body: "Our work reaches past our own gate-into villages, where children who would otherwise fall behind get the teaching and the supplies they need to keep up. Every part of it is rooted in the same conviction: that a child given care, consistency and a chance will take it.",
} as const;

/**
 * The pinned horizontal journey on the home page.
 * Every photo referenced here must survive the safeguarding filter-these are
 * all classified `incidental`, so they render under the default policy.
 */
export const journey: JourneyStop[] = [
  {
    id: "morning",
    time: "7:00 am",
    title: "The bus comes early",
    body: "Uniforms pressed, bags packed, hair tied. The school bus pulls up at the end of the road and the day begins.",
    photo: "school-bus-morning",
  },
  {
    id: "midday",
    time: "12:30 pm",
    title: "Lunch at the long table",
    body: "Rice and curry, cooked here in our own kitchen. Everyone queues, everyone eats, nobody goes without.",
    photo: "lunch-queue",
  },
  {
    id: "afternoon",
    time: "4:00 pm",
    title: "Homework, then the swings",
    body: "Books first. Then the part of the day they have been waiting for since breakfast.",
    photo: "play-area",
  },
  {
    id: "evening",
    time: "5:30 pm",
    title: "Football on the turf",
    body: "Coaching sessions on a full-size pitch. For some of them it is the best hour of the week.",
    photo: "football-training",
  },
  {
    id: "health",
    time: "Every month",
    title: "The doctor visits",
    body: "Regular check-up camps mean small problems are caught early, and nobody's health quietly slips.",
    photo: "medical-camp",
  },
  {
    id: "celebration",
    time: "And sometimes",
    title: "There is a stage, and lights",
    body: "Independence Day, birthdays, festivals. Reasons to dress up, perform, and be applauded.",
    photo: "celebration-performance",
  },
].map((s) => journeyStopSchema.parse(s));
