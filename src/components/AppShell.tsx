import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

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
            Learn
          </Link>
          <Link
            to="/practice"
            className={location.pathname === "/practice" ? "active" : ""}
          >
            Practice
          </Link>
          <Link
            to="/settings"
            className={location.pathname === "/settings" ? "active" : ""}
          >
            Settings
          </Link>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default AppShell;
