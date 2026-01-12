export type LessonTarget = {
  hours: number;
  minutes: number;
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  targets: LessonTarget[];
  hint: string;
  snapMode: "5" | "1";
};

export const lessons: Lesson[] = [
  {
    id: "hours",
    title: "Lesson 1: Hours only",
    summary: "When the minute hand points to 12, we only say the hour.",
    steps: [
      "The short hand is the hour hand.",
      "When the minute hand is at 12, we say o'clock."
    ],
    targets: [
      { hours: 2, minutes: 0 },
      { hours: 5, minutes: 0 },
      { hours: 8, minutes: 0 },
      { hours: 11, minutes: 0 },
      { hours: 3, minutes: 0 }
    ],
    hint: "Minute hand stays on 12. Just move the short hand!",
    snapMode: "5"
  },
  {
    id: "half",
    title: "Lesson 2: Half past",
    summary: "When the minute hand points to 6, it is half past the hour.",
    steps: ["Half past means 30 minutes.", "The minute hand points to 6."],
    targets: [
      { hours: 1, minutes: 30 },
      { hours: 4, minutes: 30 },
      { hours: 7, minutes: 30 },
      { hours: 9, minutes: 30 },
      { hours: 12, minutes: 30 }
    ],
    hint: "Look for the minute hand at 6 for half past.",
    snapMode: "5"
  },
  {
    id: "quarters",
    title: "Lesson 3: Quarter past & to",
    summary: "Minute hand at 3 is quarter past. At 9 is quarter to.",
    steps: ["3 means 15 minutes.", "9 means 45 minutes."],
    targets: [
      { hours: 6, minutes: 15 },
      { hours: 10, minutes: 45 },
      { hours: 2, minutes: 15 },
      { hours: 5, minutes: 45 },
      { hours: 8, minutes: 15 }
    ],
    hint: "Quarter past is 15. Quarter to is 45.",
    snapMode: "5"
  },
  {
    id: "five",
    title: "Lesson 4: 5-minute steps",
    summary: "Minute hand moves in jumps of 5 minutes.",
    steps: ["Count by fives around the clock.", "Each big mark = 5 minutes."],
    targets: [
      { hours: 3, minutes: 5 },
      { hours: 7, minutes: 20 },
      { hours: 9, minutes: 40 },
      { hours: 12, minutes: 55 },
      { hours: 1, minutes: 10 }
    ],
    hint: "Count by fives. 5, 10, 15, 20...",
    snapMode: "5"
  },
  {
    id: "any",
    title: "Lesson 5: Any minute",
    summary: "Now you can use every minute mark.",
    steps: ["Each tiny mark is one minute.", "The hour hand slides as minutes pass."],
    targets: [
      { hours: 4, minutes: 12 },
      { hours: 11, minutes: 28 },
      { hours: 6, minutes: 37 },
      { hours: 2, minutes: 49 },
      { hours: 8, minutes: 3 }
    ],
    hint: "Use the minute marks to count carefully.",
    snapMode: "1"
  }
];
