import { FilePlus2 } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="panel flex min-h-64 flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
        <FilePlus2 className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-bold text-slate-950 dark:text-white">No resumes yet</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        Upload your first PDF to build a searchable resume history with AI analysis and matched skills.
      </p>
    </div>
  );
}
