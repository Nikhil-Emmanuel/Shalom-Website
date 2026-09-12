import { timelineEntrySchema, type TimelineEntry } from "./schema";

export const story = {
  title: "It started with a promise nobody heard.",
  paragraphs: [
    "When Samuel P. G. arrived in Bangalore in 1978, he met children living on the street-hungry, unwell, and entirely on their own. He had nothing to give them at the time.",
    "What he had instead was a conviction that would not leave him alone: that one day he would be the help those children needed. He made that promise quietly, and then spent decades keeping it.",
    "In 2018, Shalom Children's Home was formally registered. The promise finally had a roof, a kitchen, and a front door-and children on the other side of it.",
    "Today Samuel runs the home together with his family. Thirty children live here. Fifty-seven more are taught in village centres nearby. The work has grown, but it is still the same promise.",
  ],
} as const;

export const timeline: TimelineEntry[] = [
  {
    year: "1978",
    title: "A promise in Bangalore",
    body: "Samuel P. G. arrives in the city and meets destitute children in distress. He resolves that one day he will be able to help them.",
  },
  {
    year: "2018",
    title: "Shalom is registered",
    body: "The home is formally registered as a children's home on 3 April 2018, under registration BK/IV 5/2018-2019.",
  },
  {
    year: "Today",
    title: "Thirty at home, fifty-seven in the villages",
    body: "Shalom houses thirty children aged six to eighteen, and runs tuition centres reaching fifty-seven more in surrounding villages.",
  },
].map((t) => timelineEntrySchema.parse(t));

export const values = [
  {
    title: "Care before charity",
    body: "The children here are not a cause. They are a household-with routines, birthdays, arguments and homework.",
  },
  {
    title: "Education is the exit",
    body: "Everything we do protects one thing above all: that each child stays in school and finishes it.",
  },
  {
    title: "Family, not an institution",
    body: "The home is run by a family, and it feels like one. That is deliberate, and we guard it.",
  },
  {
    title: "Reach past the gate",
    body: "Children who still have families should stay with them. Our village centres exist so that they can.",
  },
] as const;
