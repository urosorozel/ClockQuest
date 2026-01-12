import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnalogClock, { ClockTime } from "../components/AnalogClock";
import { lessons } from "../data/lessons";
import { useProgress } from "../components/ProgressProvider";
import { useSettings } from "../components/SettingsProvider";

const LessonPage = () => {
  const { lessonId } = useParams();
  const lesson = useMemo(
    () => lessons.find((item) => item.id === lessonId),
    [lessonId]
  );
  const { completeLesson } = useProgress();
  const { updateSettings } = useSettings();

  const [stepIndex, setStepIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [time, setTime] = useState<ClockTime>({
    hours: 3,
    minutes: 0
  });

  useEffect(() => {
    if (lesson) {
      updateSettings({ snapMode: lesson.snapMode });
    }
  }, [lesson, updateSettings]);

  if (!lesson) {
    return (
      <div className="page">
        <p>Lesson not found.</p>
        <Link to="/learn" className="button secondary">
          Back to lessons
        </Link>
      </div>
    );
  }

  const introDone = stepIndex >= lesson.steps.length;
  const currentTarget = lesson.targets[targetIndex];
  const isComplete = targetIndex >= lesson.targets.length;

  const resetForTarget = () => {
    setFeedback(null);
    setShowHint(false);
    updateSettings({ snapMode: lesson.snapMode });
  };

  const checkAnswer = () => {
    if (!currentTarget) return;
    const matches =
      time.hours % 12 === currentTarget.hours % 12 &&
      time.minutes === currentTarget.minutes;
    if (matches) {
      setStars((prev) => Math.min(lesson.targets.length, prev + 1));
      setFeedback("Great job! ⭐");
      setTimeout(() => {
        setTargetIndex((prev) => prev + 1);
        resetForTarget();
      }, 600);
    } else {
      setFeedback("Nice try! Use the hint or try again.");
    }
  };

  const handleComplete = () => {
    completeLesson(lesson.id, stars);
  };

  useEffect(() => {
    if (introDone && isComplete) {
      completeLesson(lesson.id, stars);
    }
  }, [completeLesson, introDone, isComplete, lesson.id, stars]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </header>

      {!introDone && (
        <section className="lesson-card">
          <p>{lesson.steps[stepIndex]}</p>
          <div className="lesson-actions">
            <button
              type="button"
              className="button primary"
              onClick={() => setStepIndex((prev) => prev + 1)}
            >
              Next
            </button>
            <Link to="/learn" className="button secondary">
              Save for later
            </Link>
          </div>
        </section>
      )}

      {introDone && !isComplete && (
        <section className="lesson-play">
          <div className="prompt">
            <h2>
              Task {targetIndex + 1} of {lesson.targets.length}
            </h2>
            <p>
              Set the clock to {currentTarget.hours}:
              {String(currentTarget.minutes).padStart(2, "0")}
            </p>
          </div>
          <AnalogClock
            time={time}
            onChange={setTime}
            showHint={showHint}
            highlightMinute={showHint ? currentTarget.minutes : null}
          />
          <div className="lesson-actions">
            <button
              type="button"
              className="button primary"
              onClick={checkAnswer}
            >
              Check
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => setShowHint((prev) => !prev)}
            >
              {showHint ? "Hide hint" : "Hint"}
            </button>
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
          {showHint && <p className="hint">{lesson.hint}</p>}
        </section>
      )}

      {introDone && isComplete && (
        <section className="lesson-card">
          <h2>Lesson complete! 🎉</h2>
          <p>You earned {stars} stars.</p>
          <div className="lesson-actions">
            <Link to="/learn" className="button primary" onClick={handleComplete}>
              Back to lessons
            </Link>
            <Link to="/practice" className="button secondary">
              Practice next
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LessonPage;
