import { BadgeCheck, FileText, LockKeyhole, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

export default function AuthLayout({ children, title, subtitle }) {
  const highlights = [
    { icon: FileText, title: "Resume history", description: "Every analysis saved in a focused workspace." },
    { icon: BadgeCheck, title: "ATS-aware review", description: "Structured feedback for practical job search decisions." },
    { icon: LockKeyhole, title: "Secure access", description: "JWT authentication keeps each account private." },
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#080b12]">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex min-h-[42vh] flex-col justify-between overflow-hidden bg-slate-950 px-6 py-6 text-white sm:px-10 lg:min-h-screen lg:px-12">
          <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-950 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-extrabold">ResumeIQ</span>
              <span className="block text-xs text-slate-400">AI Resume Analyzer</span>
            </span>
          </div>

          <div className="max-w-2xl py-12 lg:py-0">
            <p className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Career intelligence workspace
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Turn every resume into a sharper career signal.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              A calm, modern workspace for uploading resumes, reviewing AI guidance, and preparing portfolio-ready applications.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <item.icon className="mb-3 h-4 w-4 text-white" />
                <strong className="block text-sm text-white">{item.title}</strong>
                <span className="mt-1 block text-xs leading-5 text-slate-400">{item.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="page-enter flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{title}</h2>
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
