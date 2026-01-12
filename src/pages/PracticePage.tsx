import { useEffect, useMemo, useState } from "react";
import AnalogClock, { ClockTime } from "../components/AnalogClock";
import { useProgress } from "../components/ProgressProvider";
import { useSettings } from "../components/SettingsProvider";

const difficulties = [
  { id: "easy", label: "Easy (5-min steps)", snap: "5" as const },
  { id: "medium", label: "Medium (1-min steps)", snap: "1" as const },
  { id: "hard", label: "Hard (any minute)", snap: "none" as const }
];

type PracticeType = "set" | "read";

const getRandomTime = (snap: "none" | "5" | "1"): ClockTime => {
  const minutes =
    snap === "5"
      ? Math.floor(Math.random() * 12) * 5
      : Math.floor(Math.random() * 60);
  const hours = Math.floor(Math.random() * 12) + 1;
  return { hours, minutes };
};

const formatTime = (time: ClockTime) =>
  `${time.hours}:${String(time.minutes).padStart(2, "0")}`;

const PracticePage = () => {
  const { settings, updateSettings } = useSettings();
  const { recordPractice } = useProgress();
  const [practiceType, setPracticeType] = useState<PracticeType>("set");
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [target, setTarget] = useState<ClockTime>(() =>
    getRandomTime(difficulties[0].snap)
  );
  const [time, setTime] = useState<ClockTime>({ hours: 3, minutes: 0 });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    updateSettings({ snapMode: difficulty.snap });
  }, [difficulty.snap, updateSettings]);

  const options = useMemo(() => {
    if (practiceType !== "read") return [];
    const optionSet = new Set<string>();
    optionSet.add(formatTime(target));
    while (optionSet.size < 3) {
      optionSet.add(formatTime(getRandomTime(difficulty.snap)));
    }
    return Array.from(optionSet).sort(() => Math.random() - 0.5);
  }, [practiceType, target, difficulty.snap]);

  const nextQuestion = () => {
    const next = getRandomTime(difficulty.snap);
    setTarget(next);
    setTime({ hours: 3, minutes: 0 });
    setFeedback(null);
    setQuestionCount((prev) => prev + 1);
  };

  const handleCheck = () => {
    const matches =
      time.hours % 12 === target.hours % 12 &&
      time.minutes === target.minutes;
    if (matches) {
      setFeedback("Correct! You earned a star ⭐");
      recordPractice(true);
      setTimeout(nextQuestion, 600);
    } else {
      const baseHint =
        difficulty.snap === "5"
          ? "Minute hand points to 5-minute marks."
          : "Use the minute marks to count carefully.";
      setFeedback(`Almost! ${baseHint} Try finding ${target.minutes}.`);
      recordPractice(false);
    }
  };

  const handleReadChoice = (choice: string) => {
    const isCorrect = choice === formatTime(target);
    if (isCorrect) {
      setFeedback("Yes! You read it right ⭐");
      recordPractice(true);
      setTimeout(nextQuestion, 600);
    } else {
      setFeedback("Close! Check where the minute hand points.");
      recordPractice(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Practice</h1>
        <p>Short practice bursts. Stop after 3–5 minutes.</p>
      </header>

      <section className="practice-controls">
        <div className="toggle-group">
          <button
            type="button"
            className={practiceType === "set" ? "chip active" : "chip"}
            onClick={() => setPracticeType("set")}
          >
            Set the clock
          </button>
          <button
            type="button"
            className={practiceType === "read" ? "chip active" : "chip"}
            onClick={() => setPracticeType("read")}
          >
            Read the clock
          </button>
        </div>
        <label className="select">
          Difficulty
          <select
            value={difficulty.id}
            onChange={(event) =>
              setDifficulty(
                difficulties.find((item) => item.id === event.target.value) ??
                  difficulties[0]
              )
            }
          >
            {difficulties.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="practice-panel">
        {practiceType === "set" ? (
          <>
            <h2>Set the clock to {formatTime(target)}</h2>
            <AnalogClock time={time} onChange={setTime} />
            <button className="button primary" onClick={handleCheck}>
              Check
            </button>
          </>
        ) : (
          <>
            <h2>What time is it?</h2>
            <AnalogClock time={target} showDigitalOverride={false} />
            <div className="choice-grid" role="group" aria-label="Answer choices">
              {options.map((option) => (
                <button
                  key={option}
                  className="button secondary"
                  onClick={() => handleReadChoice(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
        {feedback && <p className="feedback">{feedback}</p>}
        {questionCount >= 5 && (
          <p className="hint">
            Nice work! Consider a short break or switch to Learn mode.
          </p>
        )}
        {settings.soundOn && (
          <p className="hint">Sound is on (coming soon!).</p>
        )}
      </section>
    </div>
  );
};

export default PracticePage;
