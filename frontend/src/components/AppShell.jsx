import { FileText, LogOut, Sparkles } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b12]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#080b12]/85">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md dark:bg-white dark:text-slate-950">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-extrabold leading-5 text-slate-950 dark:text-white">ResumeIQ</span>
              <span className="hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:block">Resume intelligence</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-slate-100 text-slate-950 dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`
              }
            >
              <FileText className="h-4 w-4" />
              Dashboard
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden max-w-48 truncate text-right text-sm sm:block">
              <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{user?.name || "Member"}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <ThemeToggle />
            <button type="button" onClick={handleLogout} className="btn-secondary h-10 w-10 px-0" aria-label="Log out" title="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="page-enter mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
