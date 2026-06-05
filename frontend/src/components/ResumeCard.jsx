import { Calendar, Eye, FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/format.js";

export default function ResumeCard({ resume, onDelete, deleting }) {
  return (
    <article className="panel p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:hover:border-cyan-400/50">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-950 dark:text-white">{resume.filename}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(resume.created_at)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to={`/resumes/${resume.id}`} className="btn-secondary flex-1">
          <Eye className="h-4 w-4" />
          View
        </Link>
        <button type="button" onClick={() => onDelete(resume.id)} disabled={deleting} className="btn-danger h-10 w-10 px-0" aria-label={`Delete ${resume.filename}`} title="Delete resume">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
