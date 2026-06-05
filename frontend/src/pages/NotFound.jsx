import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="panel max-w-md p-7 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">404</p>
        <h1 className="mt-3 text-2xl font-extrabold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">The page you are looking for does not exist in this workspace.</p>
        <Link to="/dashboard" className="btn-primary mt-5">
          <ArrowLeft className="h-4 w-4" />
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
