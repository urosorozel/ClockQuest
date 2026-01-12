# ClockQuest

ClockQuest is a mobile-first web app that helps kids (ages 6–12) learn to read analog time with short lessons and practice games. The UI is ADHD-friendly: short steps, big buttons, clear feedback, and optional hints.

## Quick start

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Project structure

- `src/App.tsx` – routes and providers
- `src/pages` – Home, Learn, Lesson, Practice, Settings
- `src/components/AnalogClock.tsx` – interactive clock with touch/keyboard controls
- `src/data/lessons.ts` – lesson content and target times
- `src/utils/storage.ts` – localStorage helpers for progress + settings
- `src/styles/global.css` – shared styles

## Extending lessons

1. Open `src/data/lessons.ts`.
2. Add a new object to the `lessons` array.
3. Provide the `targets` array with the times you want learners to practice.
4. Update `snapMode` to control minute snapping for the lesson.

## Notes

- Progress and settings are saved locally in the browser.
- The app is responsive and touch-first, with large 44px tap targets.
- Reduce motion is respected via `prefers-reduced-motion`.
