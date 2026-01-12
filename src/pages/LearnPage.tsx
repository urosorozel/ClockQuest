import { Link } from "react-router-dom";
import { lessons } from "../data/lessons";
import { useProgress } from "../components/ProgressProvider";

const LearnPage = () => {
  const { progress } = useProgress();
  return (
    <div className="page">
      <header className="page-header">
        <h1>Learn</h1>
        <p>Short lessons with quick wins.</p>
      </header>
      <div className="lesson-grid">
        {lessons.map((lesson) => {
          const lessonProgress = progress.lessons[lesson.id];
          return (
            <Link key={lesson.id} to={`/learn/${lesson.id}`} className="card">
              <h2>{lesson.title}</h2>
              <p>{lesson.summary}</p>
              <div className="card-footer">
                <span className="stars">
                  {"★".repeat(lessonProgress?.stars ?? 0) || "☆"}
                </span>
                <span className="tag">
                  {lessonProgress?.completed ? "Done" : "Start"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LearnPage;
