import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import LessonPage from "./pages/LessonPage";
import PracticePage from "./pages/PracticePage";
import SettingsPage from "./pages/SettingsPage";
import AppShell from "./components/AppShell";
import { SettingsProvider } from "./components/SettingsProvider";
import { ProgressProvider } from "./components/ProgressProvider";

const App = () => {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:lessonId" element={<LessonPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppShell>
      </ProgressProvider>
    </SettingsProvider>
  );
};

export default App;
