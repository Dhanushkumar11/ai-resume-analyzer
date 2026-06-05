import { ArrowUpRight, Calendar, FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format.js";

export default function ResumeCard({ resume, onDelete, deleting }) {
  return (
    <article className="panel surface-hover group overflow-hidden">
      <div className="h-1 bg-slate-950 opacity-0 transition group-hover:opacity-100 dark:bg-white" />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shadow-sm transition group-hover:bg-slate-950 group-hover:text-white dark:bg-white/10 dark:text-slate-200 dark:group-hover:bg-white dark:group-hover:text-slate-950">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-extrabold text-slate-950 dark:text-white">{resume.filename}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(resume.created_at)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
          <Link to={`/resumes/${resume.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
            Open analysis
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button type="button" onClick={() => onDelete(resume.id)} disabled={deleting} className="btn-danger h-10 w-10 px-0" aria-label={`Delete ${resume.filename}`} title="Delete resume">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
