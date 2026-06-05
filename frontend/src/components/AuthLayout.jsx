import { Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1fr_0.9fr]">
        <section className="flex min-h-[38vh] flex-col justify-between bg-slate-950 px-6 py-6 text-white sm:px-10 lg:min-h-screen lg:px-12">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold">ResumeIQ</span>
              <span className="block text-xs text-slate-400">AI Resume Analyzer</span>
            </span>
          </div>

          <div className="max-w-2xl py-12 lg:py-0">
            <p className="mb-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              LinkedIn-ready insights
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Turn every resume into a sharper career signal.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Upload a PDF, surface matching skills, and review AI guidance in a clean workspace built for serious job searches.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
            <div className="rounded-lg border border-white/10 p-3">
              <strong className="block text-lg text-white">PDF</strong>
              Uploads
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <strong className="block text-lg text-white">AI</strong>
              Analysis
            </div>
            <div className="rounded-lg border border-white/10 p-3">
              <strong className="block text-lg text-white">JWT</strong>
              Secure
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="panel p-6 sm:p-7">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
