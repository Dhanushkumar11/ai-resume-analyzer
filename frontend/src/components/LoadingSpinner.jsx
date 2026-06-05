export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <div className="panel flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-500 dark:text-slate-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-white/20 dark:border-t-white" />
        <span>{label}</span>
      </div>
    </div>
  );
}
