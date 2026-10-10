import { FilePlus2, Sparkles } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="panel flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-800 shadow-sm dark:bg-white/10 dark:text-white">
        <FilePlus2 className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">Start with your first resume review</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Upload a PDF to create a structured report with a readiness score, matched skills, missing skills, role suggestions, and prioritized improvements.
      </p>
      <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
        <Sparkles className="h-3.5 w-3.5" />
        Your report appears here after analysis
      </div>
    </div>
  );
}
