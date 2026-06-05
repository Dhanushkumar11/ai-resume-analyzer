import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ open, title, message, confirmLabel = "Delete", onCancel, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="btn-danger">
            {loading ? "Deleting" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
