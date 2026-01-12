import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { defaultProgress, loadProgress, saveProgress } from "../utils/storage";

export type ProgressContextValue = {
  progress: typeof defaultProgress;
  completeLesson: (lessonId: string, stars: number) => void;
  recordPractice: (isCorrect: boolean) => void;
  resetStreak: () => void;
};

const ProgressContext = createContext<ProgressContextValue | undefined>(
  undefined
);

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveProgress(progress);
    }
  }, [isLoaded, progress]);

  const completeLesson = (lessonId: string, stars: number) => {
    setProgress((prev) => {
      const existing = prev.lessons[lessonId];
      const newStars = Math.max(existing?.stars ?? 0, stars);
      return {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: { stars: newStars, completed: true }
        }
      };
    });
  };

  const recordPractice = (isCorrect: boolean) => {
    setProgress((prev) => {
      const totalAnswered = prev.totalAnswered + 1;
      const totalCorrect = prev.totalCorrect + (isCorrect ? 1 : 0);
      const accuracy = Math.round((totalCorrect / totalAnswered) * 100);
      const bestStreak = isCorrect
        ? Math.max(prev.bestStreak, Math.floor(totalCorrect / 3))
        : prev.bestStreak;
      return {
        ...prev,
        totalAnswered,
        totalCorrect,
        accuracy,
        bestStreak
      };
    });
  };

  const resetStreak = () => {
    setProgress((prev) => ({ ...prev, bestStreak: Math.max(prev.bestStreak, 0) }));
  };

  return (
    <ProgressContext.Provider
      value={{ progress, completeLesson, recordPractice, resetStreak }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return context;
};
