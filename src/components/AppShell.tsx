import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const LearnIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 4 3 8l9 4 9-4-9-4Zm7 6v6.5a1 1 0 0 1-.6.9L12 21l-6.4-3.6a1 1 0 0 1-.6-.9V10l7 3.1L19 10Z"
      fill="currentColor"
    />
  </svg>
);

const PracticeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 4h10v2h2v3a5 5 0 0 1-4 4.9V16h2v2H7v-2h2v-2.1A5 5 0 0 1 5 9V6h2V4Zm10 5V8h-2v4a3 3 0 0 0 2-3Zm-10 0a3 3 0 0 0 2 3V8H7v1Z"
      fill="currentColor"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 7.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm9 4.5-2.1-.7a7.2 7.2 0 0 0-.6-1.5l1.2-1.9-2.1-2.1-1.9 1.2a7.2 7.2 0 0 0-1.5-.6L12 3 10.3 5.1a7.2 7.2 0 0 0-1.5.6L6.9 4.5 4.8 6.6l1.2 1.9a7.2 7.2 0 0 0-.6 1.5L3 12l2.1.7a7.2 7.2 0 0 0 .6 1.5L4.5 16.1l2.1 2.1 1.9-1.2a7.2 7.2 0 0 0 1.5.6L12 21l1.7-2.1a7.2 7.2 0 0 0 1.5-.6l1.9 1.2 2.1-2.1-1.2-1.9a7.2 7.2 0 0 0 .6-1.5Z"
      fill="currentColor"
    />
  </svg>
);

const AppShell = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="brand">
          ClockQuest
        </Link>
        <nav className="app-nav" aria-label="Primary">
          <Link
            to="/learn"
            className={location.pathname.startsWith("/learn") ? "active" : ""}
          >
            <span className="nav-icon learn">
              <LearnIcon />
            </span>
            Learn
          </Link>
          <Link
            to="/practice"
            className={location.pathname === "/practice" ? "active" : ""}
          >
            <span className="nav-icon practice">
              <PracticeIcon />
            </span>
            Practice
          </Link>
          <Link
            to="/settings"
            className={location.pathname === "/settings" ? "active" : ""}
          >
            <span className="nav-icon settings">
              <SettingsIcon />
            </span>
            Settings
          </Link>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default AppShell;
