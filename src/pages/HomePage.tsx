import { Link } from "react-router-dom";
import { lessons } from "../data/lessons";
import { useProgress } from "../components/ProgressProvider";

const HomePage = () => {
  const { progress } = useProgress();
  const completedLessons = lessons.filter(
    (lesson) => progress.lessons[lesson.id]?.completed
  ).length;
  const totalStars = lessons.reduce(
    (sum, lesson) => sum + (progress.lessons[lesson.id]?.stars ?? 0),
    0
  );
  const nextLesson = lessons.find(
    (lesson) => !progress.lessons[lesson.id]?.completed
  );

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h1>ClockQuest</h1>
          <p>Quick, calm lessons that help you read time.</p>
        </div>
        <div className="hero-actions">
          <Link to="/learn" className="button primary">
            Learn
          </Link>
          <Link to="/practice" className="button secondary">
            Practice
          </Link>
        </div>
      </section>

      <section className="progress-card" aria-label="Progress summary">
        <h2>Your progress</h2>
        <div className="progress-stats">
          <div>
            <span className="stat">{completedLessons}</span>
            <span className="label">Lessons done</span>
          </div>
          <div>
            <span className="stat">{totalStars}</span>
            <span className="label">Stars earned</span>
          </div>
          <div>
            <span className="stat">{progress.accuracy}%</span>
            <span className="label">Practice accuracy</span>
          </div>
        </div>
        {nextLesson ? (
          <Link to={`/learn/${nextLesson.id}`} className="button primary">
            Continue: {nextLesson.title}
          </Link>
        ) : (
          <Link to="/practice" className="button primary">
            Keep practicing
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
